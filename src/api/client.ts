import { config } from "../config.js";
import { logger } from "../logger.js";

export class PocketIdError extends Error {
	status: number;
	method: string;
	path: string;
	body: string;

	constructor(status: number, method: string, path: string, body: string) {
		super(`Pocket ID ${method} ${path} failed (${status}): ${body}`);
		this.status = status;
		this.method = method;
		this.path = path;
		this.body = body;
	}
}

export const DEFAULT_TIMEOUT_MS = 30_000;

let availableCheckPromise: Promise<void> | null = null;

export async function ensurePocketIdAvailable(): Promise<void> {
	if (!availableCheckPromise) {
		availableCheckPromise = (async () => {
			const { url, apiKey } = config.pocketId;
			if (!url) {
				throw new Error("POCKETID_URL environment variable is not set");
			}
			if (!apiKey) {
				throw new Error("POCKETID_API_KEY environment variable is not set");
			}

			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 5_000);

			try {
				const resp = await fetch(`${url}/healthz`, {
					method: "GET",
					headers: { "X-API-KEY": apiKey },
					signal: controller.signal,
				});
				if (!resp.ok) {
					throw new Error(`Pocket ID health check failed (${resp.status})`);
				}
			} finally {
				clearTimeout(timeoutId);
			}
		})().catch((error) => {
			availableCheckPromise = null;
			throw error;
		});
	}

	return availableCheckPromise;
}

export type PaginationParams = {
	page?: number;
	limit?: number;
	search?: string;
	sortColumn?: string;
	sortDirection?: string;
};

function buildUrl(path: string, query?: Record<string, string>): string {
	const base = `${config.pocketId.url}${path}`;
	if (!query || Object.keys(query).length === 0) {
		return base;
	}
	const params = new URLSearchParams(query);
	return `${base}?${params.toString()}`;
}

export function buildPaginationQuery(pagination?: PaginationParams): Record<string, string> {
	const query: Record<string, string> = {};
	if (!pagination) {
		return query;
	}
	if (pagination.page !== undefined) {
		query["pagination[page]"] = String(pagination.page);
	}
	if (pagination.limit !== undefined) {
		query["pagination[limit]"] = String(pagination.limit);
	}
	if (pagination.search !== undefined) {
		query["search"] = pagination.search;
	}
	if (pagination.sortColumn !== undefined) {
		query["sort[column]"] = pagination.sortColumn;
	}
	if (pagination.sortDirection !== undefined) {
		query["sort[direction]"] = pagination.sortDirection;
	}
	return query;
}

async function request<T>(method: string, path: string, body?: unknown, query?: Record<string, string>, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<T> {
	await ensurePocketIdAvailable();

	const url = buildUrl(path, query);
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

	logger?.debug({ method, path }, "HTTP request");

	const headers: Record<string, string> = {
		"X-API-KEY": config.pocketId.apiKey,
	};

	const init: RequestInit = {
		method,
		headers,
		signal: controller.signal,
	};

	if (body !== undefined) {
		headers["Content-Type"] = "application/json";
		init.body = JSON.stringify(body);
	}

	try {
		const resp = await fetch(url, init);

		if (!resp.ok) {
			const text = await resp.text();
			throw new PocketIdError(resp.status, method, path, text);
		}

		if (resp.status === 204) {
			return undefined as T;
		}

		const contentType = resp.headers.get("content-type") ?? "";
		if (contentType.includes("application/json")) {
			return (await resp.json()) as T;
		}

		return (await resp.text()) as T;
	} finally {
		clearTimeout(timeoutId);
	}
}

export async function get<T>(path: string, query?: Record<string, string>): Promise<T> {
	return request<T>("GET", path, undefined, query);
}

export async function getList<T>(path: string, pagination?: PaginationParams): Promise<T> {
	return request<T>("GET", path, undefined, buildPaginationQuery(pagination));
}

export async function post<T>(path: string, body?: unknown): Promise<T> {
	return request<T>("POST", path, body);
}

export async function put<T>(path: string, body?: unknown): Promise<T> {
	return request<T>("PUT", path, body);
}

export async function del<T>(path: string): Promise<T> {
	return request<T>("DELETE", path);
}

export async function putFile<T>(path: string, base64Data: string, mimeType = "application/octet-stream"): Promise<T> {
	await ensurePocketIdAvailable();

	const url = buildUrl(path);
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

	logger?.debug({ method: "PUT", path }, "HTTP file upload");

	const binaryData = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
	const blob = new Blob([binaryData], { type: mimeType });
	const formData = new FormData();
	formData.append("file", blob, "upload");

	try {
		const resp = await fetch(url, {
			method: "PUT",
			headers: { "X-API-KEY": config.pocketId.apiKey },
			body: formData,
			signal: controller.signal,
		});

		if (!resp.ok) {
			const text = await resp.text();
			throw new PocketIdError(resp.status, "PUT", path, text);
		}

		if (resp.status === 204) {
			return undefined as T;
		}

		const contentType = resp.headers.get("content-type") ?? "";
		if (contentType.includes("application/json")) {
			return (await resp.json()) as T;
		}

		return (await resp.text()) as T;
	} finally {
		clearTimeout(timeoutId);
	}
}

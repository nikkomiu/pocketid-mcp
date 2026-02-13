import { logger } from "../logger.js";

export function toolText(text: string) {
	return {
		content: [{ type: "text" as const, text }],
	};
}

export function toolJson(data: unknown) {
	return {
		content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
	};
}

export function toolError(error: unknown) {
	const message = error instanceof Error ? error.message : String(error);
	return {
		content: [{ type: "text" as const, text: message }],
		isError: true,
	};
}

export type AuditInfo = {
	tool: string;
	httpMethod: string;
	path: string;
	resourceId?: string | null;
	success: boolean;
};

export function auditLog(info: AuditInfo) {
	logger?.info(info, "audit");
}

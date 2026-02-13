import { basename, dirname, isAbsolute, resolve } from "node:path";

const DEFAULT_LOG_FILE = "pocketid-mcp.log";
const DEFAULT_LOG_LEVEL = "info";
const DEFAULT_MAX_AGE_HOURS = 24;

function parseBooleanEnv(name: string, fallback: boolean, env: NodeJS.ProcessEnv): boolean {
	const value = env[name];
	if (!value) {
		return fallback;
	}

	return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

function parseNumberEnv(name: string, fallback: number, env: NodeJS.ProcessEnv): number {
	const value = env[name];
	if (!value) {
		return fallback;
	}

	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : fallback;
}

function resolveDefaultLogDir(): string {
	const execName = basename(process.execPath);
	const isBun = execName === "bun" || execName === "bun.exe";

	if (!isBun) {
		return dirname(process.execPath);
	}

	const scriptPath = process.argv[1];
	if (scriptPath) {
		return dirname(scriptPath);
	}

	return process.cwd();
}

function resolveLogFilePath(env: NodeJS.ProcessEnv): string {
	const logDirOverride = env.LOG_DIR;
	const defaultDir = logDirOverride ? resolve(logDirOverride) : resolveDefaultLogDir();
	const logFile = env.LOG_FILE;

	if (logFile) {
		if (isAbsolute(logFile)) {
			return logFile;
		}
		return resolve(logDirOverride ?? defaultDir, logFile);
	}

	return resolve(defaultDir, DEFAULT_LOG_FILE);
}

export type LogConfig = {
	filePath: string;
	level: string;
	truncate: boolean;
	maxAgeHours: number;
	logToStderr: boolean;
};

export type PocketIdConfig = {
	url: string;
	apiKey: string;
};

export type AppConfig = {
	log: LogConfig;
	pocketId: PocketIdConfig;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
	const rawUrl = env.POCKETID_URL ?? "";
	return {
		log: {
			filePath: resolveLogFilePath(env),
			level: env.LOG_LEVEL ?? DEFAULT_LOG_LEVEL,
			truncate: parseBooleanEnv("LOG_TRUNCATE", true, env),
			maxAgeHours: parseNumberEnv("LOG_MAX_AGE_HOURS", DEFAULT_MAX_AGE_HOURS, env),
			logToStderr: parseBooleanEnv("LOG_TO_STDERR", true, env),
		},
		pocketId: {
			url: rawUrl.replace(/\/+$/, ""),
			apiKey: env.POCKETID_API_KEY ?? "",
		},
	};
}

export const config = Object.freeze(loadConfig());

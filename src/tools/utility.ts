import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pocketIdApi } from "../api/index.js";
import { toolError, toolJson, toolText } from "./utils.js";

export function registerUtilityTools(server: McpServer) {
	server.registerTool(
		"health_check",
		{
			description: "Check Pocket ID health status",
			inputSchema: z.object({}).strict(),
		},
		async () => {
			try {
				const data = await pocketIdApi.utility.healthCheck();
				return typeof data === "string" ? toolText(data) : toolJson(data);
			} catch (error) {
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"version_latest",
		{
			description: "Get the latest Pocket ID version",
			inputSchema: z.object({}).strict(),
		},
		async () => {
			try {
				const data = await pocketIdApi.utility.latestVersion();
				return toolJson(data);
			} catch (error) {
				return toolError(error);
			}
		},
	);
}

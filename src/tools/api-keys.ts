import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pocketIdApi } from "../api/index.js";
import { auditLog, toolError, toolJson, toolText } from "./utils.js";

const paginationParams = {
	page: z.number().int().positive().optional(),
	limit: z.number().int().positive().optional(),
	search: z.string().optional(),
	sortColumn: z.string().optional(),
	sortDirection: z.enum(["asc", "desc"]).optional(),
};

export function registerApiKeyTools(server: McpServer) {
	server.registerTool(
		"api_key_list",
		{
			description: "List API keys (paginated)",
			inputSchema: z.object(paginationParams).strict(),
		},
		async (params) => {
			try {
				const data = await pocketIdApi.apiKeys.list(params);
				return toolJson(data);
			} catch (error) {
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"api_key_create",
		{
			description: "Create a new API key",
			inputSchema: z
				.object({
					name: z.string().min(3),
					expiresAt: z.string().datetime(),
					description: z.string().optional(),
				})
				.strict(),
		},
		async (params) => {
			const path = "/api/api-keys";
			try {
				const data = await pocketIdApi.apiKeys.create(params);
				auditLog({ tool: "api_key_create", httpMethod: "POST", path, resourceId: null, success: true });
				return toolJson(data);
			} catch (error) {
				auditLog({ tool: "api_key_create", httpMethod: "POST", path, resourceId: null, success: false });
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"api_key_renew",
		{
			description: "Renew an API key",
			inputSchema: z.object({ id: z.string().min(1) }).strict(),
		},
		async ({ id }) => {
			const path = `/api/api-keys/${id}/renew`;
			try {
				const data = await pocketIdApi.apiKeys.renew(id);
				auditLog({ tool: "api_key_renew", httpMethod: "POST", path, resourceId: id, success: true });
				return toolJson(data);
			} catch (error) {
				auditLog({ tool: "api_key_renew", httpMethod: "POST", path, resourceId: id, success: false });
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"api_key_delete",
		{
			description: "Delete an API key",
			inputSchema: z.object({ id: z.string().min(1) }).strict(),
		},
		async ({ id }) => {
			const path = `/api/api-keys/${id}`;
			try {
				await pocketIdApi.apiKeys.delete(id);
				auditLog({ tool: "api_key_delete", httpMethod: "DELETE", path, resourceId: id, success: true });
				return toolText("API key deleted");
			} catch (error) {
				auditLog({ tool: "api_key_delete", httpMethod: "DELETE", path, resourceId: id, success: false });
				return toolError(error);
			}
		},
	);
}

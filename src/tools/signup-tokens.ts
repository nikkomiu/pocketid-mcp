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

export function registerSignupTokenTools(server: McpServer) {
	server.registerTool(
		"signup_token_list",
		{
			description: "List signup tokens (paginated)",
			inputSchema: z.object(paginationParams).strict(),
		},
		async (params) => {
			try {
				const data = await pocketIdApi.signupTokens.list(params);
				return toolJson(data);
			} catch (error) {
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"signup_token_create",
		{
			description: "Create a new signup token",
			inputSchema: z
				.object({
					ttl: z.string().min(1),
					usageLimit: z.number().int().min(1).max(100),
					userGroupIds: z.array(z.string().min(1)).optional(),
				})
				.strict(),
		},
		async (params) => {
			const path = "/api/signup-tokens";
			try {
				const data = await pocketIdApi.signupTokens.create(params);
				auditLog({ tool: "signup_token_create", httpMethod: "POST", path, resourceId: null, success: true });
				return toolJson(data);
			} catch (error) {
				auditLog({ tool: "signup_token_create", httpMethod: "POST", path, resourceId: null, success: false });
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"signup_token_delete",
		{
			description: "Delete a signup token",
			inputSchema: z.object({ id: z.string().min(1) }).strict(),
		},
		async ({ id }) => {
			const path = `/api/signup-tokens/${id}`;
			try {
				await pocketIdApi.signupTokens.delete(id);
				auditLog({ tool: "signup_token_delete", httpMethod: "DELETE", path, resourceId: id, success: true });
				return toolText("Signup token deleted");
			} catch (error) {
				auditLog({ tool: "signup_token_delete", httpMethod: "DELETE", path, resourceId: id, success: false });
				return toolError(error);
			}
		},
	);
}

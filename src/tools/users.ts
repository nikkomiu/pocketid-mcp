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

export function registerUserTools(server: McpServer) {
	server.registerTool(
		"user_list",
		{
			description: "List users (paginated)",
			inputSchema: z.object(paginationParams).strict(),
		},
		async (params) => {
			try {
				const data = await pocketIdApi.users.list(params);
				return toolJson(data);
			} catch (error) {
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"user_get",
		{
			description: "Get a user by ID",
			inputSchema: z.object({ id: z.string().min(1) }).strict(),
		},
		async ({ id }) => {
			try {
				const data = await pocketIdApi.users.get(id);
				return toolJson(data);
			} catch (error) {
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"user_create",
		{
			description: "Create a new user",
			inputSchema: z
				.object({
					displayName: z.string().min(1),
					firstName: z.string().min(1),
					username: z.string().min(1),
					lastName: z.string().optional(),
					email: z.string().email().optional(),
					emailVerified: z.boolean().optional(),
					isAdmin: z.boolean().optional(),
					disabled: z.boolean().optional(),
					locale: z.string().optional(),
					userGroupIds: z.array(z.string().min(1)).optional(),
				})
				.strict(),
		},
		async (params) => {
			const path = "/api/users";
			try {
				const data = await pocketIdApi.users.create(params);
				auditLog({ tool: "user_create", httpMethod: "POST", path, resourceId: null, success: true });
				return toolJson(data);
			} catch (error) {
				auditLog({ tool: "user_create", httpMethod: "POST", path, resourceId: null, success: false });
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"user_update",
		{
			description: "Update an existing user",
			inputSchema: z
				.object({
					id: z.string().min(1),
					displayName: z.string().min(1).optional(),
					firstName: z.string().min(1).optional(),
					lastName: z.string().optional(),
					email: z.string().email().optional(),
					emailVerified: z.boolean().optional(),
					username: z.string().min(1).optional(),
					isAdmin: z.boolean().optional(),
					disabled: z.boolean().optional(),
					locale: z.string().optional(),
					userGroupIds: z.array(z.string().min(1)).optional(),
				})
				.strict(),
		},
		async ({ id, ...body }) => {
			const path = `/api/users/${id}`;
			try {
				const data = await pocketIdApi.users.update(id, body);
				auditLog({ tool: "user_update", httpMethod: "PUT", path, resourceId: id, success: true });
				return toolJson(data);
			} catch (error) {
				auditLog({ tool: "user_update", httpMethod: "PUT", path, resourceId: id, success: false });
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"user_delete",
		{
			description: "Delete a user",
			inputSchema: z.object({ id: z.string().min(1) }).strict(),
		},
		async ({ id }) => {
			const path = `/api/users/${id}`;
			try {
				await pocketIdApi.users.delete(id);
				auditLog({ tool: "user_delete", httpMethod: "DELETE", path, resourceId: id, success: true });
				return toolText("User deleted");
			} catch (error) {
				auditLog({ tool: "user_delete", httpMethod: "DELETE", path, resourceId: id, success: false });
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"user_groups",
		{
			description: "List groups a user belongs to",
			inputSchema: z.object({ id: z.string().min(1) }).strict(),
		},
		async ({ id }) => {
			try {
				const data = await pocketIdApi.users.getGroups(id);
				return toolJson(data);
			} catch (error) {
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"user_update_groups",
		{
			description: "Update the groups a user belongs to",
			inputSchema: z
				.object({
					id: z.string().min(1),
					userGroupIds: z.array(z.string().min(1)),
				})
				.strict(),
		},
		async ({ id, userGroupIds }) => {
			const path = `/api/users/${id}/user-groups`;
			try {
				const data = await pocketIdApi.users.updateGroups(id, userGroupIds);
				auditLog({ tool: "user_update_groups", httpMethod: "PUT", path, resourceId: id, success: true });
				return toolJson(data);
			} catch (error) {
				auditLog({ tool: "user_update_groups", httpMethod: "PUT", path, resourceId: id, success: false });
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"user_create_one_time_access_token",
		{
			description: "Create a one-time access token for a user",
			inputSchema: z.object({ id: z.string().min(1) }).strict(),
		},
		async ({ id }) => {
			const path = `/api/users/${id}/one-time-access-token`;
			try {
				const data = await pocketIdApi.users.createOneTimeToken(id);
				auditLog({ tool: "user_create_one_time_access_token", httpMethod: "POST", path, resourceId: id, success: true });
				return toolJson(data);
			} catch (error) {
				auditLog({ tool: "user_create_one_time_access_token", httpMethod: "POST", path, resourceId: id, success: false });
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"user_send_access_email",
		{
			description: "Send a one-time access email to a user",
			inputSchema: z.object({ id: z.string().min(1) }).strict(),
		},
		async ({ id }) => {
			const path = `/api/users/${id}/one-time-access-email`;
			try {
				await pocketIdApi.users.sendOneTimeEmail(id);
				auditLog({ tool: "user_send_access_email", httpMethod: "POST", path, resourceId: id, success: true });
				return toolText("One-time access email sent");
			} catch (error) {
				auditLog({ tool: "user_send_access_email", httpMethod: "POST", path, resourceId: id, success: false });
				return toolError(error);
			}
		},
	);
}

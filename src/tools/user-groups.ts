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

export function registerUserGroupTools(server: McpServer) {
	server.registerTool(
		"user_group_list",
		{
			description: "List user groups (paginated)",
			inputSchema: z.object(paginationParams).strict(),
		},
		async (params) => {
			try {
				const data = await pocketIdApi.userGroups.list(params);
				return toolJson(data);
			} catch (error) {
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"user_group_get",
		{
			description: "Get a user group by ID",
			inputSchema: z.object({ id: z.string().min(1) }).strict(),
		},
		async ({ id }) => {
			try {
				const data = await pocketIdApi.userGroups.get(id);
				return toolJson(data);
			} catch (error) {
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"user_group_create",
		{
			description: "Create a new user group",
			inputSchema: z
				.object({
					friendlyName: z.string().min(1),
					name: z.string().min(1),
				})
				.strict(),
		},
		async (params) => {
			const path = "/api/user-groups";
			try {
				const data = await pocketIdApi.userGroups.create(params);
				auditLog({ tool: "user_group_create", httpMethod: "POST", path, resourceId: null, success: true });
				return toolJson(data);
			} catch (error) {
				auditLog({ tool: "user_group_create", httpMethod: "POST", path, resourceId: null, success: false });
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"user_group_update",
		{
			description: "Update a user group",
			inputSchema: z
				.object({
					id: z.string().min(1),
					friendlyName: z.string().min(1).optional(),
					name: z.string().min(1).optional(),
				})
				.strict(),
		},
		async ({ id, ...body }) => {
			const path = `/api/user-groups/${id}`;
			try {
				const data = await pocketIdApi.userGroups.update(id, body);
				auditLog({ tool: "user_group_update", httpMethod: "PUT", path, resourceId: id, success: true });
				return toolJson(data);
			} catch (error) {
				auditLog({ tool: "user_group_update", httpMethod: "PUT", path, resourceId: id, success: false });
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"user_group_delete",
		{
			description: "Delete a user group",
			inputSchema: z.object({ id: z.string().min(1) }).strict(),
		},
		async ({ id }) => {
			const path = `/api/user-groups/${id}`;
			try {
				await pocketIdApi.userGroups.delete(id);
				auditLog({ tool: "user_group_delete", httpMethod: "DELETE", path, resourceId: id, success: true });
				return toolText("User group deleted");
			} catch (error) {
				auditLog({ tool: "user_group_delete", httpMethod: "DELETE", path, resourceId: id, success: false });
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"user_group_update_users",
		{
			description: "Update users in a group",
			inputSchema: z
				.object({
					id: z.string().min(1),
					userIds: z.array(z.string().min(1)),
				})
				.strict(),
		},
		async ({ id, userIds }) => {
			const path = `/api/user-groups/${id}/users`;
			try {
				const data = await pocketIdApi.userGroups.updateUsers(id, userIds);
				auditLog({ tool: "user_group_update_users", httpMethod: "PUT", path, resourceId: id, success: true });
				return toolJson(data);
			} catch (error) {
				auditLog({ tool: "user_group_update_users", httpMethod: "PUT", path, resourceId: id, success: false });
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"user_group_update_allowed_clients",
		{
			description: "Update allowed OIDC clients for a user group",
			inputSchema: z
				.object({
					id: z.string().min(1),
					oidcClientIds: z.array(z.string().min(1)),
				})
				.strict(),
		},
		async ({ id, oidcClientIds }) => {
			const path = `/api/user-groups/${id}/allowed-oidc-clients`;
			try {
				const data = await pocketIdApi.userGroups.updateAllowedClients(id, oidcClientIds);
				auditLog({ tool: "user_group_update_allowed_clients", httpMethod: "PUT", path, resourceId: id, success: true });
				return toolJson(data);
			} catch (error) {
				auditLog({ tool: "user_group_update_allowed_clients", httpMethod: "PUT", path, resourceId: id, success: false });
				return toolError(error);
			}
		},
	);
}

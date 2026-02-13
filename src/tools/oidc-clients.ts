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

export function registerOidcClientTools(server: McpServer) {
	server.registerTool(
		"oidc_client_list",
		{
			description: "List OIDC clients (paginated)",
			inputSchema: z.object(paginationParams).strict(),
		},
		async (params) => {
			try {
				const data = await pocketIdApi.oidcClients.list(params);
				return toolJson(data);
			} catch (error) {
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"oidc_client_get",
		{
			description: "Get an OIDC client by ID",
			inputSchema: z.object({ id: z.string().min(1) }).strict(),
		},
		async ({ id }) => {
			try {
				const data = await pocketIdApi.oidcClients.get(id);
				return toolJson(data);
			} catch (error) {
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"oidc_client_create",
		{
			description: "Create a new OIDC client",
			inputSchema: z
				.object({
					name: z.string().min(1),
					callbackURLs: z.array(z.string()).optional(),
					logoutURLs: z.array(z.string()).optional(),
					isPublic: z.boolean().optional(),
					pkceEnabled: z.boolean().optional(),
					hasLogo: z.boolean().optional(),
				})
				.strict(),
		},
		async (params) => {
			const path = "/api/oidc/clients";
			try {
				const data = await pocketIdApi.oidcClients.create(params);
				auditLog({ tool: "oidc_client_create", httpMethod: "POST", path, resourceId: null, success: true });
				return toolJson(data);
			} catch (error) {
				auditLog({ tool: "oidc_client_create", httpMethod: "POST", path, resourceId: null, success: false });
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"oidc_client_update",
		{
			description: "Update an OIDC client",
			inputSchema: z
				.object({
					id: z.string().min(1),
					name: z.string().min(1).optional(),
					callbackURLs: z.array(z.string()).optional(),
					logoutURLs: z.array(z.string()).optional(),
					isPublic: z.boolean().optional(),
					pkceEnabled: z.boolean().optional(),
					hasLogo: z.boolean().optional(),
				})
				.strict(),
		},
		async ({ id, ...body }) => {
			const path = `/api/oidc/clients/${id}`;
			try {
				const data = await pocketIdApi.oidcClients.update(id, body);
				auditLog({ tool: "oidc_client_update", httpMethod: "PUT", path, resourceId: id, success: true });
				return toolJson(data);
			} catch (error) {
				auditLog({ tool: "oidc_client_update", httpMethod: "PUT", path, resourceId: id, success: false });
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"oidc_client_delete",
		{
			description: "Delete an OIDC client",
			inputSchema: z.object({ id: z.string().min(1) }).strict(),
		},
		async ({ id }) => {
			const path = `/api/oidc/clients/${id}`;
			try {
				await pocketIdApi.oidcClients.delete(id);
				auditLog({ tool: "oidc_client_delete", httpMethod: "DELETE", path, resourceId: id, success: true });
				return toolText("OIDC client deleted");
			} catch (error) {
				auditLog({ tool: "oidc_client_delete", httpMethod: "DELETE", path, resourceId: id, success: false });
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"oidc_client_create_secret",
		{
			description: "Create a new secret for an OIDC client",
			inputSchema: z.object({ id: z.string().min(1) }).strict(),
		},
		async ({ id }) => {
			const path = `/api/oidc/clients/${id}/secret`;
			try {
				const data = await pocketIdApi.oidcClients.createSecret(id);
				auditLog({ tool: "oidc_client_create_secret", httpMethod: "POST", path, resourceId: id, success: true });
				return toolJson(data);
			} catch (error) {
				auditLog({ tool: "oidc_client_create_secret", httpMethod: "POST", path, resourceId: id, success: false });
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"oidc_client_update_allowed_groups",
		{
			description: "Update allowed user groups for an OIDC client",
			inputSchema: z
				.object({
					id: z.string().min(1),
					userGroupIds: z.array(z.string().min(1)),
				})
				.strict(),
		},
		async ({ id, userGroupIds }) => {
			const path = `/api/oidc/clients/${id}/allowed-user-groups`;
			try {
				const data = await pocketIdApi.oidcClients.updateAllowedGroups(id, userGroupIds);
				auditLog({ tool: "oidc_client_update_allowed_groups", httpMethod: "PUT", path, resourceId: id, success: true });
				return toolJson(data);
			} catch (error) {
				auditLog({ tool: "oidc_client_update_allowed_groups", httpMethod: "PUT", path, resourceId: id, success: false });
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"oidc_client_preview_claims",
		{
			description: "Preview OIDC claims for a client and user",
			inputSchema: z
				.object({
					id: z.string().min(1),
					userId: z.string().min(1),
				})
				.strict(),
		},
		async ({ id, userId }) => {
			try {
				const data = await pocketIdApi.oidcClients.previewForUser(id, userId);
				return toolJson(data);
			} catch (error) {
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"oidc_client_authorized_list",
		{
			description: "List authorized OIDC clients for a user",
			inputSchema: z.object({ userId: z.string().min(1) }).strict(),
		},
		async ({ userId }) => {
			try {
				const data = await pocketIdApi.oidcClients.listAuthorizedForUser(userId);
				return toolJson(data);
			} catch (error) {
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"oidc_client_revoke_authorization",
		{
			description: "Revoke OIDC client authorization for the current user",
			inputSchema: z.object({ clientId: z.string().min(1) }).strict(),
		},
		async ({ clientId }) => {
			const path = `/api/oidc/users/me/authorized-clients/${clientId}`;
			try {
				await pocketIdApi.oidcClients.revokeAuthorizationForCurrentUser(clientId);
				auditLog({ tool: "oidc_client_revoke_authorization", httpMethod: "DELETE", path, resourceId: clientId, success: true });
				return toolText("Authorization revoked");
			} catch (error) {
				auditLog({ tool: "oidc_client_revoke_authorization", httpMethod: "DELETE", path, resourceId: clientId, success: false });
				return toolError(error);
			}
		},
	);
}

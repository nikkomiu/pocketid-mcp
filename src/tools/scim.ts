import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pocketIdApi } from "../api/index.js";
import { auditLog, toolError, toolJson, toolText } from "./utils.js";

export function registerScimTools(server: McpServer) {
	server.registerTool(
		"scim_provider_create",
		{
			description: "Create a SCIM service provider",
			inputSchema: z
				.object({
					endpoint: z.string().url(),
					oidcClientId: z.string().min(1),
					token: z.string().min(1),
				})
				.strict(),
		},
		async (params) => {
			const path = "/api/scim/service-provider";
			try {
				const data = await pocketIdApi.scim.createProvider(params);
				auditLog({ tool: "scim_provider_create", httpMethod: "POST", path, resourceId: null, success: true });
				return toolJson(data);
			} catch (error) {
				auditLog({ tool: "scim_provider_create", httpMethod: "POST", path, resourceId: null, success: false });
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"scim_provider_update",
		{
			description: "Update a SCIM service provider",
			inputSchema: z
				.object({
					id: z.string().min(1),
					endpoint: z.string().url().optional(),
					oidcClientId: z.string().min(1).optional(),
					token: z.string().min(1).optional(),
				})
				.strict(),
		},
		async ({ id, ...body }) => {
			const path = `/api/scim/service-provider/${id}`;
			try {
				const data = await pocketIdApi.scim.updateProvider(id, body);
				auditLog({ tool: "scim_provider_update", httpMethod: "PUT", path, resourceId: id, success: true });
				return toolJson(data);
			} catch (error) {
				auditLog({ tool: "scim_provider_update", httpMethod: "PUT", path, resourceId: id, success: false });
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"scim_provider_delete",
		{
			description: "Delete a SCIM service provider",
			inputSchema: z.object({ id: z.string().min(1) }).strict(),
		},
		async ({ id }) => {
			const path = `/api/scim/service-provider/${id}`;
			try {
				await pocketIdApi.scim.deleteProvider(id);
				auditLog({ tool: "scim_provider_delete", httpMethod: "DELETE", path, resourceId: id, success: true });
				return toolText("SCIM provider deleted");
			} catch (error) {
				auditLog({ tool: "scim_provider_delete", httpMethod: "DELETE", path, resourceId: id, success: false });
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"scim_provider_sync",
		{
			description: "Trigger SCIM provider synchronization",
			inputSchema: z.object({ id: z.string().min(1) }).strict(),
		},
		async ({ id }) => {
			const path = `/api/scim/service-provider/${id}/sync`;
			try {
				await pocketIdApi.scim.syncProvider(id);
				auditLog({ tool: "scim_provider_sync", httpMethod: "POST", path, resourceId: id, success: true });
				return toolText("SCIM sync triggered");
			} catch (error) {
				auditLog({ tool: "scim_provider_sync", httpMethod: "POST", path, resourceId: id, success: false });
				return toolError(error);
			}
		},
	);
}

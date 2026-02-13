import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pocketIdApi } from "../api/index.js";
import { auditLog, toolError, toolJson } from "./utils.js";

export function registerCustomClaimTools(server: McpServer) {
	server.registerTool(
		"custom_claim_suggestions",
		{
			description: "Get custom claim key suggestions",
			inputSchema: z.object({}).strict(),
		},
		async () => {
			try {
				const data = await pocketIdApi.customClaims.suggestions();
				return toolJson(data);
			} catch (error) {
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"custom_claim_set_user",
		{
			description: "Set custom claims for a user",
			inputSchema: z
				.object({
					userId: z.string().min(1),
					claims: z.array(
						z.object({
							key: z.string().min(1),
							value: z.string(),
						}),
					),
				})
				.strict(),
		},
		async ({ userId, claims }) => {
			const path = `/api/custom-claims/user/${userId}`;
			try {
				const data = await pocketIdApi.customClaims.setForUser(userId, claims);
				auditLog({ tool: "custom_claim_set_user", httpMethod: "PUT", path, resourceId: userId, success: true });
				return toolJson(data);
			} catch (error) {
				auditLog({ tool: "custom_claim_set_user", httpMethod: "PUT", path, resourceId: userId, success: false });
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"custom_claim_set_group",
		{
			description: "Set custom claims for a user group",
			inputSchema: z
				.object({
					userGroupId: z.string().min(1),
					claims: z.array(
						z.object({
							key: z.string().min(1),
							value: z.string(),
						}),
					),
				})
				.strict(),
		},
		async ({ userGroupId, claims }) => {
			const path = `/api/custom-claims/user-group/${userGroupId}`;
			try {
				const data = await pocketIdApi.customClaims.setForGroup(userGroupId, claims);
				auditLog({ tool: "custom_claim_set_group", httpMethod: "PUT", path, resourceId: userGroupId, success: true });
				return toolJson(data);
			} catch (error) {
				auditLog({ tool: "custom_claim_set_group", httpMethod: "PUT", path, resourceId: userGroupId, success: false });
				return toolError(error);
			}
		},
	);
}

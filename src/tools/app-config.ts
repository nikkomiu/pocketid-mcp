import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pocketIdApi } from "../api/index.js";
import { auditLog, toolError, toolJson, toolText } from "./utils.js";

export function registerAppConfigTools(server: McpServer) {
	server.registerTool(
		"app_config_get",
		{
			description: "Get public application configuration",
			inputSchema: z.object({}).strict(),
		},
		async () => {
			try {
				const data = await pocketIdApi.appConfig.getPublic();
				return toolJson(data);
			} catch (error) {
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"app_config_get_all",
		{
			description: "Get all application configuration (admin)",
			inputSchema: z.object({}).strict(),
		},
		async () => {
			try {
				const data = await pocketIdApi.appConfig.getAll();
				return toolJson(data);
			} catch (error) {
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"app_config_update",
		{
			description: "Update application configuration",
			inputSchema: z
				.object({
					appName: z.string().optional(),
					sessionDuration: z.number().optional(),
					emailsVerified: z.boolean().optional(),
					allowOwnAccountEdit: z.boolean().optional(),
					smtpEnabled: z.boolean().optional(),
					smtpHost: z.string().optional(),
					smtpPort: z.number().optional(),
					smtpFrom: z.string().optional(),
					smtpUser: z.string().optional(),
					smtpPassword: z.string().optional(),
					smtpTls: z.boolean().optional(),
					smtpSkipCertVerify: z.boolean().optional(),
					ldapEnabled: z.boolean().optional(),
					ldapUrl: z.string().optional(),
					ldapBindDn: z.string().optional(),
					ldapBindPassword: z.string().optional(),
					ldapBaseDn: z.string().optional(),
					ldapAdminGroup: z.string().optional(),
					ldapSkipCertVerify: z.boolean().optional(),
				})
				.strict(),
		},
		async (params) => {
			const path = "/api/application-configuration";
			try {
				const data = await pocketIdApi.appConfig.update(params);
				auditLog({ tool: "app_config_update", httpMethod: "PUT", path, resourceId: null, success: true });
				return toolJson(data);
			} catch (error) {
				auditLog({ tool: "app_config_update", httpMethod: "PUT", path, resourceId: null, success: false });
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"app_config_test_email",
		{
			description: "Send a test email using current SMTP configuration",
			inputSchema: z
				.object({
					email: z.string().email(),
				})
				.strict(),
		},
		async (params) => {
			const path = "/api/application-configuration/test-email";
			try {
				await pocketIdApi.appConfig.testEmail(params.email);
				auditLog({ tool: "app_config_test_email", httpMethod: "POST", path, resourceId: null, success: true });
				return toolText("Test email sent");
			} catch (error) {
				auditLog({ tool: "app_config_test_email", httpMethod: "POST", path, resourceId: null, success: false });
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"app_config_sync_ldap",
		{
			description: "Trigger LDAP synchronization",
			inputSchema: z.object({}).strict(),
		},
		async () => {
			const path = "/api/application-configuration/sync-ldap";
			try {
				await pocketIdApi.appConfig.syncLdap();
				auditLog({ tool: "app_config_sync_ldap", httpMethod: "POST", path, resourceId: null, success: true });
				return toolText("LDAP sync triggered");
			} catch (error) {
				auditLog({ tool: "app_config_sync_ldap", httpMethod: "POST", path, resourceId: null, success: false });
				return toolError(error);
			}
		},
	);
}

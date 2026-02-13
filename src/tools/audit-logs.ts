import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pocketIdApi } from "../api/index.js";
import { toolError, toolJson } from "./utils.js";

const paginationParams = {
	page: z.number().int().positive().optional(),
	limit: z.number().int().positive().optional(),
	search: z.string().optional(),
	sortColumn: z.string().optional(),
	sortDirection: z.enum(["asc", "desc"]).optional(),
};

export function registerAuditLogTools(server: McpServer) {
	server.registerTool(
		"audit_log_list",
		{
			description: "List audit logs for the current user (paginated)",
			inputSchema: z.object(paginationParams).strict(),
		},
		async (params) => {
			try {
				const data = await pocketIdApi.auditLogs.listMine(params);
				return toolJson(data);
			} catch (error) {
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"audit_log_list_all",
		{
			description: "List all audit logs (admin, paginated)",
			inputSchema: z.object(paginationParams).strict(),
		},
		async (params) => {
			try {
				const data = await pocketIdApi.auditLogs.listAll(params);
				return toolJson(data);
			} catch (error) {
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"audit_log_filter_clients",
		{
			description: "Get client name filters for audit logs",
			inputSchema: z.object({}).strict(),
		},
		async () => {
			try {
				const data = await pocketIdApi.auditLogs.filterClients();
				return toolJson(data);
			} catch (error) {
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"audit_log_filter_users",
		{
			description: "Get user filters for audit logs",
			inputSchema: z.object({}).strict(),
		},
		async () => {
			try {
				const data = await pocketIdApi.auditLogs.filterUsers();
				return toolJson(data);
			} catch (error) {
				return toolError(error);
			}
		},
	);
}

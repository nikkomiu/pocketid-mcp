import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pocketIdApi } from "../api/index.js";
import { toolError, toolJson } from "./utils.js";

export function registerOidcDiscoveryTools(server: McpServer) {
	server.registerTool(
		"oidc_discovery",
		{
			description: "Get OpenID Connect discovery configuration",
			inputSchema: z.object({}).strict(),
		},
		async () => {
			try {
				const data = await pocketIdApi.oidcDiscovery.configuration();
				return toolJson(data);
			} catch (error) {
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"oidc_jwks",
		{
			description: "Get JSON Web Key Set (JWKS)",
			inputSchema: z.object({}).strict(),
		},
		async () => {
			try {
				const data = await pocketIdApi.oidcDiscovery.jwks();
				return toolJson(data);
			} catch (error) {
				return toolError(error);
			}
		},
	);
}

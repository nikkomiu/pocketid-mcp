import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerApiKeyTools } from "./tools/api-keys.js";
import { registerAppConfigTools } from "./tools/app-config.js";
import { registerAppImageTools } from "./tools/app-images.js";
import { registerAuditLogTools } from "./tools/audit-logs.js";
import { registerCustomClaimTools } from "./tools/custom-claims.js";
import { registerOidcClientTools } from "./tools/oidc-clients.js";
import { registerOidcDiscoveryTools } from "./tools/oidc-discovery.js";
import { registerScimTools } from "./tools/scim.js";
import { registerSignupTokenTools } from "./tools/signup-tokens.js";
import { registerUserGroupTools } from "./tools/user-groups.js";
import { registerUserTools } from "./tools/users.js";
import { registerUtilityTools } from "./tools/utility.js";
import { initLogger } from "./logger.js";

const logger = await initLogger();

const server = new McpServer({
	name: "pocketid-mcp",
	version: "0.1.0",
});

registerUserTools(server);
registerUserGroupTools(server);
registerOidcClientTools(server);
registerApiKeyTools(server);
registerAuditLogTools(server);
registerCustomClaimTools(server);
registerAppConfigTools(server);
registerSignupTokenTools(server);
registerScimTools(server);
registerOidcDiscoveryTools(server);
registerAppImageTools(server);
registerUtilityTools(server);

const transport = new StdioServerTransport();
await server.connect(transport);
logger.info("pocketid-mcp server running");

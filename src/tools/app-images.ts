import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { pocketIdApi } from "../api/index.js";
import { auditLog, toolError, toolText } from "./utils.js";

export function registerAppImageTools(server: McpServer) {
	server.registerTool(
		"app_image_update_logo",
		{
			description: "Update the application logo (base64 encoded image)",
			inputSchema: z
				.object({
					base64Data: z.string().min(1),
					mimeType: z.string().optional(),
				})
				.strict(),
		},
		async ({ base64Data, mimeType }) => {
			const path = "/api/application-images/logo";
			try {
				await pocketIdApi.appImages.updateLogo(base64Data, mimeType);
				auditLog({ tool: "app_image_update_logo", httpMethod: "PUT", path, resourceId: null, success: true });
				return toolText("Logo updated");
			} catch (error) {
				auditLog({ tool: "app_image_update_logo", httpMethod: "PUT", path, resourceId: null, success: false });
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"app_image_update_favicon",
		{
			description: "Update the application favicon (base64 encoded image)",
			inputSchema: z
				.object({
					base64Data: z.string().min(1),
					mimeType: z.string().optional(),
				})
				.strict(),
		},
		async ({ base64Data, mimeType }) => {
			const path = "/api/application-images/favicon";
			try {
				await pocketIdApi.appImages.updateFavicon(base64Data, mimeType);
				auditLog({ tool: "app_image_update_favicon", httpMethod: "PUT", path, resourceId: null, success: true });
				return toolText("Favicon updated");
			} catch (error) {
				auditLog({ tool: "app_image_update_favicon", httpMethod: "PUT", path, resourceId: null, success: false });
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"app_image_update_background",
		{
			description: "Update the application background image (base64 encoded image)",
			inputSchema: z
				.object({
					base64Data: z.string().min(1),
					mimeType: z.string().optional(),
				})
				.strict(),
		},
		async ({ base64Data, mimeType }) => {
			const path = "/api/application-images/background";
			try {
				await pocketIdApi.appImages.updateBackground(base64Data, mimeType);
				auditLog({ tool: "app_image_update_background", httpMethod: "PUT", path, resourceId: null, success: true });
				return toolText("Background image updated");
			} catch (error) {
				auditLog({ tool: "app_image_update_background", httpMethod: "PUT", path, resourceId: null, success: false });
				return toolError(error);
			}
		},
	);

	server.registerTool(
		"app_image_delete_default_profile_picture",
		{
			description: "Delete the default profile picture",
			inputSchema: z.object({}).strict(),
		},
		async () => {
			const path = "/api/application-images/default-profile-picture";
			try {
				await pocketIdApi.appImages.deleteDefaultProfilePicture();
				auditLog({ tool: "app_image_delete_default_profile_picture", httpMethod: "DELETE", path, resourceId: null, success: true });
				return toolText("Default profile picture deleted");
			} catch (error) {
				auditLog({ tool: "app_image_delete_default_profile_picture", httpMethod: "DELETE", path, resourceId: null, success: false });
				return toolError(error);
			}
		},
	);
}

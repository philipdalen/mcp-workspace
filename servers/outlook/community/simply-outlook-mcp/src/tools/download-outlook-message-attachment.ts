import * as os from "os";
import * as path from "path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getErrorToolResult, textToolResult } from "./tool-utils.js";
import { GraphService } from "../simply-outlook/graph-service.js";

export const DOWNLOAD_OUTLOOK_MESSAGE_ATTACHMENT_TOOL_NAME = "download-outlook-message-attachment";

const DEFAULT_DOWNLOAD_DIRECTORY = path.join(os.homedir(), "Downloads");

export const registerDownloadOutlookMessageAttachmentTool = async (server: McpServer, graphService: GraphService, toolNamePrefix: string) => {
  server.tool(
    `${toolNamePrefix}${DOWNLOAD_OUTLOOK_MESSAGE_ATTACHMENT_TOOL_NAME}`,
    "Download a file attachment from an Outlook mail message to local disk. Use list-outlook-message-attachments first to get the attachmentId. Saves to destinationPath if provided (a full file path, or a directory to save the attachment under its own name), otherwise defaults to the user's Downloads folder.",
    {
      messageId: z
        .string()
        .describe(
          "The unique identifier of the mail message the attachment belongs to. Preserve the exact ID format including any trailing '=' padding characters."
        ),
      attachmentId: z
        .string()
        .describe("The unique identifier of the attachment to download, as returned by list-outlook-message-attachments."),
      destinationPath: z
        .string()
        .optional()
        .describe(
          `Absolute path (or path starting with '~/') to save the file to. Can be a full file path, or a directory (existing directory, or a path ending in '/') in which case the attachment's own name is used. Defaults to '${DEFAULT_DOWNLOAD_DIRECTORY}'.`
        ),
    },
    async ({ messageId, attachmentId, destinationPath }) => {
      try {
        const downloaded = await graphService.downloadMessageAttachment(
          messageId,
          attachmentId,
          destinationPath || `${DEFAULT_DOWNLOAD_DIRECTORY}/`
        );

        return textToolResult([
          `Downloaded attachment '${downloaded.name}' (${downloaded.contentType}, ${downloaded.size} bytes) to:`,
          downloaded.path,
        ]);
      } catch (error) {
        return getErrorToolResult(error, "Failed to download message attachment.");
      }
    }
  );
};

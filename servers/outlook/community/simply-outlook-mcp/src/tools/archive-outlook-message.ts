import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getErrorToolResult, textToolResult } from "./tool-utils.js";
import { GraphService } from "../simply-outlook/graph-service.js";

export const ARCHIVE_OUTLOOK_MESSAGE_TOOL_NAME = "archive-outlook-message";

export const registerArchiveOutlookMessageTool = async (server: McpServer, graphService: GraphService) => {
  server.tool(
    ARCHIVE_OUTLOOK_MESSAGE_TOOL_NAME,
    "Archive an Outlook email message by moving it to the Archive folder.",
    {
      messageId: z
        .string()
        .describe(
          "The unique identifier of the mail message to archive. This is a base64-encoded string that uniquely identifies the message in the user's mailbox. Preserve the exact ID format including any trailing '=' padding characters."
        ),
    },
    async ({ messageId }) => {
      try {
        await graphService.archiveOutlookMessage(messageId);
        return textToolResult([`Successfully archived the Outlook message with ID: ${messageId}`]);
      } catch (error) {
        return getErrorToolResult(error, "Failed to archive Outlook message.");
      }
    }
  );
};

/**
 * deleteMessage tool
 * Deletes an existing message in Teamwork
 */

import logger from "../../utils/logger.js";
import teamworkService from "../../services/index.js";

const messageDescription =
    "Messages in Teamwork are a way to communicate and share information within projects. " +
    "They allow team members to post updates, announcements, and discussions that are visible to all project members. " +
    "Messages can be organized by categories and tagged for easy filtering and searching.";

export const deleteMessageDefinition = {
    name: "deleteMessage",
    description:
        "Delete an existing message in Teamwork.com. " + messageDescription,
    inputSchema: {
        type: "object",
        properties: {
            id: {
                type: "integer",
                description: "The ID of the message to delete.",
            },
        },
        required: ["id"],
    },
    annotations: {
        title: "Delete Message",
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: false,
    },
};

// Tool handler
export async function handleDeleteMessage(input: any) {
    logger.info("=== deleteMessage tool called ===");
    logger.info(`Input: ${JSON.stringify(input || {})}`);

    try {
        // Validate required fields
        if (!input.id) {
            logger.error("Missing message id");
            return {
                content: [
                    {
                        type: "text",
                        text: "Error: id is required",
                    },
                ],
            };
        }

        logger.info(`Deleting message ${input.id}`);

        // Call the service to delete the message
        const result = await teamworkService.deleteMessage(input.id);

        logger.info("Message deleted successfully");
        logger.info(
            `Delete message response: ${JSON.stringify(result).substring(
                0,
                200
            )}...`
        );

        // Ensure we return a properly formatted response
        const response = {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        };

        logger.info("=== deleteMessage tool completed successfully ===");
        return response;
    } catch (error: any) {
        logger.error(`Error in deleteMessage handler: ${error.message}`);
        if (error.stack) {
            logger.error(`Stack trace: ${error.stack}`);
        }

        // Return a properly formatted error response
        return {
            content: [
                {
                    type: "text",
                    text: `Error deleting message: ${error.message}`,
                },
            ],
        };
    }
}

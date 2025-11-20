/**
 * getMessageById tool
 * Gets an existing message in Teamwork
 */

import logger from "../../utils/logger.js";
import teamworkService from "../../services/index.js";

const messageDescription =
    "Messages in Teamwork are a way to communicate and share information within projects. " +
    "They allow team members to post updates, announcements, and discussions that are visible to all project members. " +
    "Messages can be organized by categories and tagged for easy filtering and searching.";

export const getMessageByIdDefinition = {
    name: "getMessageById",
    description:
        "Get an existing message in Teamwork.com. " + messageDescription,
    inputSchema: {
        type: "object",
        properties: {
            id: {
                type: "integer",
                description: "The ID of the message to get.",
            },
        },
        required: ["id"],
    },
    annotations: {
        title: "Get Message",
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
    },
};

// Tool handler
export async function handleGetMessageById(input: any) {
    logger.info("=== getMessageById tool called ===");
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

        logger.info(`Getting message ${input.id}`);

        // Call the service to get the message
        const message = await teamworkService.getMessageById(input.id);

        logger.info("Message retrieved successfully");
        logger.info(
            `Retrieved message response: ${JSON.stringify(message).substring(
                0,
                200
            )}...`
        );

        // Ensure we return a properly formatted response
        const response = {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(message, null, 2),
                },
            ],
        };

        logger.info("=== getMessageById tool completed successfully ===");
        return response;
    } catch (error: any) {
        logger.error(`Error in getMessageById handler: ${error.message}`);
        if (error.stack) {
            logger.error(`Stack trace: ${error.stack}`);
        }

        // Return a properly formatted error response
        return {
            content: [
                {
                    type: "text",
                    text: `Error getting message: ${error.message}`,
                },
            ],
        };
    }
}

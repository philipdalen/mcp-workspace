/**
 * getMessages tool
 * Lists messages in Teamwork
 */

import logger from "../../utils/logger.js";
import teamworkService from "../../services/index.js";

const messageDescription =
    "Messages in Teamwork are a way to communicate and share information within projects. " +
    "They allow team members to post updates, announcements, and discussions that are visible to all project members. " +
    "Messages can be organized by categories and tagged for easy filtering and searching.";

export const getMessagesDefinition = {
    name: "getMessages",
    description: "List messages in Teamwork.com. " + messageDescription,
    inputSchema: {
        type: "object",
        properties: {
            page: {
                type: "integer",
                description: "Page number for pagination of results.",
            },
            pageSize: {
                type: "integer",
                description:
                    "Number of results per page for pagination. Minimum: 1, Maximum: 100, Default: 50.",
            },
        },
    },
    annotations: {
        title: "Get Messages",
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
    },
};

// Tool handler
export async function handleGetMessages(input: any) {
    logger.info("=== getMessages tool called ===");
    logger.info(`Input: ${JSON.stringify(input || {})}`);

    try {
        logger.info("Getting messages");

        // Call the service to get messages
        const messages = await teamworkService.getMessages(input || {});

        logger.info("Messages retrieved successfully");
        logger.info(
            `Retrieved messages response: ${JSON.stringify(messages).substring(
                0,
                200
            )}...`
        );

        // Ensure we return a properly formatted response
        const response = {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(messages, null, 2),
                },
            ],
        };

        logger.info("=== getMessages tool completed successfully ===");
        return response;
    } catch (error: any) {
        logger.error(`Error in getMessages handler: ${error.message}`);
        if (error.stack) {
            logger.error(`Stack trace: ${error.stack}`);
        }

        // Return a properly formatted error response
        return {
            content: [
                {
                    type: "text",
                    text: `Error getting messages: ${error.message}`,
                },
            ],
        };
    }
}

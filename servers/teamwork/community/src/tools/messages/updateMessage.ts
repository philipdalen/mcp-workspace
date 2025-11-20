/**
 * updateMessage tool
 * Updates an existing message in Teamwork
 */

import logger from "../../utils/logger.js";
import teamworkService from "../../services/index.js";

const messageDescription =
    "Messages in Teamwork are a way to communicate and share information within projects. " +
    "They allow team members to post updates, announcements, and discussions that are visible to all project members. " +
    "Messages can be organized by categories and tagged for easy filtering and searching.";

export const updateMessageDefinition = {
    name: "updateMessage",
    description:
        "Update an existing message in Teamwork.com. " + messageDescription,
    inputSchema: {
        type: "object",
        properties: {
            id: {
                type: "integer",
                description: "The ID of the message to update.",
            },
            title: {
                type: "string",
                description: "The subject of the message.",
            },
            body: {
                type: "string",
                description: "The body content of the message.",
            },
            categoryId: {
                type: "integer",
                description: "The ID of the category to assign the message to.",
            },
            tagIds: {
                type: "array",
                description: "A list of tag IDs to associate with the message.",
                items: {
                    type: "integer",
                },
            },
            notify: {
                type: "string",
                description:
                    "Who to notify ('all' to notify all project users, 'true' to notify followers, specific user IDs, or empty for no notification).",
            },
            isPrivate: {
                type: "boolean",
                description: "Whether the message should be private.",
            },
        },
        required: ["id"],
    },
    annotations: {
        title: "Update Message",
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: false,
    },
};

// Tool handler
export async function handleUpdateMessage(input: any) {
    logger.info("=== updateMessage tool called ===");
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

        logger.info(`Updating message ${input.id}`);

        // Extract the id and the rest of the data
        const { id, ...updateData } = input;

        // Call the service to update the message
        const message = await teamworkService.updateMessage(id, updateData);

        logger.info("Message updated successfully");
        logger.info(
            `Updated message response: ${JSON.stringify(message).substring(
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

        logger.info("=== updateMessage tool completed successfully ===");
        return response;
    } catch (error: any) {
        logger.error(`Error in updateMessage handler: ${error.message}`);
        if (error.stack) {
            logger.error(`Stack trace: ${error.stack}`);
        }

        // Return a properly formatted error response
        return {
            content: [
                {
                    type: "text",
                    text: `Error updating message: ${error.message}`,
                },
            ],
        };
    }
}

/**
 * createMessage tool
 * Creates a new message in Teamwork
 */

import logger from "../../utils/logger.js";
import teamworkService from "../../services/index.js";

const messageDescription =
    "Messages in Teamwork are a way to communicate and share information within projects. " +
    "They allow team members to post updates, announcements, and discussions that are visible to all project members. " +
    "Messages can be organized by categories and tagged for easy filtering and searching.";

export const createMessageDefinition = {
    name: "createMessage",
    description: "Create a new message in Teamwork.com. " + messageDescription,
    inputSchema: {
        type: "object",
        properties: {
            projectId: {
                type: "integer",
                description: "The ID of the project to create the message in.",
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
                description:
                    "The ID of the category to assign the message to. Messages can be organized into categories for better organization.",
            },
            categoryName: {
                type: "string",
                description:
                    "The name of the category to assign the message to. If the category doesn't exist, it will be created automatically.",
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
        required: ["projectId", "title", "body"],
    },
    annotations: {
        title: "Create Message",
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: false,
    },
};

// Tool handler
export async function handleCreateMessage(input: any) {
    logger.info("=== createMessage tool called ===");
    logger.info(`Input: ${JSON.stringify(input || {})}`);

    try {
        // Validate required fields
        if (!input.projectId) {
            logger.error("Missing projectId");
            return {
                content: [
                    {
                        type: "text",
                        text: "Error: projectId is required",
                    },
                ],
            };
        }

        if (!input.title) {
            logger.error("Missing title");
            return {
                content: [
                    {
                        type: "text",
                        text: "Error: title is required",
                    },
                ],
            };
        }

        if (!input.body) {
            logger.error("Missing body");
            return {
                content: [
                    {
                        type: "text",
                        text: "Error: body is required",
                    },
                ],
            };
        }

        logger.info(
            `Creating message "${input.title}" in project ${input.projectId}`
        );

        // Call the service to create the message
        const message = await teamworkService.createMessage(input);

        logger.info("Message created successfully");
        logger.info(
            `Created message response: ${JSON.stringify(message).substring(
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

        logger.info("=== createMessage tool completed successfully ===");
        return response;
    } catch (error: any) {
        logger.error(`Error in createMessage handler: ${error.message}`);
        if (error.stack) {
            logger.error(`Stack trace: ${error.stack}`);
        }

        // Return a properly formatted error response
        return {
            content: [
                {
                    type: "text",
                    text: `Error creating message: ${error.message}`,
                },
            ],
        };
    }
}

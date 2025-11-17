/**
 * getTag tool
 * Gets a specific tag by ID from Teamwork
 */

import logger from "../../utils/logger.js";
import teamworkService from "../../services/index.js";

const tagDescription =
    "In the context of Teamwork.com, a tag is a customizable label that can be applied to various " +
    "items such as tasks, projects, milestones, messages, and more, to help categorize and organize work efficiently. " +
    "Tags provide a flexible way to filter, search, and group related items across the platform, making it easier for " +
    "teams to manage complex workflows, highlight priorities, or track themes and statuses. Since tags are " +
    "user-defined, they adapt to each team's specific needs and can be color-coded for better visual clarity.";

export const getTagDefinition = {
    name: "getTag",
    description: "Get an existing tag in Teamwork.com. " + tagDescription,
    inputSchema: {
        type: "object",
        properties: {
            tagId: {
                type: "integer",
                description: "The ID of the tag to retrieve",
            },
        },
        required: ["tagId"],
    },
    annotations: {
        title: "Get Tag",
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
    },
};

// Tool handler
export async function handleGetTag(input: any) {
    logger.info("=== getTag tool called ===");
    logger.info(`Input: ${JSON.stringify(input || {})}`);

    try {
        if (!input?.tagId) {
            throw new Error("tagId is required");
        }

        logger.info(`Getting tag with ID: ${input.tagId}`);

        // Call the service to get the tag
        const tag = await teamworkService.getTag(input.tagId);

        logger.info(`Tag retrieved successfully: ${input.tagId}`);

        // Ensure we return a properly formatted response
        const response = {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(tag, null, 2),
                },
            ],
        };

        logger.info("=== getTag tool completed successfully ===");
        return response;
    } catch (error: any) {
        logger.error(`Error in getTag handler: ${error.message}`);
        if (error.stack) {
            logger.error(`Stack trace: ${error.stack}`);
        }

        // Return a properly formatted error response
        return {
            content: [
                {
                    type: "text",
                    text: `Error getting tag: ${error.message}`,
                },
            ],
        };
    }
}


/**
 * updateTag tool
 * Updates an existing tag in Teamwork
 */

import logger from "../../utils/logger.js";
import teamworkService from "../../services/index.js";

const tagDescription =
    "In the context of Teamwork.com, a tag is a customizable label that can be applied to various " +
    "items such as tasks, projects, milestones, messages, and more, to help categorize and organize work efficiently. " +
    "Tags provide a flexible way to filter, search, and group related items across the platform, making it easier for " +
    "teams to manage complex workflows, highlight priorities, or track themes and statuses. Since tags are " +
    "user-defined, they adapt to each team's specific needs and can be color-coded for better visual clarity.";

export const updateTagDefinition = {
    name: "updateTag",
    description: "Update an existing tag in Teamwork.com. " + tagDescription,
    inputSchema: {
        type: "object",
        properties: {
            tagId: {
                type: "integer",
                description: "The ID of the tag to update",
            },
            tag: {
                type: "object",
                properties: {
                    name: {
                        type: "string",
                        description: "The name of the tag",
                    },
                    color: {
                        type: "string",
                        description: "The color of the tag (hex format without #, e.g., 'FF7641')",
                    },
                },
            },
        },
        required: ["tagId", "tag"],
    },
    annotations: {
        title: "Update Tag",
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: false,
    },
};

// Tool handler
export async function handleUpdateTag(input: any) {
    logger.info("=== updateTag tool called ===");
    logger.info(`Input: ${JSON.stringify(input || {})}`);

    try {
        if (!input?.tagId) {
            throw new Error("tagId is required");
        }

        if (!input?.tag) {
            throw new Error("tag object is required");
        }

        logger.info(`Updating tag with ID: ${input.tagId}`);

        // Call the service to update the tag
        const updatedTag = await teamworkService.updateTag(input.tagId, input);

        logger.info(`Tag updated successfully: ${input.tagId}`);

        // Ensure we return a properly formatted response
        const response = {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(updatedTag, null, 2),
                },
            ],
        };

        logger.info("=== updateTag tool completed successfully ===");
        return response;
    } catch (error: any) {
        logger.error(`Error in updateTag handler: ${error.message}`);
        if (error.stack) {
            logger.error(`Stack trace: ${error.stack}`);
        }

        // Return a properly formatted error response
        return {
            content: [
                {
                    type: "text",
                    text: `Error updating tag: ${error.message}`,
                },
            ],
        };
    }
}


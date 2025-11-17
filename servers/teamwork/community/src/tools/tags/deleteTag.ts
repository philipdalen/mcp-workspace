/**
 * deleteTag tool
 * Deletes a tag from Teamwork
 */

import logger from "../../utils/logger.js";
import teamworkService from "../../services/index.js";

const tagDescription =
    "In the context of Teamwork.com, a tag is a customizable label that can be applied to various " +
    "items such as tasks, projects, milestones, messages, and more, to help categorize and organize work efficiently. " +
    "Tags provide a flexible way to filter, search, and group related items across the platform, making it easier for " +
    "teams to manage complex workflows, highlight priorities, or track themes and statuses. Since tags are " +
    "user-defined, they adapt to each team's specific needs and can be color-coded for better visual clarity.";

export const deleteTagDefinition = {
    name: "deleteTag",
    description: "Delete an existing tag in Teamwork.com. " + tagDescription,
    inputSchema: {
        type: "object",
        properties: {
            tagId: {
                type: "integer",
                description: "The ID of the tag to delete",
            },
        },
        required: ["tagId"],
    },
    annotations: {
        title: "Delete Tag",
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: false,
    },
};

// Tool handler
export async function handleDeleteTag(input: any) {
    logger.info("=== deleteTag tool called ===");
    logger.info(`Input: ${JSON.stringify(input || {})}`);

    try {
        if (!input?.tagId) {
            throw new Error("tagId is required");
        }

        logger.info(`Deleting tag with ID: ${input.tagId}`);

        // Call the service to delete the tag
        const result = await teamworkService.deleteTag(input.tagId);

        logger.info(`Tag deleted successfully: ${input.tagId}`);

        // Ensure we return a properly formatted response
        const response = {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result || { success: true, message: `Tag ${input.tagId} deleted successfully` }, null, 2),
                },
            ],
        };

        logger.info("=== deleteTag tool completed successfully ===");
        return response;
    } catch (error: any) {
        logger.error(`Error in deleteTag handler: ${error.message}`);
        if (error.stack) {
            logger.error(`Stack trace: ${error.stack}`);
        }

        // Return a properly formatted error response
        return {
            content: [
                {
                    type: "text",
                    text: `Error deleting tag: ${error.message}`,
                },
            ],
        };
    }
}


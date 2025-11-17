/**
 * createTag tool
 * Creates a new tag in Teamwork
 */

import logger from "../../utils/logger.js";
import teamworkService from "../../services/index.js";

const tagDescription =
    "In the context of Teamwork.com, a tag is a customizable label that can be applied to various " +
    "items such as tasks, projects, milestones, messages, and more, to help categorize and organize work efficiently. " +
    "Tags provide a flexible way to filter, search, and group related items across the platform, making it easier for " +
    "teams to manage complex workflows, highlight priorities, or track themes and statuses. Since tags are " +
    "user-defined, they adapt to each team's specific needs and can be color-coded for better visual clarity.";

export const createTagDefinition = {
    name: "createTag",
    description: "Create a new tag in Teamwork.com. " + tagDescription,
    inputSchema: {
        type: "object",
        properties: {
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
                required: ["name"],
            },
        },
        required: ["tag"],
    },
    annotations: {
        title: "Create Tag",
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: false,
    },
};

// Tool handler
export async function handleCreateTag(input: any) {
    logger.info("=== createTag tool called ===");
    logger.info(`Input: ${JSON.stringify(input || {})}`);

    try {
        if (!input?.tag) {
            throw new Error("tag object is required");
        }

        if (!input.tag.name) {
            throw new Error("tag.name is required");
        }

        logger.info(`Creating tag with name: ${input.tag.name}`);

        // Call the service to create the tag
        const createdTag = await teamworkService.createTag(input);

        logger.info("Tag created successfully");
        logger.info(
            `Created tag response: ${JSON.stringify(createdTag).substring(0, 200)}...`
        );

        // Ensure we return a properly formatted response
        const response = {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(createdTag, null, 2),
                },
            ],
        };

        logger.info("=== createTag tool completed successfully ===");
        return response;
    } catch (error: any) {
        logger.error(`Error in createTag handler: ${error.message}`);
        if (error.stack) {
            logger.error(`Stack trace: ${error.stack}`);
        }

        // Return a properly formatted error response
        return {
            content: [
                {
                    type: "text",
                    text: `Error creating tag: ${error.message}`,
                },
            ],
        };
    }
}


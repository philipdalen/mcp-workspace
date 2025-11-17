/**
 * listTags tool
 * Lists tags in Teamwork
 */

import logger from "../../utils/logger.js";
import teamworkService from "../../services/index.js";

const tagDescription =
    "In the context of Teamwork.com, a tag is a customizable label that can be applied to various " +
    "items such as tasks, projects, milestones, messages, and more, to help categorize and organize work efficiently. " +
    "Tags provide a flexible way to filter, search, and group related items across the platform, making it easier for " +
    "teams to manage complex workflows, highlight priorities, or track themes and statuses. Since tags are " +
    "user-defined, they adapt to each team's specific needs and can be color-coded for better visual clarity.";

export const listTagsDefinition = {
    name: "listTags",
    description: "List tags in Teamwork.com. " + tagDescription,
    inputSchema: {
        type: "object",
        properties: {
            searchTerm: {
                type: "string",
                description:
                    "A search term to filter tags by name. Each word from the search term is used to match " +
                    "against the tag name.",
            },
            itemType: {
                type: "string",
                description:
                    "The type of item to filter tags by. Valid values are 'project', 'task', 'tasklist', " +
                    "'milestone', 'message', 'timelog', 'notebook', 'file', 'company' and 'link'.",
                enum: [
                    "project",
                    "task",
                    "tasklist",
                    "milestone",
                    "message",
                    "timelog",
                    "notebook",
                    "file",
                    "company",
                    "link",
                ],
            },
            projectIds: {
                type: "array",
                description: "A list of project IDs to filter tags by projects",
                items: {
                    type: "integer",
                },
            },
            page: {
                type: "integer",
                description: "Page number for pagination of results.",
            },
            pageSize: {
                type: "integer",
                description: "Number of results per page for pagination.",
            },
        },
    },
    annotations: {
        title: "List Tags",
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
    },
};

// Tool handler
export async function handleListTags(input: any) {
    logger.info("=== listTags tool called ===");
    logger.info(`Input: ${JSON.stringify(input || {})}`);

    try {
        logger.info("Listing tags");

        // Prepare query parameters
        const params: any = {};

        if (input?.searchTerm) {
            params.searchTerm = input.searchTerm;
        }

        if (input?.itemType) {
            params.itemType = input.itemType;
        }

        if (input?.projectIds && Array.isArray(input.projectIds)) {
            params.projectIds = input.projectIds;
        }

        if (input?.page !== undefined) {
            params.page = input.page;
        }

        if (input?.pageSize !== undefined) {
            params.pageSize = input.pageSize;
        }

        // Call the service to list tags
        const tags = await teamworkService.listTags(params || {});

        logger.info("Tags retrieved successfully");
        logger.info(
            `Retrieved tags response: ${JSON.stringify(tags).substring(0, 200)}...`
        );

        // Ensure we return a properly formatted response
        const response = {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(tags, null, 2),
                },
            ],
        };

        logger.info("=== listTags tool completed successfully ===");
        return response;
    } catch (error: any) {
        logger.error(`Error in listTags handler: ${error.message}`);
        if (error.stack) {
            logger.error(`Stack trace: ${error.stack}`);
        }

        // Return a properly formatted error response
        return {
            content: [
                {
                    type: "text",
                    text: `Error listing tags: ${error.message}`,
                },
            ],
        };
    }
}


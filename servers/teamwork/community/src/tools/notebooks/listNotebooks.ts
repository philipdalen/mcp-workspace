/**
 * listNotebooks tool
 * Lists notebooks in Teamwork
 */

import logger from "../../utils/logger.js";
import teamworkService from "../../services/index.js";

const notebookDescription =
    "Notebook is a space where teams can create, share, and organize written content in a " +
    "structured way. It's commonly used for documenting processes, storing meeting notes, capturing research, or " +
    "drafting ideas that need to be revisited and refined over time. Unlike quick messages or task comments, " +
    "notebooks provide a more permanent and organized format that can be easily searched and referenced, helping " +
    "teams maintain a centralized source of knowledge and ensuring important information remains accessible to " +
    "everyone who needs it.";

export const listNotebooksDefinition = {
    name: "listNotebooks",
    description: "List notebooks in Teamwork.com. " + notebookDescription,
    inputSchema: {
        type: "object",
        properties: {
            projectIds: {
                type: "array",
                description:
                    "A list of project IDs to filter notebooks by projects",
                items: {
                    type: "integer",
                },
            },
            searchTerm: {
                type: "string",
                description:
                    "A search term to filter notebooks by name or description. " +
                    "The notebook will be selected if each word of the term matches the notebook name or description, not " +
                    "requiring that the word matches are in the same field.",
            },
            tagIds: {
                type: "array",
                description: "A list of tag IDs to filter notebooks by tags",
                items: {
                    type: "integer",
                },
            },
            matchAllTags: {
                type: "boolean",
                description:
                    "If true, the search will match notebooks that have all the specified tags. " +
                    "If false, the search will match notebooks that have any of the specified tags. " +
                    "Defaults to false.",
            },
            includeContents: {
                type: "boolean",
                description:
                    "If true, the contents of the notebook will be included in the response. " +
                    "Defaults to true.",
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
        title: "List Notebooks",
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
    },
};

// Tool handler
export async function handleListNotebooks(input: any) {
    logger.info("=== listNotebooks tool called ===");
    logger.info(`Input: ${JSON.stringify(input || {})}`);

    try {
        logger.info("Listing notebooks");

        // Call the service to list notebooks
        const notebooks = await teamworkService.listNotebooks(input || {});

        logger.info("Notebooks retrieved successfully");
        logger.info(
            `Retrieved notebooks response: ${JSON.stringify(
                notebooks
            ).substring(0, 200)}...`
        );

        // Ensure we return a properly formatted response
        const response = {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(notebooks, null, 2),
                },
            ],
        };

        logger.info("=== listNotebooks tool completed successfully ===");
        return response;
    } catch (error: any) {
        logger.error(`Error in listNotebooks handler: ${error.message}`);
        if (error.stack) {
            logger.error(`Stack trace: ${error.stack}`);
        }

        // Return a properly formatted error response
        return {
            content: [
                {
                    type: "text",
                    text: `Error listing notebooks: ${error.message}`,
                },
            ],
        };
    }
}

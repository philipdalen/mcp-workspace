/**
 * getNotebook tool
 * Gets an existing notebook in Teamwork
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

export const getNotebookDefinition = {
    name: "getNotebook",
    description:
        "Get an existing notebook in Teamwork.com. " + notebookDescription,
    inputSchema: {
        type: "object",
        properties: {
            id: {
                type: "integer",
                description: "The ID of the notebook to get.",
            },
        },
        required: ["id"],
    },
    annotations: {
        title: "Get Notebook",
        readOnlyHint: true,
        destructiveHint: false,
        openWorldHint: false,
    },
};

// Tool handler
export async function handleGetNotebook(input: any) {
    logger.info("=== getNotebook tool called ===");
    logger.info(`Input: ${JSON.stringify(input || {})}`);

    try {
        // Validate required fields
        if (!input.id) {
            logger.error("Missing notebook id");
            return {
                content: [
                    {
                        type: "text",
                        text: "Error: id is required",
                    },
                ],
            };
        }

        logger.info(`Getting notebook ${input.id}`);

        // Call the service to get the notebook
        const notebook = await teamworkService.getNotebook(input.id);

        logger.info("Notebook retrieved successfully");
        logger.info(
            `Retrieved notebook response: ${JSON.stringify(notebook).substring(
                0,
                200
            )}...`
        );

        // Ensure we return a properly formatted response
        const response = {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(notebook, null, 2),
                },
            ],
        };

        logger.info("=== getNotebook tool completed successfully ===");
        return response;
    } catch (error: any) {
        logger.error(`Error in getNotebook handler: ${error.message}`);
        if (error.stack) {
            logger.error(`Stack trace: ${error.stack}`);
        }

        // Return a properly formatted error response
        return {
            content: [
                {
                    type: "text",
                    text: `Error getting notebook: ${error.message}`,
                },
            ],
        };
    }
}

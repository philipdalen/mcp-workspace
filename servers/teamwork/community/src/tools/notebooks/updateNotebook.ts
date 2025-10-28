/**
 * updateNotebook tool
 * Updates an existing notebook in Teamwork
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

export const updateNotebookDefinition = {
    name: "updateNotebook",
    description:
        "Update an existing notebook in Teamwork.com. " + notebookDescription,
    inputSchema: {
        type: "object",
        properties: {
            id: {
                type: "integer",
                description: "The ID of the notebook to update.",
            },
            name: {
                type: "string",
                description: "The name of the notebook.",
            },
            description: {
                type: "string",
                description: "A description of the notebook.",
            },
            contents: {
                type: "string",
                description: "The contents of the notebook.",
            },
            type: {
                type: "string",
                description:
                    "The type of the notebook. Valid values are 'MARKDOWN' and 'HTML'.",
                enum: ["MARKDOWN", "HTML"],
            },
            tagIds: {
                type: "array",
                description:
                    "A list of tag IDs to associate with the notebook.",
                items: {
                    type: "integer",
                },
            },
        },
        required: ["id"],
    },
    annotations: {
        title: "Update Notebook",
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: false,
    },
};

// Tool handler
export async function handleUpdateNotebook(input: any) {
    logger.info("=== updateNotebook tool called ===");
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

        if (input.type && !["MARKDOWN", "HTML"].includes(input.type)) {
            logger.error(`Invalid notebook type: ${input.type}`);
            return {
                content: [
                    {
                        type: "text",
                        text: "Error: type must be either MARKDOWN or HTML",
                    },
                ],
            };
        }

        logger.info(`Updating notebook ${input.id}`);

        // Call the service to update the notebook
        const updatedNotebook = await teamworkService.updateNotebook(input);

        logger.info("Notebook updated successfully");
        logger.info(
            `Updated notebook response: ${JSON.stringify(
                updatedNotebook
            ).substring(0, 200)}...`
        );

        // Ensure we return a properly formatted response
        const response = {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(updatedNotebook, null, 2),
                },
            ],
        };

        logger.info("=== updateNotebook tool completed successfully ===");
        return response;
    } catch (error: any) {
        logger.error(`Error in updateNotebook handler: ${error.message}`);
        if (error.stack) {
            logger.error(`Stack trace: ${error.stack}`);
        }

        // Return a properly formatted error response
        return {
            content: [
                {
                    type: "text",
                    text: `Error updating notebook: ${error.message}`,
                },
            ],
        };
    }
}

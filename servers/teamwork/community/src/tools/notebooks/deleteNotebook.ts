/**
 * deleteNotebook tool
 * Deletes an existing notebook in Teamwork
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

export const deleteNotebookDefinition = {
    name: "deleteNotebook",
    description:
        "Delete an existing notebook in Teamwork.com. " + notebookDescription,
    inputSchema: {
        type: "object",
        properties: {
            id: {
                type: "integer",
                description: "The ID of the notebook to delete.",
            },
        },
        required: ["id"],
    },
    annotations: {
        title: "Delete Notebook",
        readOnlyHint: false,
        destructiveHint: true,
        openWorldHint: false,
    },
};

// Tool handler
export async function handleDeleteNotebook(input: any) {
    logger.info("=== deleteNotebook tool called ===");
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

        logger.info(`Deleting notebook ${input.id}`);

        // Call the service to delete the notebook
        const result = await teamworkService.deleteNotebook(input.id);

        logger.info("Notebook deleted successfully");

        // Ensure we return a properly formatted response
        const response = {
            content: [
                {
                    type: "text",
                    text: `Notebook ${input.id} deleted successfully`,
                },
            ],
        };

        logger.info("=== deleteNotebook tool completed successfully ===");
        return response;
    } catch (error: any) {
        logger.error(`Error in deleteNotebook handler: ${error.message}`);
        if (error.stack) {
            logger.error(`Stack trace: ${error.stack}`);
        }

        // Return a properly formatted error response
        return {
            content: [
                {
                    type: "text",
                    text: `Error deleting notebook: ${error.message}`,
                },
            ],
        };
    }
}

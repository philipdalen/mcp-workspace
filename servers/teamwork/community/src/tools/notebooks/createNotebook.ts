/**
 * createNotebook tool
 * Creates a new notebook in Teamwork
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

export const createNotebookDefinition = {
    name: "createNotebook",
    description:
        "Create a new notebook in Teamwork.com. " + notebookDescription,
    inputSchema: {
        type: "object",
        properties: {
            name: {
                type: "string",
                description: "The name of the notebook.",
            },
            projectId: {
                type: "integer",
                description: "The ID of the project to create the notebook in.",
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
        required: ["name", "projectId", "contents", "type"],
    },
    annotations: {
        title: "Create Notebook",
        readOnlyHint: false,
        destructiveHint: false,
        openWorldHint: false,
    },
};

// Tool handler
export async function handleCreateNotebook(input: any) {
    logger.info("=== createNotebook tool called ===");
    logger.info(`Input: ${JSON.stringify(input || {})}`);

    try {
        // Validate required fields
        if (!input.name) {
            logger.error("Missing notebook name");
            return {
                content: [
                    {
                        type: "text",
                        text: "Error: name is required",
                    },
                ],
            };
        }

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

        if (!input.contents) {
            logger.error("Missing notebook contents");
            return {
                content: [
                    {
                        type: "text",
                        text: "Error: contents is required",
                    },
                ],
            };
        }

        if (!input.type) {
            logger.error("Missing notebook type");
            return {
                content: [
                    {
                        type: "text",
                        text: "Error: type is required (must be MARKDOWN or HTML)",
                    },
                ],
            };
        }

        if (!["MARKDOWN", "HTML"].includes(input.type)) {
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

        logger.info(
            `Creating notebook "${input.name}" in project ${input.projectId}`
        );

        // Call the service to create the notebook
        const createdNotebook = await teamworkService.createNotebook(input);

        logger.info("Notebook created successfully");
        logger.info(
            `Created notebook response: ${JSON.stringify(
                createdNotebook
            ).substring(0, 200)}...`
        );

        // Ensure we return a properly formatted response
        const response = {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(createdNotebook, null, 2),
                },
            ],
        };

        logger.info("=== createNotebook tool completed successfully ===");
        return response;
    } catch (error: any) {
        logger.error(`Error in createNotebook handler: ${error.message}`);
        if (error.stack) {
            logger.error(`Stack trace: ${error.stack}`);
        }

        // Return a properly formatted error response
        return {
            content: [
                {
                    type: "text",
                    text: `Error creating notebook: ${error.message}`,
                },
            ],
        };
    }
}

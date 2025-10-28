import logger from "../../utils/logger.js";
import { ensureApiClient } from "../core/apiClient.js";

/**
 * Creates a notebook in Teamwork
 * @param notebookData The notebook data
 * @returns The API response with the created notebook
 */
export const createNotebook = async (notebookData: {
    name: string;
    projectId: number;
    description?: string;
    contents: string;
    type: "MARKDOWN" | "HTML";
    tagIds?: number[];
}) => {
    try {
        logger.info("Creating notebook");

        // Validate required fields
        if (!notebookData.name) {
            throw new Error("Invalid notebook data: missing name");
        }

        if (!notebookData.projectId) {
            throw new Error("Invalid notebook data: missing projectId");
        }

        if (!notebookData.contents) {
            throw new Error("Invalid notebook data: missing contents");
        }

        if (!notebookData.type) {
            throw new Error("Invalid notebook data: missing type");
        }

        if (!["MARKDOWN", "HTML"].includes(notebookData.type)) {
            throw new Error("Invalid notebook type: must be MARKDOWN or HTML");
        }

        logger.info(
            `Creating notebook "${notebookData.name}" in project ${notebookData.projectId}`
        );

        const api = ensureApiClient();
        const endpoint = `projects/${notebookData.projectId}/notebooks.json`;

        // Prepare the payload
        const payload: any = {
            notebook: {
                name: notebookData.name,
                contents: notebookData.contents,
                type: notebookData.type,
            },
        };

        if (notebookData.description) {
            payload.notebook.description = notebookData.description;
        }

        if (notebookData.tagIds && notebookData.tagIds.length > 0) {
            payload.notebook.tagIds = notebookData.tagIds.join(",");
        }

        logger.debug(
            `Making POST request to ${endpoint} with payload: ${JSON.stringify(
                payload
            )}`
        );

        const response = await api.post(endpoint, payload);

        logger.info(`Notebook creation successful, status: ${response.status}`);

        return response.data;
    } catch (error: any) {
        if (error.response) {
            logger.error(
                `Error creating notebook: Status ${
                    error.response.status
                } - ${JSON.stringify(error.response.data)}`
            );
            logger.error(`Request URL: ${error.config?.url}`);
            logger.error(`Request method: ${error.config?.method}`);
            logger.error(`Request data: ${JSON.stringify(error.config?.data)}`);
        } else if (error.request) {
            logger.error(
                `Error creating notebook: No response received - ${error.request}`
            );
        } else {
            logger.error(`Error creating notebook: ${error.message}`);
        }
        throw new Error(`Failed to create notebook: ${error.message}`);
    }
};

export default createNotebook;

import logger from "../../utils/logger.js";
import { ensureApiClient } from "../core/apiClient.js";

/**
 * Updates a notebook in Teamwork
 * @param notebookData The notebook data to update
 * @returns The API response
 */
export const updateNotebook = async (notebookData: {
    id: number;
    name?: string;
    description?: string;
    contents?: string;
    type?: "MARKDOWN" | "HTML";
    tagIds?: number[];
}) => {
    try {
        logger.info(`Updating notebook ${notebookData.id}`);

        // Validate required fields
        if (!notebookData.id) {
            throw new Error("Invalid notebook data: missing id");
        }

        if (
            notebookData.type &&
            !["MARKDOWN", "HTML"].includes(notebookData.type)
        ) {
            throw new Error("Invalid notebook type: must be MARKDOWN or HTML");
        }

        const api = ensureApiClient();
        const endpoint = `notebooks/${notebookData.id}.json`;

        // Prepare the payload with only the fields that are provided
        const payload: any = {
            notebook: {},
        };

        if (notebookData.name !== undefined) {
            payload.notebook.name = notebookData.name;
        }

        if (notebookData.description !== undefined) {
            payload.notebook.description = notebookData.description;
        }

        if (notebookData.contents !== undefined) {
            payload.notebook.contents = notebookData.contents;
        }

        if (notebookData.type !== undefined) {
            payload.notebook.type = notebookData.type;
        }

        if (notebookData.tagIds !== undefined) {
            payload.notebook.tagIds = notebookData.tagIds.join(",");
        }

        logger.debug(
            `Making PUT request to ${endpoint} with payload: ${JSON.stringify(
                payload
            )}`
        );

        const response = await api.put(endpoint, payload);

        logger.info(`Notebook update successful, status: ${response.status}`);

        return response.data;
    } catch (error: any) {
        if (error.response) {
            logger.error(
                `Error updating notebook: Status ${
                    error.response.status
                } - ${JSON.stringify(error.response.data)}`
            );
        } else if (error.request) {
            logger.error(
                `Error updating notebook: No response received - ${error.request}`
            );
        } else {
            logger.error(`Error updating notebook: ${error.message}`);
        }
        throw new Error(`Failed to update notebook: ${error.message}`);
    }
};

export default updateNotebook;

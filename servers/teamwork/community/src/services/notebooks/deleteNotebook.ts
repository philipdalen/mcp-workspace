import logger from "../../utils/logger.js";
import { ensureApiClient } from "../core/apiClient.js";

/**
 * Deletes a notebook in Teamwork
 * @param id The ID of the notebook to delete
 * @returns The API response
 */
export const deleteNotebook = async (id: number) => {
    try {
        logger.info(`Deleting notebook ${id}`);

        // Validate required fields
        if (!id) {
            throw new Error("Invalid request: missing notebook id");
        }

        const api = ensureApiClient();
        const endpoint = `notebooks/${id}.json`;

        logger.debug(`Making DELETE request to ${endpoint}`);

        const response = await api.delete(endpoint);

        logger.info(`Notebook deletion successful, status: ${response.status}`);

        return response.data;
    } catch (error: any) {
        if (error.response) {
            logger.error(
                `Error deleting notebook: Status ${
                    error.response.status
                } - ${JSON.stringify(error.response.data)}`
            );
        } else if (error.request) {
            logger.error(
                `Error deleting notebook: No response received - ${error.request}`
            );
        } else {
            logger.error(`Error deleting notebook: ${error.message}`);
        }
        throw new Error(`Failed to delete notebook: ${error.message}`);
    }
};

export default deleteNotebook;

import logger from "../../utils/logger.js";
import { ensureApiClient } from "../core/apiClient.js";

/**
 * Gets a notebook from Teamwork
 * @param id The ID of the notebook to retrieve
 * @returns The API response with the notebook data
 */
export const getNotebook = async (id: number) => {
    try {
        logger.info(`Getting notebook ${id}`);

        // Validate required fields
        if (!id) {
            throw new Error("Invalid request: missing notebook id");
        }

        const api = ensureApiClient();
        const endpoint = `notebooks/${id}.json`;

        logger.debug(`Making GET request to ${endpoint}`);

        const response = await api.get(endpoint);

        logger.info(`Notebook retrieved successfully`);

        return response.data;
    } catch (error: any) {
        if (error.response) {
            logger.error(
                `Error getting notebook: Status ${
                    error.response.status
                } - ${JSON.stringify(error.response.data)}`
            );
        } else if (error.request) {
            logger.error(
                `Error getting notebook: No response received - ${error.request}`
            );
        } else {
            logger.error(`Error getting notebook: ${error.message}`);
        }
        throw new Error(`Failed to get notebook: ${error.message}`);
    }
};

export default getNotebook;

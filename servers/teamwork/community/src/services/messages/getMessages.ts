import logger from "../../utils/logger.js";
import { getApiClientForVersion } from "../core/apiClient.js";

/**
 * Lists messages (posts) from Teamwork
 * Uses v1 API endpoint: GET /posts.json
 * @param params Query parameters for filtering and pagination
 * @returns The API response with the message list
 */
export const getMessages = async (
    params: {
        page?: number;
        pageSize?: number;
    } = {}
) => {
    try {
        logger.info("Getting messages");

        const api = getApiClientForVersion("v1");
        const endpoint = "/posts.json";

        // Prepare the query parameters
        const queryParams: Record<string, any> = {};

        if (params.page !== undefined) {
            queryParams.page = params.page;
        }

        if (params.pageSize !== undefined) {
            queryParams.pageSize = params.pageSize;
        }

        logger.debug(
            `Making GET request to ${endpoint} with params: ${JSON.stringify(
                queryParams
            )}`
        );

        const response = await api.get(endpoint, { params: queryParams });

        logger.info(`Messages retrieved successfully`);

        return response.data;
    } catch (error: any) {
        if (error.response) {
            logger.error(
                `Error getting messages: Status ${
                    error.response.status
                } - ${JSON.stringify(error.response.data)}`
            );
        } else if (error.request) {
            logger.error(
                `Error getting messages: No response received - ${error.request}`
            );
        } else {
            logger.error(`Error getting messages: ${error.message}`);
        }
        throw new Error(`Failed to get messages: ${error.message}`);
    }
};

export default getMessages;

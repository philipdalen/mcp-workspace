import logger from "../../utils/logger.js";
import { ensureApiClient } from "../core/apiClient.js";

/**
 * Lists tags from Teamwork
 * @param params Query parameters for filtering tags
 * @returns The API response with the tag list
 */
export const listTags = async (
    params: {
        searchTerm?: string;
        itemType?: string;
        projectIds?: number[];
        page?: number;
        pageSize?: number;
    } = {}
) => {
    try {
        logger.info("Listing tags");

        const api = ensureApiClient();
        const endpoint = "tags.json";

        // Prepare the query parameters
        const queryParams: Record<string, any> = {};

        if (params.searchTerm) {
            queryParams.searchTerm = params.searchTerm;
        }

        if (params.itemType) {
            queryParams.itemType = params.itemType;
        }

        if (params.projectIds && params.projectIds.length > 0) {
            queryParams.projectIds = params.projectIds.join(",");
        }

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

        logger.info("Tags retrieved successfully");

        return response.data;
    } catch (error: any) {
        if (error.response) {
            logger.error(
                `Error listing tags: Status ${
                    error.response.status
                } - ${JSON.stringify(error.response.data)}`
            );
        } else if (error.request) {
            logger.error(
                `Error listing tags: No response received - ${error.request}`
            );
        } else {
            logger.error(`Error listing tags: ${error.message}`);
        }
        throw new Error(`Failed to list tags: ${error.message}`);
    }
};

export default listTags;

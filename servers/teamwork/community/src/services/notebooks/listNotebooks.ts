import logger from "../../utils/logger.js";
import { ensureApiClient } from "../core/apiClient.js";

/**
 * Lists notebooks from Teamwork
 * @param params Query parameters for filtering notebooks
 * @returns The API response with the notebook list
 */
export const listNotebooks = async (
    params: {
        projectIds?: number[];
        searchTerm?: string;
        tagIds?: number[];
        matchAllTags?: boolean;
        includeContents?: boolean;
        page?: number;
        pageSize?: number;
    } = {}
) => {
    try {
        logger.info("Listing notebooks");

        const api = ensureApiClient();
        const endpoint = "notebooks.json";

        // Prepare the query parameters
        const queryParams: Record<string, any> = {};

        if (params.projectIds && params.projectIds.length > 0) {
            queryParams.projectIds = params.projectIds.join(",");
        }

        if (params.searchTerm) {
            queryParams.searchTerm = params.searchTerm;
        }

        if (params.tagIds && params.tagIds.length > 0) {
            queryParams.tagIds = params.tagIds.join(",");
        }

        if (params.matchAllTags !== undefined) {
            queryParams.matchAllTags = params.matchAllTags;
        }

        if (params.includeContents !== undefined) {
            queryParams.includeContents = params.includeContents;
        } else {
            // Default to true as per the official implementation
            queryParams.includeContents = true;
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

        logger.info(`Notebooks retrieved successfully`);

        return response.data;
    } catch (error: any) {
        if (error.response) {
            logger.error(
                `Error listing notebooks: Status ${
                    error.response.status
                } - ${JSON.stringify(error.response.data)}`
            );
        } else if (error.request) {
            logger.error(
                `Error listing notebooks: No response received - ${error.request}`
            );
        } else {
            logger.error(`Error listing notebooks: ${error.message}`);
        }
        throw new Error(`Failed to list notebooks: ${error.message}`);
    }
};

export default listNotebooks;

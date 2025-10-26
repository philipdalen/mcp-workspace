import logger from '../../utils/logger.js';
import { ensureApiClient } from '../core/apiClient.js';

/**
 * Fetches all tasks from the Teamwork API
 * @param params Query parameters for filtering and pagination, expected to be in the format required by the Teamwork API (e.g., 'fields[users]').
 * @returns The API response with task data
 */
export const getTasks = async (params: Record<string, any> = {}) => {
  try {
    const api = ensureApiClient();
    
    // The tool handler is now responsible for ensuring correct parameter names.
    // No filtering is needed here; pass the params directly.
    
    logger.debug(`Making GET request to /tasks.json with params: ${JSON.stringify(params)}`);
    
    const response = await api.get('/tasks.json', { params: params });
    return response.data;
  } catch (error: any) {
    if (error.response) {
        logger.error(`Error fetching tasks: Status ${error.response.status} - ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
        logger.error(`Error fetching tasks: No response received - ${error.request}`);
    } else {
        logger.error(`Error fetching tasks: ${error.message}`);
    }
    throw new Error(`Failed to fetch tasks from Teamwork API: ${error.message}`);
  }
};

export default getTasks; 
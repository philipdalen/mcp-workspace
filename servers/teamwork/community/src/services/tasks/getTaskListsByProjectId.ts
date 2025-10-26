import logger from '../../utils/logger.js';
import { ensureApiClient } from '../core/apiClient.js';

/**
 * Fetches task lists for a specific project from the Teamwork API
 * @param projectId The ID of the project to get task lists for
 * @returns The API response with task list data
 */
export const getTaskListsByProjectId = async (projectId: number) => {
  try {
    const api = ensureApiClient();
    const response = await api.get(`/projects/${projectId}/tasklists.json`);
    return response.data;
  } catch (error: any) {
    logger.error(`Error fetching task lists for project ${projectId}: ${error.message}`);
    throw new Error(`Failed to fetch task lists for project ${projectId}`);
  }
};

export default getTaskListsByProjectId; 
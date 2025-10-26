import logger from '../../utils/logger.js';
import { ensureApiClient } from '../core/apiClient.js';

/**
 * Fetches tasks for a specific project from the Teamwork API
 * @param projectId The ID of the project to get tasks for
 * @returns The API response with task data
 */
export const getTasksByProjectId = async (projectId: string) => {
  try {
    const api = ensureApiClient();
    const response = await api.get(`/projects/${projectId}/tasks.json`);
    return response.data;
  } catch (error: any) {
    logger.error(`Error fetching tasks for project ${projectId}: ${error.message}`);
    throw new Error(`Failed to fetch tasks for project ${projectId}`);
  }
};

export default getTasksByProjectId; 
import logger from '../../utils/logger.js';
import { ensureApiClient } from '../core/apiClient.js';
import { PeopleQueryParams } from './getPeople.js';

/**
 * Fetches people assigned to a specific project from the Teamwork API
 * @param projectId The ID of the project
 * @param params Optional query parameters
 * @returns The API response with project people data
 */
export const getProjectPeople = async (projectId: number, params?: Omit<PeopleQueryParams, 'projectId'>) => {
  try {
    logger.info(`Fetching people for project ID ${projectId} from Teamwork API`);
    
    const api = ensureApiClient();
    const response = await api.get(`/projects/${projectId}/people.json`, { params });
    logger.info(`Successfully fetched people for project ID ${projectId}`);
    return response.data;
  } catch (error: any) {
    logger.error(`Teamwork API error: ${error.message}`);
    throw new Error(`Failed to fetch people for project ID ${projectId} from Teamwork API`);
  }
};

export default getProjectPeople; 
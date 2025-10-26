import logger from '../../utils/logger.js';
import { ensureApiClient } from '../core/apiClient.js';
import { PeopleQueryParams } from './getPeople.js';

/**
 * Fetches a specific person by ID from the Teamwork API
 * @param personId The ID of the person to fetch
 * @param params Optional query parameters
 * @returns The API response with person data
 */
export const getPersonById = async (personId: number, params?: Omit<PeopleQueryParams, 'personId'>) => {
  try {
    logger.info(`Fetching person with ID ${personId} from Teamwork API`);
    
    const api = ensureApiClient();
    const response = await api.get(`/people/${personId}.json`, { params });
    logger.info(`Successfully fetched person with ID ${personId}`);
    return response.data;
  } catch (error: any) {
    logger.error(`Teamwork API error: ${error.message}`);
    throw new Error(`Failed to fetch person with ID ${personId} from Teamwork API`);
  }
};

export default getPersonById; 
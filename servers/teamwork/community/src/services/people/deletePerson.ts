import logger from '../../utils/logger.js';
import { ensureApiClient } from '../core/apiClient.js';

/**
 * Deletes a person from Teamwork
 * @param personId The ID of the person to delete
 * @returns The API response
 */
export const deletePerson = async (personId: number) => {
  try {
    logger.info(`Deleting person with ID ${personId} from Teamwork API`);
    
    const api = ensureApiClient();
    const response = await api.delete(`/people/${personId}.json`);
    logger.info(`Successfully deleted person with ID ${personId}`);
    return response.data;
  } catch (error: any) {
    logger.error(`Teamwork API error: ${error.message}`);
    throw new Error(`Failed to delete person with ID ${personId} from Teamwork API`);
  }
};

export default deletePerson; 
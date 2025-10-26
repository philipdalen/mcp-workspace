import logger from '../../utils/logger.js';
import { getApiClientForVersion } from '../core/apiClient.js';

/**
 * Update a person in Teamwork by ID
 * @param personId The ID of the person to update
 * @param updateData The data to update on the person (person object with fields like first-name, timezone, etc.)
 * @returns The updated person data
 */
export const updatePerson = async (personId: number, updateData: any) => {
  try {
    logger.info(`Updating person with ID ${personId}`);
    logger.info(`Update data: ${JSON.stringify(updateData)}`);
    
    const api = getApiClientForVersion('v1');
    // Note: We use put because this is a v1 API endpoint (the base path is handled by the API client)
    const response = await api.put(`people/${personId}.json`, updateData);
    
    logger.info(`Successfully updated person with ID ${personId}`);
    return response.data;
  } catch (error: any) {
    logger.error(`Error updating person with ID ${personId}: ${error.message}`);
    throw new Error(`Failed to update person with ID ${personId}: ${error.message}`);
  }
};

export default updatePerson; 
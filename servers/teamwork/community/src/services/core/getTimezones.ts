import logger from '../../utils/logger.js';
import { getApiClientForVersion } from './apiClient.js';

/**
 * Get all timezones from Teamwork
 * @returns A list of all available timezones
 */
export const getTimezones = async () => {
  try {
    logger.info('Fetching all timezones');
    
    const api = getApiClientForVersion('v1');
    // Note: This is a v1 API endpoint without the projects/api/v3 prefix
    const response = await api.get('timezones.json');
    
    logger.info(`Successfully retrieved ${response.data.timezones?.length || 0} timezones`);
    return response.data;
  } catch (error: any) {
    logger.error(`Error fetching timezones: ${error.message}`);
    throw new Error(`Failed to fetch timezones: ${error.message}`);
  }
};

export default getTimezones; 
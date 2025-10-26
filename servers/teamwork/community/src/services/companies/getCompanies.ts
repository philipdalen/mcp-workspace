import logger from '../../utils/logger.js';
import { ensureApiClient } from '../core/apiClient.js';

/**
 * Get all companies from Teamwork
 * @param params Optional query parameters for filtering companies
 * @returns The API response containing the companies
 */
export const getCompanies = async (params: any = {}) => {
  try {
    logger.info('Fetching all companies from Teamwork API');
    
    const api = ensureApiClient();
    const response = await api.get('companies.json', { params });
    
    logger.info(`Successfully retrieved companies. Count: ${response.data?.companies?.length || 0}`);
    return response.data;
  } catch (error: any) {
    logger.error(`Error fetching companies: ${error.message}`);
    throw new Error(`Failed to fetch companies: ${error.message}`);
  }
};

export default getCompanies; 
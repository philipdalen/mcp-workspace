import logger from '../../utils/logger.js';
import { ensureApiClient } from '../core/apiClient.js';

/**
 * Get a specific company by ID from Teamwork
 * @param companyId The ID of the company to retrieve
 * @param params Optional query parameters for additional options
 * @returns The API response containing the company
 */
export const getCompanyById = async (companyId: number, params: any = {}) => {
  try {
    logger.info(`Fetching company with ID ${companyId} from Teamwork API`);
    
    const api = ensureApiClient();
    const response = await api.get(`companies/${companyId}.json`, { params });
    
    logger.info(`Successfully retrieved company with ID ${companyId}`);
    return response.data;
  } catch (error: any) {
    logger.error(`Error fetching company with ID ${companyId}: ${error.message}`);
    throw new Error(`Failed to fetch company with ID ${companyId}: ${error.message}`);
  }
};

export default getCompanyById; 
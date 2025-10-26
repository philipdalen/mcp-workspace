import logger from '../../utils/logger.js';
import { ensureApiClient } from '../core/apiClient.js';

/**
 * Updates an existing company in Teamwork
 * @param companyId The ID of the company to update
 * @param companyData The company data to update
 * @returns The API response
 */
export const updateCompany = async (companyId: number, companyData: any) => {
  try {
    logger.info(`Updating company with ID ${companyId}`);
    
    const api = ensureApiClient();
    const response = await api.patch(`companies/${companyId}.json`, companyData);
    
    logger.info(`Successfully updated company with ID ${companyId}`);
    return response.data;
  } catch (error: any) {
    logger.error(`Error updating company with ID ${companyId}: ${error.message}`);
    throw new Error(`Failed to update company with ID ${companyId}: ${error.message}`);
  }
};

export default updateCompany; 
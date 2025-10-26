import logger from '../../utils/logger.js';
import { ensureApiClient } from '../core/apiClient.js';

/**
 * Creates a new company in Teamwork
 * @param companyData The company data to create
 * @returns The API response containing the created company
 */
export const createCompany = async (companyData: any) => {
  try {
    logger.info(`Creating new company with name: ${companyData.name}`);
    
    const api = ensureApiClient();
    const response = await api.post('companies.json', companyData);
    
    logger.info(`Successfully created company. Response status: ${response.status}`);
    return response.data;
  } catch (error: any) {
    logger.error(`Error creating company: ${error.message}`);
    throw new Error(`Failed to create company: ${error.message}`);
  }
};

export default createCompany; 
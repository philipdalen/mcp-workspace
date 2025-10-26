import logger from '../../utils/logger.js';
import { ensureApiClient } from '../core/apiClient.js';

/**
 * Deletes a company from Teamwork
 * @param companyId The ID of the company to delete
 * @returns True if the company was successfully deleted
 */
export const deleteCompany = async (companyId: number) => {
  try {
    logger.info(`Deleting company with ID ${companyId}`);
    
    const api = ensureApiClient();
    await api.delete(`companies/${companyId}.json`);
    
    logger.info(`Successfully deleted company with ID ${companyId}`);
    return true;
  } catch (error: any) {
    logger.error(`Error deleting company with ID ${companyId}: ${error.message}`);
    throw new Error(`Failed to delete company with ID ${companyId}: ${error.message}`);
  }
};

export default deleteCompany; 
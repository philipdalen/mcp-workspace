import logger from '../../utils/logger.js';
import { ensureApiClient } from '../core/apiClient.js';

/**
 * Fetches the currently logged-in user's information from the Teamwork API
 * @returns The API response with the logged-in user's data
 */
export const getMe = async () => {
  try {
    const api = ensureApiClient();
    const response = await api.get(`/me.json`);
    return response.data;
  } catch (error: any) {
    logger.error(`Error fetching logged-in user: ${error.message}`);
    throw new Error(`Failed to fetch logged-in user information`);
  }
};

export default getMe;



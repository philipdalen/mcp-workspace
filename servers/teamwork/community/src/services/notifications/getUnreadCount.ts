import logger from '../../utils/logger.js';
import { ensureApiClient } from '../core/apiClient.js';
import { UnreadCountResponse } from '../../models/Notification.js';

/**
 * Fetches the unread notification count from the Teamwork API
 * @returns The API response with unread count data
 */
export const getUnreadCount = async (): Promise<UnreadCountResponse> => {
  try {
    const api = ensureApiClient();
    const response = await api.get('/notifications/unreadcount.json');
    return response.data;
  } catch (error: any) {
    logger.error(`Error fetching unread notification count: ${error.message}`);
    throw new Error('Failed to fetch unread notification count');
  }
};

export default getUnreadCount;



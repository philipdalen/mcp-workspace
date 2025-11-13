import logger from '../../utils/logger.js';
import { ensureApiClient } from '../core/apiClient.js';
import { NotificationsResponse } from '../../models/Notification.js';

export interface GetNotificationsParams {
  unreadOnly?: boolean;
  readOnly?: boolean;
  limit?: number;
  pageOffset?: number;
}

/**
 * Fetches notifications from the Teamwork API
 * @param params Query parameters for filtering notifications
 * @returns The API response with notifications data
 */
export const getNotifications = async (params: GetNotificationsParams = {}): Promise<NotificationsResponse> => {
  try {
    const api = ensureApiClient();
    
    // Build query parameters
    const queryParams: Record<string, string> = {};
    
    if (params.unreadOnly !== undefined) {
      queryParams.unreadOnly = String(params.unreadOnly);
    }
    
    if (params.readOnly !== undefined) {
      queryParams.readOnly = String(params.readOnly);
    }
    
    if (params.limit !== undefined) {
      queryParams.limit = String(params.limit);
    }
    
    if (params.pageOffset !== undefined) {
      queryParams.pageOffset = String(params.pageOffset);
    }
    
    const queryString = Object.keys(queryParams).length > 0 
      ? '?' + new URLSearchParams(queryParams).toString()
      : '';
    
    const response = await api.get(`/notifications.json${queryString}`);
    return response.data;
  } catch (error: any) {
    logger.error(`Error fetching notifications: ${error.message}`);
    throw new Error('Failed to fetch notifications');
  }
};

export default getNotifications;












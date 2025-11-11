import logger from '../../utils/logger.js';
import { ensureApiClient } from '../core/apiClient.js';

/**
 * Updates the read status of a notification in Teamwork
 * @param notificationId The ID of the notification to update
 * @param read Whether to mark the notification as read (true) or unread (false)
 * @returns The API response
 */
export const markNotificationAsRead = async (notificationId: string, read: boolean = true): Promise<any> => {
  try {
    const api = ensureApiClient();
    const response = await api.patch(`/notifications/${notificationId}.json`, {
      notification: {
        read: read
      }
    });
    return response.data;
  } catch (error: any) {
    logger.error(`Error updating notification ${notificationId} read status: ${error.message}`);
    throw new Error(`Failed to update notification ${notificationId} read status`);
  }
};

export default markNotificationAsRead;



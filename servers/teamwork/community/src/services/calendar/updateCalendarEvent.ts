import logger from '../../utils/logger.js';
import { getApiClientForVersion } from '../core/apiClient.js';

/**
 * Updates a calendar event in Teamwork
 * @param eventId The ID of the calendar event to update
 * @param eventData The updated calendar event data
 * @returns The API response
 */
export const updateCalendarEvent = async (eventId: string | number, eventData: {
  event: {
    title?: string;
    start?: string;
    end?: string;
    'all-day'?: boolean;
    description?: string;
    where?: string;
    repeat?: {
      frequency: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
    };
    privacy?: {
      type: string;
    };
    'show-as-busy'?: boolean;
    type?: {
      id?: number;
      color?: string;
      name?: string;
    };
    notify?: boolean;
    'attendees-can-edit'?: boolean;
    'project-users-can-edit'?: boolean;
    'notify-current-user'?: boolean;
    reminders?: any[];
    'attending-user-ids'?: string;
    'notify-user-ids'?: string;
    'email-user-ids'?: string;
    projectId?: number;
  };
}) => {
  try {
    logger.info(`Updating calendar event ${eventId}`);
    
    // Validate required fields
    if (!eventData || !eventData.event) {
      throw new Error('Invalid event data: missing event object');
    }
    
    logger.info(`Event data: ${JSON.stringify(eventData).substring(0, 200)}...`);
    
    // Calendar events use the v1 API
    const api = getApiClientForVersion('v1');
    const response = await api.put(`calendarevents/${eventId}.json`, eventData);
    
    logger.info(`Calendar event update successful, status: ${response.status}`);
    
    return response.data || { success: true, message: 'Calendar event updated successfully' };
  } catch (error: any) {
    logger.error(`Error updating calendar event ${eventId}: ${error.message}`);
    
    // Log detailed error information
    if (error.response) {
      logger.error(`API error status: ${error.response.status}`);
      logger.error(`API error data: ${JSON.stringify(error.response.data || {})}`);
    }
    
    if (error.stack) {
      logger.error(`Stack trace: ${error.stack}`);
    }
    
    throw new Error(`Failed to update calendar event ${eventId}: ${error.message}`);
  }
};

export default updateCalendarEvent;



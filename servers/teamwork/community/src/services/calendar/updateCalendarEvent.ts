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
    description?: string;
    startDate?: string;
    startTime?: string;
    endDate?: string;
    endTime?: string;
    isAllDay?: boolean;
    location?: string;
    remindBefore?: number;
    repeatType?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
    repeatEndDate?: string;
    attendees?: {
      userIds?: number[];
      companyIds?: number[];
    };
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



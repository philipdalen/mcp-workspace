import logger from '../../utils/logger.js';
import { getApiClientForVersion } from '../core/apiClient.js';

/**
 * Creates a calendar event in Teamwork
 * @param eventData The calendar event data
 * @returns The API response with the created event
 */
export const createCalendarEvent = async (eventData: {
  event: {
    title: string;
    description?: string;
    startDate: string;
    startTime?: string;
    endDate: string;
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
    logger.info('Creating calendar event');
    
    // Validate required fields
    if (!eventData || !eventData.event) {
      throw new Error('Invalid event data: missing event object');
    }
    
    if (!eventData.event.title) {
      throw new Error('Invalid event data: missing title');
    }
    
    if (!eventData.event.startDate) {
      throw new Error('Invalid event data: missing startDate');
    }
    
    if (!eventData.event.endDate) {
      throw new Error('Invalid event data: missing endDate');
    }
    
    logger.info(`Event data: ${JSON.stringify(eventData).substring(0, 200)}...`);
    
    // Calendar events use the v1 API
    const api = getApiClientForVersion('v1');
    const response = await api.post('calendarevents.json', eventData);
    
    logger.info(`Calendar event creation successful, status: ${response.status}`);
    
    // Validate response data
    if (!response.data) {
      logger.warn('Calendar event created but response data is empty');
      return { success: true, message: 'Calendar event created successfully, but no details returned' };
    }
    
    return response.data;
  } catch (error: any) {
    logger.error(`Error creating calendar event: ${error.message}`);
    
    // Log detailed error information
    if (error.response) {
      logger.error(`API error status: ${error.response.status}`);
      logger.error(`API error data: ${JSON.stringify(error.response.data || {})}`);
    }
    
    if (error.stack) {
      logger.error(`Stack trace: ${error.stack}`);
    }
    
    throw new Error(`Failed to create calendar event: ${error.message}`);
  }
};

export default createCalendarEvent;



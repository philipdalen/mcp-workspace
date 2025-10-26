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
    start: string;
    end: string;
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
    logger.info('Creating calendar event');
    
    // Validate required fields
    if (!eventData || !eventData.event) {
      throw new Error('Invalid event data: missing event object');
    }
    
    if (!eventData.event.title) {
      throw new Error('Invalid event data: missing title');
    }
    
    if (!eventData.event.start) {
      throw new Error('Invalid event data: missing start datetime');
    }
    
    if (!eventData.event.end) {
      throw new Error('Invalid event data: missing end datetime');
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



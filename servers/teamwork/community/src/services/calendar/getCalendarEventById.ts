import logger from '../../utils/logger.js';
import { getApiClientForVersion } from '../core/apiClient.js';

/**
 * Gets a specific calendar event by ID from Teamwork
 * @param eventId The ID of the calendar event to retrieve
 * @returns The API response with the calendar event details
 */
export const getCalendarEventById = async (eventId: string | number) => {
  try {
    logger.info(`Getting calendar event ${eventId}`);
    
    // Calendar events use the v1 API
    const api = getApiClientForVersion('v1');
    const response = await api.get(`calendarevents/${eventId}.json`);
    
    logger.info(`Calendar event retrieved successfully, status: ${response.status}`);
    
    // Validate response data
    if (!response.data) {
      logger.warn(`Calendar event ${eventId} retrieved but response data is empty`);
      return { success: false, message: 'Calendar event not found' };
    }
    
    return response.data;
  } catch (error: any) {
    logger.error(`Error getting calendar event ${eventId}: ${error.message}`);
    
    // Log detailed error information
    if (error.response) {
      logger.error(`API error status: ${error.response.status}`);
      logger.error(`API error data: ${JSON.stringify(error.response.data || {})}`);
    }
    
    if (error.stack) {
      logger.error(`Stack trace: ${error.stack}`);
    }
    
    throw new Error(`Failed to get calendar event ${eventId}: ${error.message}`);
  }
};

export default getCalendarEventById;



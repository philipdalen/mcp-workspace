/**
 * getMe tool
 * Retrieves the currently logged-in user's information from Teamwork
 */

import logger from "../../utils/logger.js";
import teamworkService from "../../services/index.js";

// Tool definition
export const getMeDefinition = {
  name: "getMe",
  description: "Get the logged user in Teamwork.com. A user is an individual who has access to one or more projects within a Teamwork site, typically as a team member, collaborator, or administrator. Users can be assigned tasks, participate in discussions, log time, share files, and interact with other members depending on their permission levels. Each user has a unique profile that defines their role, visibility, and access to features and project data. Users can belong to clients/companies or teams within the system, and their permissions can be customized to control what actions they can perform or what information they can see.",
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  },
  annotations: {
    title: "Get Logged User",
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: false
  }
};

// Tool handler
export async function handleGetMe(_input: any) {
  logger.info('Calling teamworkService.getMe()');
  
  try {
    const user = await teamworkService.getMe();
    logger.info(`Logged-in user retrieval successful`);
    
    if (user) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify(user, null, 2)
        }]
      };
    } else {
      return {
        content: [{
          type: "text",
          text: `Error getting logged-in user information`
        }]
      };
    }
  } catch (error: any) {
    logger.error(`Error in getMe handler: ${error.message}`);
    return {
      content: [{
        type: "text",
        text: `Error retrieving logged-in user: ${error.message}`
      }]
    };
  }
}



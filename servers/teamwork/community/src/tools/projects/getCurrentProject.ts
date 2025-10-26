/**
 * getCurrentProjectId tool
 * Retrieves the current Teamwork project ID for the solution
 */

import logger from "../../utils/logger.js";
import teamworkService from "../../services/index.js";

// Tool definition
export const getCurrentProjectDefinition = {
  name: "getCurrentProject",
  description: "Get the current solution's Teamwork project, always check the `.teamwork` file in the root of the solution for the Teamwork project ID or ask the user which project they are working on.",
  inputSchema: {
    type: "object",
    properties: {
      projectId: {
        type: "integer",
        description: "The current Teamwork project ID associated with the solution."
      }
    },
    required: ["projectId"]
  },
  annotations: {
    title: "Get the Current Project",
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: false
  }
};

// Tool handler
export async function handleGetCurrentProject(input: any) {

  try {
    
    const projectId = String(input?.projectId);
    if (!projectId) {
      throw new Error("Project ID is required");
    }
    
    const result = await teamworkService.getCurrentProject(projectId);
       
    return {
      content: [{
        type: "text",
        text: JSON.stringify(result, null, 2)
      }]
    };
  } catch (error: any) {
    logger.error(`Error in getCurrentProject handler: ${error.message}`);
    return {
      content: [{
        type: "text",
        text: `Error retrieving current project: ${error.message}`
      }]
    };
  }
} 
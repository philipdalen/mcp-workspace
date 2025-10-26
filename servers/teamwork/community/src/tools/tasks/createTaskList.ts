/**
 * createTaskList tool
 * Creates a new task list in a specific project in Teamwork
 */

import logger from "../../utils/logger.js";
import teamworkService from "../../services/index.js";

// Tool definition
export const createTaskListDefinition = {
  name: "createTaskList",
  description: "Create a new task list in Teamwork.com. In the context of Teamwork.com, a task list is a way to group related tasks within a project, helping teams organize their work into meaningful sections such as phases, categories, or deliverables. Each task list belongs to a specific project and can include multiple tasks that are typically aligned with a common goal. Task lists can be associated with milestones, and they support privacy settings that control who can view or interact with the tasks they contain. This structure helps teams manage progress, assign responsibilities, and maintain clarity across complex projects.",
  inputSchema: {
    type: "object",
    properties: {
      projectId: {
        type: "integer",
        description: "The ID of the project to create the task list in"
      },
      name: {
        type: "string",
        description: "The name of the task list"
      },
      description: {
        type: "string",
        description: "The description of the task list"
      },
      milestoneId: {
        type: "integer",
        description: "The ID of the milestone to associate with the task list"
      }
    },
    required: ["projectId", "name"]
  },
  annotations: {
    title: "Create Task List",
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: false
  }
};

// Tool handler
export async function handleCreateTaskList(input: any) {
  logger.info('Calling teamworkService.createTaskList()');
  logger.info(`Project ID: ${input?.projectId}, Name: ${input?.name}`);
  
  try {
    const projectId = input?.projectId;
    const name = input?.name;
    
    if (!projectId) {
      throw new Error("Project ID is required");
    }
    
    if (!name) {
      throw new Error("Task list name is required");
    }
    
    const taskListData = {
      name,
      description: input?.description,
      milestoneId: input?.milestoneId
    };
    
    const result = await teamworkService.createTaskList(projectId, taskListData);
    logger.info(`Task list creation successful`);
    
    if (result) {
      return {
        content: [{
          type: "text",
          text: JSON.stringify(result, null, 2)
        }]
      };
    } else {
      return {
        content: [{
          type: "text",
          text: `Error creating task list in project ID: ${projectId}`
        }]
      };
    }
  } catch (error: any) {
    logger.error(`Error in createTaskList handler: ${error.message}`);
    return {
      content: [{
        type: "text",
        text: `Error creating task list: ${error.message}`
      }]
    };
  }
}



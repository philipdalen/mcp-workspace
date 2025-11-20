/**
 * completeTask tool
 * Marks a task as complete or incomplete in Teamwork
 */

import logger from "../../utils/logger.js";
import teamworkService from "../../services/index.js";

// Tool definition for completing a task
export const completeTaskDefinition = {
  name: "completeTask",
  description: "Mark a task as complete in Teamwork",
  inputSchema: {
    type: "object",
    properties: {
      taskId: {
        type: "integer",
        description: "The ID of the task to mark as complete"
      }
    },
    required: ["taskId"]
  },
  annotations: {
    title: "Complete a Task",
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: false
  }
};

// Tool definition for uncompleting a task
export const uncompleteTaskDefinition = {
  name: "uncompleteTask",
  description: "Mark a task as incomplete in Teamwork",
  inputSchema: {
    type: "object",
    properties: {
      taskId: {
        type: "integer",
        description: "The ID of the task to mark as incomplete"
      }
    },
    required: ["taskId"]
  },
  annotations: {
    title: "Uncomplete a Task",
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: false
  }
};

// Tool handler for completing a task
export async function handleCompleteTask(input: any) {
  logger.info('Calling teamworkService.completeTask()');
  logger.info(`Task ID: ${input?.taskId}`);
  
  try {
    const taskId = String(input?.taskId);
    if (!taskId) {
      throw new Error("Task ID is required");
    }
    
    const result = await teamworkService.completeTask(taskId);
    logger.info(`Task completed successfully for task ID: ${taskId}`);
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify(result, null, 2)
      }]
    };
  } catch (error: any) {
    logger.error(`Error in completeTask handler: ${error.message}`);
    return {
      content: [{
        type: "text",
        text: `Error completing task: ${error.message}`
      }]
    };
  }
}

// Tool handler for uncompleting a task
export async function handleUncompleteTask(input: any) {
  logger.info('Calling teamworkService.uncompleteTask()');
  logger.info(`Task ID: ${input?.taskId}`);
  
  try {
    const taskId = String(input?.taskId);
    if (!taskId) {
      throw new Error("Task ID is required");
    }
    
    const result = await teamworkService.uncompleteTask(taskId);
    logger.info(`Task uncompleted successfully for task ID: ${taskId}`);
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify(result, null, 2)
      }]
    };
  } catch (error: any) {
    logger.error(`Error in uncompleteTask handler: ${error.message}`);
    return {
      content: [{
        type: "text",
        text: `Error uncompleting task: ${error.message}`
      }]
    };
  }
}



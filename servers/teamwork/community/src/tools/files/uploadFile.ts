/**
 * uploadFile tool
 * Uploads a file to Teamwork and returns a reference that can be used to attach to tasks
 */

import logger from "../../utils/logger.js";
import teamworkService from "../../services/index.js";
import * as path from "path";

export const uploadFileDefinition = {
  name: "uploadFile",
  description: "Upload a file to Teamwork. Returns a file reference that can be used to attach the file to tasks using the updateTask or createTask tools. The file reference can be used in the attachments.pendingFiles array.",
  inputSchema: {
    type: "object",
    properties: {
      filePath: {
        type: "string",
        description: "The absolute or relative path to the file to upload. If relative, it will be resolved from the current working directory."
      },
      projectId: {
        type: "integer",
        description: "Optional project ID to associate the file with"
      }
    },
    required: ["filePath"]
  },
  annotations: {
    title: "Upload File to Teamwork",
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: false
  }
};

// Tool handler
export async function handleUploadFile(input: any) {
  logger.info("=== uploadFile tool called ===");
  logger.info(`Input: ${JSON.stringify(input || {})}`);
  
  try {
    const filePath = input.filePath;
    const projectId = input.projectId;
    
    if (!filePath) {
      return {
        content: [{
          type: "text",
          text: "Error: filePath is required"
        }]
      };
    }
    
    // Resolve the file path (handle both absolute and relative paths)
    const resolvedPath = path.isAbsolute(filePath) 
      ? filePath 
      : path.resolve(process.cwd(), filePath);
    
    logger.info(`Resolved file path: ${resolvedPath}`);
    
    // Call the service to upload the file
    const result = await teamworkService.uploadFile(resolvedPath, projectId);
    
    logger.info("File uploaded successfully");
    logger.info(`File reference: ${result.ref}`);
    
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          success: true,
          message: "File uploaded successfully",
          ref: result.ref,
          fileId: result.fileId,
          instructions: `Use the 'ref' value in the attachments.pendingFiles array when creating or updating tasks. Example: { "attachments": { "pendingFiles": [{ "reference": "${result.ref}" }] } }`
        }, null, 2)
      }]
    };
  } catch (error: any) {
    logger.error(`Error in uploadFile handler: ${error.message}`);
    if (error.stack) {
      logger.error(`Stack trace: ${error.stack}`);
    }
    
    return {
      content: [{
        type: "text",
        text: `Error uploading file: ${error.message}`
      }]
    };
  }
}


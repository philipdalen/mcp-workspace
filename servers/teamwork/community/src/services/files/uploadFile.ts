import logger from '../../utils/logger.js';
import { getApiClientForVersion } from '../core/apiClient.js';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Uploads a file to Teamwork and returns a file reference that can be used to attach to tasks
 * @param filePath The path to the file to upload
 * @param projectId Optional project ID to associate the file with
 * @returns The file reference (ref) that can be used in pendingFileAttachments
 */
export const uploadFile = async (filePath: string, projectId?: number): Promise<{ ref: string; fileId?: number }> => {
  try {
    logger.info(`Uploading file: ${filePath}`);
    
    // Validate file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    // Get file stats
    const stats = fs.statSync(filePath);
    const fileSize = stats.size;
    const fileName = path.basename(filePath);
    
    logger.info(`File name: ${fileName}, File size: ${fileSize} bytes`);
    
    // Step 1: Get pre-signed URL from Teamwork
    const api = getApiClientForVersion('v1');
    
    const presignedUrlParams: any = {
      fileName: fileName,
      fileSize: fileSize
    };
    
    if (projectId) {
      presignedUrlParams.projectId = projectId;
    }
    
    logger.info(`Requesting pre-signed URL with params: ${JSON.stringify(presignedUrlParams)}`);
    
    // The v1 API endpoint for pre-signed URLs
    const presignedResponse = await api.get('projects/api/v1/pendingfiles/presignedurl.json', {
      params: presignedUrlParams
    });
    
    if (!presignedResponse.data || !presignedResponse.data.ref || !presignedResponse.data.url) {
      throw new Error('Invalid response from pre-signed URL request');
    }
    
    const { ref, url } = presignedResponse.data;
    logger.info(`Received pre-signed URL. Ref: ${ref}`);
    
    // Step 2: Upload file to pre-signed URL
    logger.info(`Uploading file to pre-signed URL...`);
    
    // Read the file
    const fileBuffer = fs.readFileSync(filePath);
    
    // Extract host from URL for the Host header
    const urlObj = new URL(url);
    const host = urlObj.host;
    
    // Upload to S3 using the pre-signed URL
    const uploadResponse = await axios.put(url, fileBuffer, {
      headers: {
        'X-Amz-Acl': 'public-read',
        'Content-Length': fileSize.toString(),
        'Host': host,
        'Content-Type': 'application/octet-stream'
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });
    
    logger.info(`File uploaded successfully. Status: ${uploadResponse.status}`);
    
    // Return the reference that can be used to attach the file
    return {
      ref: ref,
      fileId: presignedResponse.data.fileId
    };
  } catch (error: any) {
    logger.error(`Error uploading file ${filePath}: ${error.message}`);
    
    if (error.response) {
      logger.error(`Upload error status: ${error.response.status}`);
      logger.error(`Upload error data: ${JSON.stringify(error.response.data || {})}`);
    }
    
    if (error.stack) {
      logger.error(`Stack trace: ${error.stack}`);
    }
    
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

export default uploadFile;



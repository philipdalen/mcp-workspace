import logger from "../../utils/logger.js";
import { ensureApiClient, getApiClientForVersion } from "../core/apiClient.js";
import { PayloadUserGroups } from "../../models/PayloadUserGroups.js";

/**
 * Updates a notebook in Teamwork
 * @param notebookData The notebook data to update
 * @returns The API response
 */
export const updateNotebook = async (notebookData: {
    id: number;
    name?: string;
    description?: string;
    contents?: string;
    type?: "MARKDOWN" | "HTML";
    tagIds?: number[];
    commentFollowers?: PayloadUserGroups;
    changeFollowers?: PayloadUserGroups;
}) => {
    try {
        logger.info(`Updating notebook ${notebookData.id}`);

        // Validate required fields
        if (!notebookData.id) {
            throw new Error("Invalid notebook data: missing id");
        }

        if (
            notebookData.type &&
            !["MARKDOWN", "HTML"].includes(notebookData.type)
        ) {
            throw new Error("Invalid notebook type: must be MARKDOWN or HTML");
        }

        // Use v1 API client for this endpoint (matches UI behavior)
        const api = getApiClientForVersion('v1');
        // Use endpoint: /notebooks/{notebookId}.json
        const endpoint = `notebooks/${notebookData.id}.json`;

        // Prepare the payload matching the actual API format
        const payload: any = {
            sendDiff: false,
            notebook: {},
        };

        if (notebookData.name !== undefined) {
            payload.notebook.name = notebookData.name;
        }

        if (notebookData.description !== undefined) {
            payload.notebook.description = notebookData.description;
        }

        if (notebookData.contents !== undefined) {
            payload.notebook.content = notebookData.contents;
        }

        if (notebookData.type !== undefined) {
            payload.notebook["notebook-type"] = notebookData.type;
            payload.notebook["new-version"] = true;
        }

        // Set default fields that are required
        payload.notebook["notify-current-user"] = false;
        payload.notebook["grant-access-to"] = "";

        // Collect all user IDs from both comment and change followers for notify field
        const notifyUserIds: number[] = [];
        let hasAnyFollowers = false;
        
        if (notebookData.commentFollowers?.userIds && notebookData.commentFollowers.userIds.length > 0) {
            notifyUserIds.push(...notebookData.commentFollowers.userIds);
            hasAnyFollowers = true;
        }
        if (notebookData.changeFollowers?.userIds && notebookData.changeFollowers.userIds.length > 0) {
            notifyUserIds.push(...notebookData.changeFollowers.userIds);
            hasAnyFollowers = true;
        }
        
        // Remove duplicates
        const uniqueNotifyUserIds = [...new Set(notifyUserIds)];
        
        // Set notify field - empty string to clear, or comma-separated IDs to set
        if (notebookData.commentFollowers !== undefined || notebookData.changeFollowers !== undefined) {
            payload.notebook.notify = hasAnyFollowers ? uniqueNotifyUserIds.join(",") : "";
        } else {
            // If followers not specified, don't include notify field (or set to empty if we want to preserve existing)
            payload.notebook.notify = "";
        }

        // Note: The update API uses 'notify' field as comma-separated string for followers
        // The commentFollowers and changeFollowers objects are handled via the notify field above

        logger.debug(
            `Making PUT request to ${endpoint} with payload: ${JSON.stringify(
                payload
            )}`
        );

        const response = await api.put(endpoint, payload);

        logger.info(`Notebook update successful, status: ${response.status}`);

        return response.data;
    } catch (error: any) {
        if (error.response) {
            logger.error(
                `Error updating notebook: Status ${
                    error.response.status
                } - ${JSON.stringify(error.response.data)}`
            );
        } else if (error.request) {
            logger.error(
                `Error updating notebook: No response received - ${error.request}`
            );
        } else {
            logger.error(`Error updating notebook: ${error.message}`);
        }
        throw new Error(`Failed to update notebook: ${error.message}`);
    }
};

export default updateNotebook;

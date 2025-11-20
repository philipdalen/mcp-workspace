import logger from "../../utils/logger.js";
import { ensureApiClient, getApiClientForVersion } from "../core/apiClient.js";
import { PayloadUserGroups } from "../../models/PayloadUserGroups.js";

/**
 * Creates a notebook in Teamwork
 * @param notebookData The notebook data
 * @returns The API response with the created notebook
 */
export const createNotebook = async (notebookData: {
    name: string;
    projectId: number;
    description?: string;
    contents: string;
    type: "MARKDOWN" | "HTML";
    tagIds?: number[];
    commentFollowers?: PayloadUserGroups;
    changeFollowers?: PayloadUserGroups;
}) => {
    try {
        logger.info("Creating notebook");

        // Validate required fields
        if (!notebookData.name) {
            throw new Error("Invalid notebook data: missing name");
        }

        if (!notebookData.projectId) {
            throw new Error("Invalid notebook data: missing projectId");
        }

        if (!notebookData.contents) {
            throw new Error("Invalid notebook data: missing contents");
        }

        if (!notebookData.type) {
            throw new Error("Invalid notebook data: missing type");
        }

        if (!["MARKDOWN", "HTML"].includes(notebookData.type)) {
            throw new Error("Invalid notebook type: must be MARKDOWN or HTML");
        }

        logger.info(
            `Creating notebook "${notebookData.name}" in project ${notebookData.projectId}`
        );

        // Use v1 API client for this endpoint (matches UI behavior - /projects/{projectId}/notebooks.json)
        const api = getApiClientForVersion("v1");
        // Use endpoint: /projects/{projectId}/notebooks.json (matches UI behavior)
        const endpoint = `projects/${notebookData.projectId}/notebooks.json`;

        // Prepare the payload matching the actual API format
        const payload: any = {
            notebook: {
                name: notebookData.name,
                description: notebookData.description || "",
                content:
                    notebookData.type === "HTML"
                        ? notebookData.contents
                        : notebookData.contents, // For MARKDOWN, content is the raw markdown
                "category-id": 0,
                locked: false,
                "notebook-type": notebookData.type,
                "notify-current-user": false,
                secureContent: false,
                "grant-access-to": "",
                private: 0,
            },
        };

        // Collect all user IDs from both comment and change followers for notify field
        const notifyUserIds: number[] = [];

        if (notebookData.commentFollowers?.userIds) {
            notifyUserIds.push(...notebookData.commentFollowers.userIds);
        }
        if (notebookData.changeFollowers?.userIds) {
            notifyUserIds.push(...notebookData.changeFollowers.userIds);
        }

        // Remove duplicates
        const uniqueNotifyUserIds = [...new Set(notifyUserIds)];

        if (uniqueNotifyUserIds.length > 0) {
            // Use notify field as comma-separated string (matches UI format)
            payload.notebook.notify = uniqueNotifyUserIds.join(",");
        }

        // For HTML type, ensure content is wrapped in div if it's not already HTML
        if (
            notebookData.type === "HTML" &&
            !notebookData.contents.trim().startsWith("<")
        ) {
            payload.notebook.content = `<div>${notebookData.contents}</div>`;
        }

        // Handle tagIds if provided (may need to be in a different format)
        if (notebookData.tagIds && notebookData.tagIds.length > 0) {
            // Note: Tag IDs might need to be handled differently for this endpoint
            // Leaving this for now as it may not be supported in this format
        }

        logger.debug(
            `Making POST request to ${endpoint} with payload: ${JSON.stringify(
                payload
            )}`
        );

        const response = await api.post(endpoint, payload);

        logger.info(`Notebook creation successful, status: ${response.status}`);

        return response.data;
    } catch (error: any) {
        if (error.response) {
            logger.error(
                `Error creating notebook: Status ${
                    error.response.status
                } - ${JSON.stringify(error.response.data)}`
            );
            logger.error(`Request URL: ${error.config?.url}`);
            logger.error(`Request method: ${error.config?.method}`);
            logger.error(`Request data: ${JSON.stringify(error.config?.data)}`);
        } else if (error.request) {
            logger.error(
                `Error creating notebook: No response received - ${error.request}`
            );
        } else {
            logger.error(`Error creating notebook: ${error.message}`);
        }
        throw new Error(`Failed to create notebook: ${error.message}`);
    }
};

export default createNotebook;

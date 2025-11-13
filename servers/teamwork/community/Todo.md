# Teamwork API V3 Endpoints Todo List

## Activity

-   🟨 DELETE /projects/api/v3/activity/{activityLogId}
-   🟨 GET /projects/api/v3/latestactivity.json
-   🟨 GET /projects/api/v3/projects/{projectId}/latestactivity
-   🟨 DELETE /projects/api/v3/projects/{projectId}/activity

## Comments

-   ✅ POST /{resource}/{resourceId}/comments.json ( Resource options: links, milestones, files, notebooks or tasks )

## TimeTracking

-   ✅ GET /projects/api/v3/allocations/{allocationId}/time.json
-   🟨 GET /projects/api/v3/companies/time.json
-   🟨 GET /projects/api/v3/me/timers.json
-   🟨 POST /projects/api/v3/me/timers.json
-   🟨 DELETE /projects/api/v3/me/timers/{timerId}.json
-   🟨 PUT /projects/api/v3/me/timers/{timerId}.json
-   🟨 PUT /projects/api/v3/me/timers/{timerId}/complete.json
-   🟨 PUT /projects/api/v3/me/timers/{timerId}/pause.json
-   🟨 PUT /projects/api/v3/me/timers/{timerId}/resume.json
-   🟨 PUT /projects/api/v3/me/timers/{timerId}/undelete.json
-   🟨 GET /projects/api/v3/projects/{projectId}/time.json
-   🟨 POST /projects/api/v3/projects/{projectId}/time.json
-   🟨 GET /projects/api/v3/projects/{projectId}/time/total.json
-   🟨 GET /projects/api/v3/reporting/precanned/companytime.json
-   🟨 GET /projects/api/v3/tasklists/{tasklistId}/time/total.json
-   🟨 GET /projects/api/v3/tasks/{taskId}/time.json
-   🟨 POST /projects/api/v3/tasks/{taskId}/time.json
-   🟨 GET /projects/api/v3/tasks/{taskId}/time/total.json
-   ✅ GET /projects/api/v3/time.json
-   🟨 GET /projects/api/v3/time/total.json
-   🟨 DELETE /projects/api/v3/time/{timelogId}.json
-   🟨 GET /projects/api/v3/time/{timelogId}.json
-   🟨 PATCH /projects/api/v3/time/{timelogId}.json
-   🟨 GET /projects/api/v3/timers.json
-   🟨 GET /projects/api/v3/timers/{timerId}.json

## Budgets

-   🟨 DELETE /projects/api/v3/budget/notifications/{notificationId}.json
-   🟨 PATCH /projects/api/v3/budget/notifications/{notificationId}.json
-   🟨 POST /projects/api/v3/budgets/:id/tasklists/budgets/bulk/add.json
-   🟨 PATCH /projects/api/v3/projects/budgets/:budgetId/tasklists/budgets/:tasklistId.json
-   🟨 GET /projects/api/v3/projects/budgets/:id/tasklists/budgets.json
-   🟨 PUT /projects/api/v3/projects/budgets/:id/tasklists/budgets.json

## CalendarEvents

-   🟨 GET /projects/api/v3/calendar/events.csv
-   🟨 GET /projects/api/v3/calendar/events.html
-   🟨 GET /projects/api/v3/calendar/events.pdf
-   🟨 GET /projects/api/v3/calendar/events.xlsx

## Companies

-   ✅ GET /projects/api/v3/companies.json
-   ✅ POST /projects/api/v3/companies.json
-   ✅ DELETE /projects/api/v3/companies/{companyId}.json
-   ✅ GET /projects/api/v3/companies/{companyId}.json
-   ✅ PATCH /projects/api/v3/companies/{companyId}.json

## BETA

-   🟨 POST /projects/api/v3/companies/:id/domains.json
-   🟨 DELETE /projects/api/v3/companies/domains/{id}.json
-   🟨 PATCH /projects/api/v3/companies/domains/{id}.json

## CustomFields

-   🟨 GET /projects/api/v3/companies/{companyId}/customfields.json
-   🟨 POST /projects/api/v3/companies/{companyId}/customfields.json
-   🟨 POST /projects/api/v3/companies/{companyId}/customfields/bulk/delete.json
-   🟨 POST /projects/api/v3/companies/{companyId}/customfields/bulk/update.json
-   🟨 DELETE /projects/api/v3/companies/{companyId}/customfields/{customFieldId}.json
-   🟨 GET /projects/api/v3/companies/{companyId}/customfields/{customFieldId}.json
-   🟨 PATCH /projects/api/v3/companies/{companyId}/customfields/{customFieldId}.json
-   🟨 GET /projects/api/v3/customfields.json
-   🟨 POST /projects/api/v3/customfields.json
-   🟨 POST /projects/api/v3/customfields/bulk/delete.json
-   🟨 DELETE /projects/api/v3/customfields/{customFieldId}.json
-   🟨 GET /projects/api/v3/customfields/{customFieldId}.json
-   🟨 PATCH /projects/api/v3/customfields/{customFieldId}.json
-   🟨 PUT /projects/api/v3/customfields/{customFieldId}.json
-   🟨 GET /projects/api/v3/projects/{projectId}/customfields.json
-   🟨 POST /projects/api/v3/projects/{projectId}/customfields.json
-   🟨 POST /projects/api/v3/projects/{projectId}/customfields/bulk/delete.json
-   🟨 POST /projects/api/v3/projects/{projectId}/customfields/bulk/update.json
-   🟨 DELETE /projects/api/v3/projects/{projectId}/customfields/{customFieldId}.json
-   🟨 GET /projects/api/v3/projects/{projectId}/customfields/{customFieldId}.json
-   🟨 PATCH /projects/api/v3/projects/{projectId}/customfields/{customFieldId}.json
-   🟨 GET /projects/api/v3/tasks/{taskId}/customfields.json
-   🟨 POST /projects/api/v3/tasks/{taskId}/customfields.json
-   🟨 POST /projects/api/v3/tasks/{taskId}/customfields/bulk/delete.json
-   🟨 POST /projects/api/v3/tasks/{taskId}/customfields/bulk/update.json
-   🟨 DELETE /projects/api/v3/tasks/{taskId}/customfields/{customFieldId}.json
-   🟨 GET /projects/api/v3/tasks/{taskId}/customfields/{customFieldId}.json
-   🟨 PATCH /projects/api/v3/tasks/{taskId}/customfields/{customFieldId}.json

## Dashboards

-   🟨 GET /projects/api/v3/dashboards.json

## Features

-   🟨 GET /projects/api/v3/features.json

## FileComments

-   🟨 GET /projects/api/v3/files/{fileId}/comments.json

## FileVersionComments

-   🟨 GET /projects/api/v3/fileversions/{id}/comments.json

## Forms

-   🟨 GET /projects/api/v3/forms.json
-   🟨 POST /projects/api/v3/forms.json
-   🟨 DELETE /projects/api/v3/forms/{formId}.json
-   🟨 GET /projects/api/v3/forms/{formId}.json
-   🟨 PATCH /projects/api/v3/forms/{formId}.json
-   🟨 GET /projects/api/v3/forms/{formId}/draft.json

## FormsPublic

-   🟨 GET /projects/api/v3/forms/public/{token}.json
-   🟨 POST /projects/api/v3/forms/{formID}/copy.json

## Importers

-   🟨 GET /projects/api/v3/importer/stats.json

## Messages

-   🟨 GET /projects/api/v3/messages.json
-   🟨 GET /projects/api/v3/messages/{messageId}.json
-   🟨 PATCH /projects/api/v3/messages/{messageId}.json

## Milestones

-   🟨 GET /projects/api/v3/milestones.json
-   🟨 GET /projects/api/v3/milestones/metrics/deadlines.json
-   🟨 GET /projects/api/v3/milestones/{milestoneId}.json
-   🟨 GET /projects/api/v3/projects/{projectId}/milestones.json

## MilestoneComments

-   🟨 GET /projects/api/v3/milestones/{milestoneId}/comments.json

## Notebooks

-   ✅ GET /projects/api/v3/notebooks.json
-   ✅ DELETE /projects/api/v3/notebooks/{notebookId}.json
-   ✅ GET /projects/api/v3/notebooks/{notebookId}.json
-   ✅ PATCH /projects/api/v3/notebooks/{notebookId}.json
-   🟨 GET /projects/api/v3/notebooks/{notebookId}/compare.json
-   🟨 PUT /projects/api/v3/notebooks/{notebookId}/lock.json
-   🟨 PUT /projects/api/v3/notebooks/{notebookId}/unlock.json
-   🟨 DELETE /projects/api/v3/notebooks/{notebookId}/versions.json
-   🟨 GET /projects/api/v3/notebooks/{notebookId}/versions.json
-   🟨 GET /projects/api/v3/notebooks/{notebookId}/versions/{versionId}.json
-   ✅ POST /projects/api/v3/projects/{projectId}/notebooks.json

## NotebookComments

-   🟨 GET /projects/api/v3/notebooks/{notebookId}/comments.json

## People

-   ✅ PUT /people/{personId}.json
-   ✅ GET /projects/api/v3/people.json
-   ✅ GET /projects/api/v3/people/{personId}.json
-   ✅ GET /projects/api/v3/projects/{projectId}/people.json
-   ✅ POST /projects/api/v3/projects/{projectId}/people.json
-   ✅ DELETE /projects/api/v3/people/{personId}.json
-   ✅ GET /projects/api/v3/people/metrics/performance.json
-   ✅ GET /projects/api/v3/people/utilization.json
-   ✅ GET /projects/api/v3/projects/{projectId}/people/{personId}.json
-   ✅ GET /projects/api/v3/reporting/precanned/usertaskcompletion/{userId}.json
-   ✅ GET /projects/api/v3/reporting/precanned/utilization.csv
-   ✅ GET /projects/api/v3/reporting/precanned/utilization.html
-   ✅ GET /projects/api/v3/reporting/precanned/utilization.pdf
-   ✅ GET /projects/api/v3/reporting/precanned/utilization.xlsx

## Person

-   ✅ GET /projects/api/v3/people/{personId}.json
-   ✅ GET /projects/api/v3/projects/{projectId}/people/{personId}.json
-   ✅ GET /projects/api/v3/reporting/precanned/usertaskcompletion/{userId}.json
-   ✅ GET /projects/api/v3/me.json

## Categories

-   🟨 GET /projects/api/v3/projectcategories.json
-   🟨 GET /projects/api/v3/projectcategories/{categoryId}.json
-   🟨 GET /projects/api/v3/projects/teamwork/categories.json

## Projects

-   ✅ GET /projects/api/v3/projects.json
-   🟨 PUT /projects/api/v3/projects/featureorder.json
-   🟨 GET /projects/api/v3/projects/metrics/active.json
-   🟨 GET /projects/api/v3/projects/metrics/billable.json
-   🟨 GET /projects/api/v3/projects/metrics/healths.json
-   🟨 GET /projects/api/v3/projects/metrics/invoice.json
-   🟨 GET /projects/api/v3/projects/metrics/owners.json
-   🟨 GET /projects/api/v3/projects/metrics/unbilled.json
-   🟨 GET /projects/api/v3/projects/starred.json
-   🟨 GET /projects/api/v3/projects/teamwork/samples.json
-   🟨 GET /projects/api/v3/projects/templates.json
-   🟨 PUT /projects/api/v3/projects/tentative/{projectId}/convert.json
-   ✅ GET /projects/api/v3/projects/{projectId}.json
-   🟨 GET /projects/api/v3/projects/{projectId}/featureorder.json
-   🟨 PUT /projects/api/v3/projects/{projectId}/featureorder.json
-   🟨 GET /projects/api/v3/reporting/precanned/health/projects.csv
-   🟨 GET /projects/api/v3/reporting/precanned/health/projects.html
-   🟨 GET /projects/api/v3/reporting/precanned/health/projects.pdf
-   🟨 GET /projects/api/v3/reporting/precanned/health/projects.xlsx

## ProjectUpdates

-   🟨 GET /projects/api/v3/projects/updates.json
-   🟨 GET /projects/api/v3/projects/{projectIds}/updates.json

## Risks

-   🟨 GET /projects/api/v3/projects/{projectId}/risks
-   🟨 PUT /projects/api/v3/projects/{projectId}/risks/copy
-   🟨 GET /projects/api/v3/risks.json

## Summary

-   🟨 GET /projects/api/v3/projects/{projectId}/summary.json
-   🟨 GET /projects/api/v3/summary.json

## TaskLists

-   ✅ GET /projects/api/v3/projects/{projectId}/tasklists
-   🟨 GET /projects/api/v3/projects/{projectId}/tasklists.csv
-   🟨 GET /projects/api/v3/projects/{projectId}/tasklists.html
-   🟨 GET /projects/api/v3/projects/{projectId}/tasklists.pdf
-   🟨 GET /projects/api/v3/projects/{projectId}/tasklists.xlsx
-   🟨 GET /projects/api/v3/tasklists
-   ✅ GET /projects/api/v3/tasklists/{tasklistId}
-   ✅ POST /projects/api/v3/projects/{projectId}/tasklists.json
-   ✅ PUT /projects/api/v3/tasklists/{tasklistId}.json
-   ✅ DELETE /projects/api/v3/tasklists/{tasklistId}.json

## Tasks

-   ✅ POST /projects/api/v3/tasklists/{tasklistId}/tasks.json
-   ✅ GET /projects/api/v3/projects/{projectId}/tasks.json
-   ✅ GET /projects/api/v3/tasklists/{tasklistId}/tasks.json
-   ✅ GET /projects/api/v3/tasks.json
-   ✅ GET /projects/api/v3/tasks/metrics/complete.json
-   ✅ GET /projects/api/v3/tasks/metrics/late.json
-   ✅ DELETE /projects/api/v3/tasks/{taskId}.json
-   ✅ GET /projects/api/v3/tasks/{taskId}.json
-   ✅ PATCH /projects/api/v3/tasks/{taskId}.json
-   ✅ GET /projects/api/v3/tasks/{taskId}/subtasks.json
-   ✅ POST /projects/api/v3/tasks/{taskId}/subtasks.json
-   🟨 GET /projects/api/v3/reporting/precanned/plannedvsactual/tasks.csv
-   🟨 GET /projects/api/v3/reporting/precanned/plannedvsactual/tasks.html
-   🟨 GET /projects/api/v3/reporting/precanned/plannedvsactual/tasks.pdf
-   🟨 GET /projects/api/v3/reporting/precanned/plannedvsactual/tasks.xlsx

## TaskComments

-   ✅ GET /projects/api/v3/tasks/{taskId}/comments.json

## PeopleStatus

-   🟨 GET /projects/api/v3/statuses.json
-   🟨 GET /projects/api/v3/statuses/timeline.json
-   🟨 GET /projects/api/v3/teams/{teamId}/statuses/timeline.json

## Tags

-   🟨 GET /projects/api/v3/tags.json
-   🟨 POST /projects/api/v3/tags.json
-   🟨 POST /projects/api/v3/tags/bulk/delete.json
-   🟨 DELETE /projects/api/v3/tags/{tagId}.json
-   🟨 GET /projects/api/v3/tags/{tagId}.json
-   🟨 PATCH /projects/api/v3/tags/{tagId}.json

## Timesheets

-   🟨 GET /projects/api/v3/timesheets.json
-   🟨 GET /projects/api/v3/timesheets/totals.json

## TimeZone

-   ✅ GET /timezones.json

## Workload

-   🟨 GET /projects/api/v3/workload/planners.json

## MCP Implementation Issues

### 11/13/2025

-   ✅ Fixed calendar event date format issues and improved MCP tool descriptions
    -   Issue: Calendar events were experiencing 422 errors and unclear date format requirements
    -   Root cause: Typo in `getCalendarEvents.ts` using `startdate` instead of `startDate`, and insufficient clarity in tool descriptions
    -   Fixes applied:
        -   Fixed typo in `src/services/calendar/getCalendarEvents.ts` line 27: `startdate` → `startDate`
        -   Enhanced `getCalendarEvents` tool descriptions to explicitly state YYYYMMDD format requirement (e.g., '20251113')
        -   Enhanced `createCalendarEvent` tool descriptions to explicitly state ISO 8601 format (e.g., '2025-11-15T09:00')
        -   Enhanced `updateCalendarEvent` tool descriptions with same clarity improvements
        -   Added "IMPORTANT" labels to emphasize format requirements
        -   Added concrete examples with actual dates for clarity
    -   Verification: Rebuilt project successfully with `npm run build`
    -   Status: Calendar event operations now have clear format requirements in MCP tool definitions

-   ✅ Fixed updateNotebook HTTP method - Changed from PUT to PATCH to match Teamwork API v3 specification
    -   Issue: updateNotebook was returning 405 Method Not Allowed error
    -   Root cause: Service was using `api.put()` instead of `api.patch()`
    -   Fix: Updated `src/services/notebooks/updateNotebook.ts` line 66 from `api.put()` to `api.patch()`
    -   Verification: Rebuilt project successfully with `npm run build`
    -   Status: Notebook updates now work correctly

### 11/11/2025

-   ✅ Implemented Notification operations for the community TypeScript/Node.js server
    -   Created Notification model interfaces (Notification, NotificationsResponse, UnreadCountResponse)
    -   Created service implementations for getUnreadCount, getNotifications, and markNotificationAsRead
    -   Created MCP tool definitions for all notification operations
    -   Updated services/index.ts and tools/index.ts to register the new functionality
    -   Endpoints implemented:
        -   GET /projects/api/v3/notifications/unreadcount.json - Get unread notification count
        -   GET /projects/api/v3/notifications.json - Get notifications with optional filtering (unreadOnly, readOnly, limit, pageOffset)
        -   PATCH /projects/api/v3/notifications/{notificationId}.json - Update notification read status (mark as read or unread)
    -   Payload format uses `{ "notification": { "read": true/false } }` as per API specification
    -   markNotificationAsRead tool accepts optional `read` parameter (defaults to true) to support both marking as read and unread
    -   Successfully built with no TypeScript compilation errors

### 10/28/2025

-   ✅ Implemented Notebook operations for the community TypeScript/Node.js server
    -   Created service implementations for createNotebook, updateNotebook, deleteNotebook, getNotebook, and listNotebooks
    -   Created MCP tool definitions for all notebook operations
    -   Updated services/index.ts and tools/index.ts to register the new functionality
    -   Successfully tested list and get operations (create/update/delete require write permissions not available in test environment)
    -   Implementation follows the official Go implementation pattern from notebooks.go

### 10/27/2025

-   ✅ Fixed array parameter handling across multiple tools
    -   The Teamwork API requires array parameters to be formatted as comma-separated values
    -   Previously, axios was sending arrays in its default format (repeated parameters or bracket notation)
    -   Added conversion logic to transform all array parameters to comma-separated strings in:
        -   **getTasks**: tasklistIds, projectIds, tagIds, status arrays, and all fields[...] parameters
        -   **getPeople**: teamIds, projectIds, companyIds
        -   **getCompanies**: tagIds
    -   Fixes issues where filtering by arrays (e.g., multiple project IDs, task lists, or teams) was not working correctly
    -   This was a systematic bug affecting all GET endpoints that accept array parameters

### 04/13/2025

-   ✅ Implemented Timezone endpoint

    -   Added GET /timezones.json for retrieving all available timezones
    -   Useful for updating user timezones and seeing available options
    -   Added proper error handling and logging

-   ✅ Implemented Person Update endpoint

    -   Added PUT /people/{personId}.json for updating user information
    -   Added support for updating timezone, name, email, and other user properties
    -   Added proper error handling and validation

-   ✅ Implemented Company API endpoints
    -   Added GET /projects/api/v3/companies.json for listing all companies
    -   Added GET /projects/api/v3/companies/{companyId}.json for retrieving a specific company
    -   Added POST /projects/api/v3/companies.json for creating new companies
    -   Added PATCH /projects/api/v3/companies/{companyId}.json for updating existing companies
    -   Added DELETE /projects/api/v3/companies/{companyId}.json for deleting companies

### 04/11/2025

-   ✅ Updated the license file
-   ✅ Cleaned up the start up by removing all console logs (now it just logs to a file)

### 04/10/2025

-   ✅ Added the Create Comment Endpoint

### 03/27/2025

-   ✅ Implemented CreateComment endpoint
    -   Added service implementation for creating comments on resources (tasks, milestones, notebooks, links, fileversions)
    -   Added tool implementation following existing patterns
    -   Updated service and tool indexes to include the new functionality

### 03/26/2025

-   ✅ Fix build script in package.json to handle missing .env file gracefully in GitHub Actions

### 03/25/2025

-   ✅ Added GitHub Actions workflow for npm publishing
    -   Created npm-publish.yml workflow that triggers on release creation
    -   Configured workflow to build and publish package to npmjs.com
    -   Setup authentication using NPM_TOKEN secret

### 10/26/2025

-   ✅ Implemented getMe endpoint
    -   Added getMe service and tool (GET /me.json)
    -   Retrieves information about the currently logged-in user
    -   Provides user profile, permissions, and access details
    -   No parameters required - uses the API token to identify the user
    -   Following the same patterns as the official Teamwork MCP server implementation
-   ✅ Implemented Task List Management endpoints
    -   Added createTaskList service and tool (POST /projects/{projectId}/tasklists.json)
    -   Added updateTaskList service and tool (PUT /tasklists/{tasklistId}.json)
    -   Added deleteTaskList service and tool (DELETE /tasklists/{tasklistId}.json)
    -   Added getTaskList service and tool (GET /tasklists/{tasklistId}.json)
    -   Updated service and tool indexes to include the new functionality
    -   Task lists allow teams to organize tasks within projects into meaningful sections
    -   Task lists can be associated with milestones and support privacy settings
    -   Following the same patterns as the official Teamwork MCP server implementation

### 03/14/2025

-   ✅ GET /projects/api/v3/time.json - Implemented endpoint to get all time entries
-   ✅ GET /projects/api/v3/allocations/{allocationId}/time.json

## 03/10/2025

-   ✅ Implemented CreateSubTask endpoint
    -   Added service implementation for creating subtasks
    -   Added tool implementation following the same pattern as CreateTask
    -   Updated service and tool indexes to include the new functionality
-   ✅ Implemented People endpoints
    -   Added service implementations for getPeople, getPersonById, getProjectPeople, addPeopleToProject, and deletePerson
    -   Added tool implementations for all people services
    -   Updated service and tool indexes to include the new functionality
-   ✅ Implemented TaskComments endpoint
    -   Added service implementation for getting task comments
    -   Added tool implementation following the same pattern as other task-related tools
    -   Updated service and tool indexes to include the new functionality

### Task Creation and Updates

-   ✅ Fix updateTask functionality - Updated with Swagger-generated schema and improved error handling
-   🟨 Implement proper date handling for task creation and updates - Use `dueAt` format "YYYY-MM-DD" instead of full ISO timestamps
-   🟨 Add support for task status values - Need to determine valid status values (only "new" and "active" work; "complete", "completed", "done", and "in-progress" all fail). "Late" status causes a 500 server error, suggesting it might be a valid status but can't be set directly. Setting progress to 100% does not automatically change status.
-   🟨 Improve error handling for task creation and updates - Add more detailed error messages
-   ✅ Support for task assignees works with format: `{"assignees": {"userIds": [22717]}}`
-   🟨 Document the proper structure for task creation and updates in README.md

### MCP Server Enhancements

-   ✅ Add command-line arguments for Allow and Deny lists to control which tools are available
-   ✅ Enhance security by ensuring both tool listing and tool execution respect the allow/deny lists
-   ✅ Improve debugging and error handling throughout the MCP server
-   ✅ Added file logging for better troubleshooting
-   ✅ Enhanced API client with detailed request/response logging
-   ✅ Added more detailed error handling in tool handlers
-   ✅ Added test-connection script to verify Teamwork API connectivity
-   ✅ Fix JSON response validation issues
-   ✅ Added response validation and sanitization to ensure proper JSON formatting
-   ✅ Enhanced createTask handler with better error handling and response validation
-   ✅ Added comprehensive logging of response data for debugging
-   ✅ Fix MCP protocol communication issues
-   ✅ Removed all console logging to prevent interference with the MCP JSON protocol
-   ✅ Ensured all logging is directed to files only
-   ✅ Fixed startup errors in the inspector
-   ✅ Fix task creation validation
-   ✅ Fixed validation to check for the correct 'name' field instead of 'content'
-   ✅ Updated both the handler and service implementation to use consistent field names
-   ✅ Aligned validation with the TaskTask model definition

/**
 * Tools index file
 * Exports all tool definitions and implementations
 */

// Projects
import {
    getProjectsDefinition as getProjects,
    handleGetProjects,
} from "./projects/getProjects.js";
import {
    getCurrentProjectDefinition as getCurrentProject,
    handleGetCurrentProject,
} from "./projects/getCurrentProject.js";
import {
    createProjectDefinition as createProject,
    handleCreateProject,
} from "./projects/createProject.js";

// Tasks
import {
    getTasksDefinition as getTasks,
    handleGetTasks,
} from "./tasks/getTasks.js";
import {
    getTasksByProjectIdDefinition as getTasksByProjectId,
    handleGetTasksByProjectId,
} from "./tasks/getTasksByProjectId.js";
import {
    getTasksByTaskListIdDefinition as getTasksByTaskListId,
    handleGetTasksByTaskListId,
} from "./tasks/getTasksByTaskListId.js";
import {
    getTaskListsByProjectIdDefinition as getTaskListsByProjectId,
    handleGetTaskListsByProjectId,
} from "./tasks/getTaskListsByProjectId.js";
import {
    getTaskByIdDefinition as getTaskById,
    handleGetTaskById,
} from "./tasks/getTaskById.js";
import {
    createTaskDefinition as createTask,
    handleCreateTask,
} from "./tasks/createTask.js";
import {
    createSubTaskDefinition as createSubTask,
    handleCreateSubTask,
} from "./tasks/createSubTask.js";
import {
    updateTaskDefinition as updateTask,
    handleUpdateTask,
} from "./tasks/updateTask.js";
import {
    deleteTaskDefinition as deleteTask,
    handleDeleteTask,
} from "./tasks/deleteTask.js";
import {
    getTasksMetricsCompleteDefinition as getTasksMetricsComplete,
    handleGetTasksMetricsComplete,
} from "./tasks/getTasksMetricsComplete.js";
import {
    getTasksMetricsLateDefinition as getTasksMetricsLate,
    handleGetTasksMetricsLate,
} from "./tasks/getTasksMetricsLate.js";
import {
    getTaskSubtasksDefinition as getTaskSubtasks,
    handleGetTaskSubtasks,
} from "./tasks/getTaskSubtasks.js";
import {
    getTaskCommentsDefinition as getTaskComments,
    handleGetTaskComments,
} from "./tasks/getTaskComments.js";
import {
    createTaskListDefinition as createTaskList,
    handleCreateTaskList,
} from "./tasks/createTaskList.js";
import {
    updateTaskListDefinition as updateTaskList,
    handleUpdateTaskList,
} from "./tasks/updateTaskList.js";
import {
    deleteTaskListDefinition as deleteTaskList,
    handleDeleteTaskList,
} from "./tasks/deleteTaskList.js";
import {
    getTaskListDefinition as getTaskList,
    handleGetTaskList,
} from "./tasks/getTaskList.js";

// Comments
import {
    createCommentDefinition as createComment,
    handleCreateComment,
} from "./comments/createComment.js";

// People
import {
    getPeopleDefinition as getPeople,
    handleGetPeople,
} from "./people/getPeople.js";
import {
    getPersonByIdDefinition as getPersonById,
    handleGetPersonById,
} from "./people/getPersonById.js";
import {
    getProjectPeopleDefinition as getProjectPeople,
    handleGetProjectPeople,
} from "./people/getProjectPeople.js";
import {
    addPeopleToProjectDefinition as addPeopleToProject,
    handleAddPeopleToProject,
} from "./people/addPeopleToProject.js";
import {
    deletePersonDefinition as deletePerson,
    handleDeletePerson,
} from "./people/deletePerson.js";
import {
    updatePersonDefinition as updatePerson,
    handleUpdatePerson,
} from "./people/updatePerson.js";
import { getMeDefinition as getMe, handleGetMe } from "./people/getMe.js";

// Companies
import {
    createCompanyDefinition as createCompany,
    handleCreateCompany,
} from "./companies/createCompany.js";
import {
    updateCompanyDefinition as updateCompany,
    handleUpdateCompany,
} from "./companies/updateCompany.js";
import {
    deleteCompanyDefinition as deleteCompany,
    handleDeleteCompany,
} from "./companies/deleteCompany.js";
import {
    getCompaniesDefinition as getCompanies,
    handleGetCompanies,
} from "./companies/getCompanies.js";
import {
    getCompanyByIdDefinition as getCompanyById,
    handleGetCompanyById,
} from "./companies/getCompanyById.js";

// Reporting
import {
    getProjectsPeopleMetricsPerformanceDefinition as getProjectsPeopleMetricsPerformance,
    handleGetProjectsPeopleMetricsPerformance,
} from "./people/getPeopleMetricsPerformance.js";
import {
    getProjectsPeopleUtilizationDefinition as getProjectsPeopleUtilization,
    handleGetProjectsPeopleUtilization,
} from "./people/getPeopleUtilization.js";
import {
    getProjectPersonDefinition as getProjectPerson,
    handleGetProjectPerson,
} from "./people/getProjectPerson.js";
import {
    getProjectsReportingUserTaskCompletionDefinition as getProjectsReportingUserTaskCompletion,
    handleGetProjectsReportingUserTaskCompletion,
} from "./reporting/getUserTaskCompletion.js";
import {
    getProjectsReportingUtilizationDefinition as getProjectsReportingUtilization,
    handleGetProjectsReportingUtilization,
} from "./people/getUtilization.js";

// Time-related imports
import { getTimeDefinition as getTime, handleGetTime } from "./time/getTime.js";
import {
    getProjectsAllocationsTimeDefinition as getAllocationTime,
    handleGetProjectsAllocationsTime,
} from "./time/getAllocationTime.js";

// Core
import {
    getTimezonesDefinition as getTimezones,
    handleGetTimezones,
} from "./core/getTimezones.js";

// Calendar
import {
    getCalendarEventsDefinition as getCalendarEvents,
    handleGetCalendarEvents,
} from "./calendar/getCalendarEvents.js";
import {
    getCalendarEventByIdDefinition as getCalendarEventById,
    handleGetCalendarEventById,
} from "./calendar/getCalendarEventById.js";
import {
    createCalendarEventDefinition as createCalendarEvent,
    handleCreateCalendarEvent,
} from "./calendar/createCalendarEvent.js";
import {
    updateCalendarEventDefinition as updateCalendarEvent,
    handleUpdateCalendarEvent,
} from "./calendar/updateCalendarEvent.js";
import {
    deleteCalendarEventDefinition as deleteCalendarEvent,
    handleDeleteCalendarEvent,
} from "./calendar/deleteCalendarEvent.js";

// Notebooks
import {
    createNotebookDefinition as createNotebook,
    handleCreateNotebook,
} from "./notebooks/createNotebook.js";
import {
    updateNotebookDefinition as updateNotebook,
    handleUpdateNotebook,
} from "./notebooks/updateNotebook.js";
import {
    deleteNotebookDefinition as deleteNotebook,
    handleDeleteNotebook,
} from "./notebooks/deleteNotebook.js";
import {
    getNotebookDefinition as getNotebook,
    handleGetNotebook,
} from "./notebooks/getNotebook.js";
import {
    listNotebooksDefinition as listNotebooks,
    handleListNotebooks,
} from "./notebooks/listNotebooks.js";

// Define a structure that pairs tool definitions with their handlers
interface ToolPair {
    definition: any;
    handler: Function;
}

// Create an array of tool pairs
const toolPairs: ToolPair[] = [
    { definition: getProjects, handler: handleGetProjects },
    { definition: getCurrentProject, handler: handleGetCurrentProject },
    { definition: createProject, handler: handleCreateProject },
    { definition: getTasks, handler: handleGetTasks },
    { definition: getTasksByProjectId, handler: handleGetTasksByProjectId },
    {
        definition: getTaskListsByProjectId,
        handler: handleGetTaskListsByProjectId,
    },
    { definition: getTasksByTaskListId, handler: handleGetTasksByTaskListId },
    { definition: getTaskById, handler: handleGetTaskById },
    { definition: createTask, handler: handleCreateTask },
    { definition: createSubTask, handler: handleCreateSubTask },
    { definition: updateTask, handler: handleUpdateTask },
    { definition: deleteTask, handler: handleDeleteTask },
    {
        definition: getTasksMetricsComplete,
        handler: handleGetTasksMetricsComplete,
    },
    { definition: getTasksMetricsLate, handler: handleGetTasksMetricsLate },
    { definition: getTaskSubtasks, handler: handleGetTaskSubtasks },
    { definition: getTaskComments, handler: handleGetTaskComments },
    { definition: createTaskList, handler: handleCreateTaskList },
    { definition: updateTaskList, handler: handleUpdateTaskList },
    { definition: deleteTaskList, handler: handleDeleteTaskList },
    { definition: getTaskList, handler: handleGetTaskList },
    { definition: createComment, handler: handleCreateComment },
    { definition: getPeople, handler: handleGetPeople },
    { definition: getPersonById, handler: handleGetPersonById },
    { definition: getProjectPeople, handler: handleGetProjectPeople },
    { definition: addPeopleToProject, handler: handleAddPeopleToProject },
    { definition: deletePerson, handler: handleDeletePerson },
    { definition: updatePerson, handler: handleUpdatePerson },
    { definition: getMe, handler: handleGetMe },
    { definition: createCompany, handler: handleCreateCompany },
    { definition: updateCompany, handler: handleUpdateCompany },
    { definition: deleteCompany, handler: handleDeleteCompany },
    { definition: getCompanies, handler: handleGetCompanies },
    { definition: getCompanyById, handler: handleGetCompanyById },
    {
        definition: getProjectsPeopleMetricsPerformance,
        handler: handleGetProjectsPeopleMetricsPerformance,
    },
    {
        definition: getProjectsPeopleUtilization,
        handler: handleGetProjectsPeopleUtilization,
    },
    {
        definition: getAllocationTime,
        handler: handleGetProjectsAllocationsTime,
    },
    { definition: getTime, handler: handleGetTime },
    { definition: getProjectPerson, handler: handleGetProjectPerson },
    {
        definition: getProjectsReportingUserTaskCompletion,
        handler: handleGetProjectsReportingUserTaskCompletion,
    },
    {
        definition: getProjectsReportingUtilization,
        handler: handleGetProjectsReportingUtilization,
    },
    { definition: getTimezones, handler: handleGetTimezones },
    { definition: getCalendarEvents, handler: handleGetCalendarEvents },
    { definition: getCalendarEventById, handler: handleGetCalendarEventById },
    { definition: createCalendarEvent, handler: handleCreateCalendarEvent },
    { definition: updateCalendarEvent, handler: handleUpdateCalendarEvent },
    { definition: deleteCalendarEvent, handler: handleDeleteCalendarEvent },
    { definition: createNotebook, handler: handleCreateNotebook },
    { definition: updateNotebook, handler: handleUpdateNotebook },
    { definition: deleteNotebook, handler: handleDeleteNotebook },
    { definition: getNotebook, handler: handleGetNotebook },
    { definition: listNotebooks, handler: handleListNotebooks },
];

// Extract just the definitions for the toolDefinitions array
export const toolDefinitions = toolPairs.map((pair) => pair.definition);

// Create a map of tool names to their handler functions
export const toolHandlersMap: Record<string, Function> = toolPairs.reduce(
    (map, pair) => {
        map[pair.definition.name] = pair.handler;
        return map;
    },
    {} as Record<string, Function>
);

// Export all tool handlers
export { handleGetProjects } from "./projects/getProjects.js";
export { handleGetCurrentProject } from "./projects/getCurrentProject.js";
export { handleCreateProject } from "./projects/createProject.js";
export { handleGetTasks } from "./tasks/getTasks.js";
export { handleGetTasksByProjectId } from "./tasks/getTasksByProjectId.js";
export { handleGetTaskListsByProjectId } from "./tasks/getTaskListsByProjectId.js";
export { handleGetTaskById } from "./tasks/getTaskById.js";
export { handleGetTasksByTaskListId } from "./tasks/getTasksByTaskListId.js";
export { handleCreateTask } from "./tasks/createTask.js";
export { handleCreateSubTask } from "./tasks/createSubTask.js";
export { handleUpdateTask } from "./tasks/updateTask.js";
export { handleDeleteTask } from "./tasks/deleteTask.js";
export { handleGetTasksMetricsComplete } from "./tasks/getTasksMetricsComplete.js";
export { handleGetTasksMetricsLate } from "./tasks/getTasksMetricsLate.js";
export { handleGetTaskSubtasks } from "./tasks/getTaskSubtasks.js";
export { handleGetTaskComments } from "./tasks/getTaskComments.js";
export { handleCreateTaskList } from "./tasks/createTaskList.js";
export { handleUpdateTaskList } from "./tasks/updateTaskList.js";
export { handleDeleteTaskList } from "./tasks/deleteTaskList.js";
export { handleGetTaskList } from "./tasks/getTaskList.js";
export { handleCreateComment } from "./comments/createComment.js";
export { handleGetPeople } from "./people/getPeople.js";
export { handleGetPersonById } from "./people/getPersonById.js";
export { handleGetProjectPeople } from "./people/getProjectPeople.js";
export { handleAddPeopleToProject } from "./people/addPeopleToProject.js";
export { handleDeletePerson } from "./people/deletePerson.js";
export { handleUpdatePerson } from "./people/updatePerson.js";
export { handleGetMe } from "./people/getMe.js";
export { handleCreateCompany } from "./companies/createCompany.js";
export { handleUpdateCompany } from "./companies/updateCompany.js";
export { handleDeleteCompany } from "./companies/deleteCompany.js";
export { handleGetCompanies } from "./companies/getCompanies.js";
export { handleGetCompanyById } from "./companies/getCompanyById.js";
export { handleGetProjectsPeopleMetricsPerformance } from "./people/getPeopleMetricsPerformance.js";
export { handleGetProjectsPeopleUtilization } from "./people/getPeopleUtilization.js";
export { handleGetTime } from "./time/getTime.js";
export { handleGetProjectsAllocationsTime } from "./time/getAllocationTime.js";
export { handleGetProjectPerson } from "./people/getProjectPerson.js";
export { handleGetProjectsReportingUserTaskCompletion } from "./reporting/getUserTaskCompletion.js";
export { handleGetProjectsReportingUtilization } from "./people/getUtilization.js";
export { handleGetTimezones } from "./core/getTimezones.js";
export { handleGetCalendarEvents } from "./calendar/getCalendarEvents.js";
export { handleGetCalendarEventById } from "./calendar/getCalendarEventById.js";
export { handleCreateCalendarEvent } from "./calendar/createCalendarEvent.js";
export { handleUpdateCalendarEvent } from "./calendar/updateCalendarEvent.js";
export { handleDeleteCalendarEvent } from "./calendar/deleteCalendarEvent.js";
export { handleCreateNotebook } from "./notebooks/createNotebook.js";
export { handleUpdateNotebook } from "./notebooks/updateNotebook.js";
export { handleDeleteNotebook } from "./notebooks/deleteNotebook.js";
export { handleGetNotebook } from "./notebooks/getNotebook.js";
export { handleListNotebooks } from "./notebooks/listNotebooks.js";

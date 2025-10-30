# Teamwork MCP

[![npm version](https://img.shields.io/npm/v/@vizioz/teamwork-mcp.svg)](https://www.npmjs.com/package/@vizioz/teamwork-mcp) [![Verified on MseeP](https://mseep.ai/badge.svg)](https://mseep.ai/app/d18e81f9-f526-4751-841e-b57a0d70b5c0)

An MCP server that connects to the Teamwork API, providing a simplified interface for interacting with Teamwork projects and tasks.

## Features

-   Connect to Teamwork API
-   Retrieve projects and tasks
-   Create, update, and delete tasks
-   RESTful API endpoints
-   Error handling and logging
-   MCP server for integration with Cursor and other applications

## Prerequisites

-   Node.js (v14.17 or higher, recommend 18+ or even better latest LTS version)
-   npm or yarn
-   Teamwork account with API access

## Available Teamwork MCP Tools

The following tools are available through the MCP server:

### Project Tools

-   `getProjects` - Get all projects from Teamwork
-   `getCurrentProject` - Gets details about the current project
-   `createProject` - Create a new project in Teamwork

### Task Tools

-   `getTasks` - Get all tasks from Teamwork
-   `getTasksByProjectId` - Get all tasks from a specific project in Teamwork
-   `getTaskListsByProjectId` - Get all task lists from a specific project in Teamwork
-   `getTasksByTaskListId` - Gets all tasks from a specific task list ID from Teamwork
-   `getTaskById` - Get a specific task by ID from Teamwork
-   `createTask` - Create a new task in Teamwork
-   `createSubTask` - Create a new subtask under a parent task in Teamwork
-   `updateTask` - Update an existing task in Teamwork
-   `deleteTask` - Delete a task from Teamwork
-   `getTasksMetricsComplete` - Get the total count of completed tasks in Teamwork
-   `getTasksMetricsLate` - Get the total count of late tasks in Teamwork
-   `getTaskSubtasks` - Get all subtasks for a specific task in Teamwork
-   `getTaskComments` - Get comments for a specific task from Teamwork

### Comment Tools

-   `createComment` - Create a comment related to a task/message/notebook

### Company Tools

-   `getCompanies` - Get all companies from Teamwork with optional filtering
-   `getCompanyById` - Get a specific company by ID
-   `createCompany` - Create a new company in Teamwork
-   `updateCompany` - Update an existing company's information
-   `deleteCompany` - Delete a company from Teamwork

### People Tools

-   `getPeople` - Get all people from Teamwork
-   `getPersonById` - Get a specific person by ID from Teamwork
-   `getProjectPeople` - Get all people assigned to a specific project from Teamwork
-   `addPeopleToProject` - Add people to a specific project in Teamwork
-   `deletePerson` - Delete a person from Teamwork
-   `updatePerson` - Update a person's information (timezone, name, email, etc.)
-   `getProjectsPeopleMetricsPerformance` - Get people metrics performance
-   `getProjectsPeopleUtilization` - Get people utilization
-   `getProjectPerson` - Get a specific person on a project

### Reporting Tools

-   `getProjectsReportingUserTaskCompletion` - Get user task completion report
-   `getProjectsReportingUtilization` - Get utilization report in various formats CSV & HTML

### Time Tools

-   `getTime` - Get all time entries
-   `getProjectsAllocationsTime` - Get project allocations time
-   `getTimezones` - Get all available timezones in Teamwork (useful when updating user timezones)

### Calendar Tools

-   `getCalendarEvents` - Get calendar events from Teamwork within a specified date range
-   `getCalendarEventById` - Get a specific calendar event by ID
-   `createCalendarEvent` - Create a new calendar event (meeting, appointment, etc.)
-   `updateCalendarEvent` - Update an existing calendar event
-   `deleteCalendarEvent` - Delete a calendar event from Teamwork

## Installation

### Using NPX (Recommended)

The easiest way to use Teamwork MCP is with npx. This method doesn't require cloning the repository or building the code locally:

```bash
npx @vizioz/teamwork-mcp
```

You can also pass configuration options directly:

```bash
npx @vizioz/teamwork-mcp --domain=your-company --user=your-email@example.com --pass=your-password
```

### Using Docker

You can also run Teamwork MCP in a Docker container. This is useful for:

-   Consistent environments across different systems
-   Easy deployment to cloud platforms
-   Integration with Claude Desktop without installing Node.js

```bash
# Navigate to the community directory
cd servers/teamwork/community

# Build the Docker image
./docker-build.sh
# or manually: docker build -f Dockerfile.standalone -t teamwork-mcp:local .

# Run with your credentials
docker run -i --rm \
  -e TEAMWORK_DOMAIN=your-company \
  -e TEAMWORK_USERNAME=your-email@example.com \
  -e TEAMWORK_PASSWORD=your-password \
  -e DISABLE_LOGGING=true \
  teamwork-mcp:local
```

For detailed Docker setup instructions, including integration with Claude Desktop and Cursor, see [DOCKER_SETUP.md](DOCKER_SETUP.md).

## Configuration

### Setting Credentials

You can provide your Teamwork credentials in three ways:

1. **Environment Variables**: Set `TEAMWORK_DOMAIN`, `TEAMWORK_USERNAME`, and `TEAMWORK_PASSWORD` in your environment.

2. **.env File**: Create a `.env` file with the required variables:

    ```
    TEAMWORK_DOMAIN=your-company
    TEAMWORK_USERNAME=your-email@example.com
    TEAMWORK_PASSWORD=your-password
    ```

3. **Command Line Arguments**: Pass credentials when running the application:

    ```bash
    npx @vizioz/teamwork-mcp --teamwork-domain=your-company --teamwork-username=your-email@example.com --teamwork-password=your-password
    ```

    Or using short form:

    ```bash
    npx @vizioz/teamwork-mcp --domain=your-company --user=your-email@example.com --pass=your-password
    ```

### Logging Configuration

By default, the Teamwork MCP server creates log files in a `logs` directory to help with debugging and monitoring. You can disable logging completely using the following methods:

1. **Command Line Arguments**:

    ```bash
    npx @vizioz/teamwork-mcp --disable-logging
    ```

    Or using the alternative form:

    ```bash
    npx @vizioz/teamwork-mcp --no-logging
    ```

2. **Environment Variable**:

    ```bash
    DISABLE_LOGGING=true npx @vizioz/teamwork-mcp
    ```

When logging is enabled, the server creates two log files in the `logs` directory:

-   `error.log` - Contains only error-level messages
-   `combined.log` - Contains all log messages (info, warnings, errors)

Each log file includes a header with instructions on how to disable logging if needed.

### Tool Filtering

You can control which tools are available to the MCP server using the following command-line arguments:

1. **Allow List**: Only expose specific tools:

    ```bash
    npx @vizioz/teamwork-mcp --allow-tools=getProjects,getTasks,getTaskById
    ```

    Or using short form:

    ```bash
    npx @vizioz/teamwork-mcp --allow=getProjects,getTasks,getTaskById
    ```

2. **Deny List**: Expose all tools except those specified:

    ```bash
    npx @vizioz/teamwork-mcp --deny-tools=deleteTask,updateTask
    ```

    Or using short form:

    ```bash
    npx @vizioz/teamwork-mcp --deny=deleteTask,updateTask
    ```

### Tool Filtering with Groups

You can now specify groups of tools for filtering, allowing for more flexible control over which tools are available to the MCP server. The available groups are:

-   **Projects**: Includes all project-related tools.
-   **Tasks**: Includes all task-related tools.
-   **People**: Includes all people-related tools.
-   **Reporting**: Includes all reporting-related tools.
-   **Time**: Includes all time-related tools.
-   **Comments**: Includes specific comment tools.

### Using Groups in Tool Filtering

You can specify these groups in the allow or deny lists to include or exclude all tools within a group. For example:

1. **Allow List with Groups**: Only expose specific groups of tools:

    ```bash
    npx @vizioz/teamwork-mcp --allow-tools=Tasks,People
    ```

    Or using short form:

    ```bash
    npx @vizioz/teamwork-mcp --allow=Tasks,People
    ```

2. **Deny List with Groups**: Expose all tools except those in specified groups:

    ```bash
    npx @vizioz/teamwork-mcp --deny-tools=Reporting,Time
    ```

    Or using short form:

    ```bash
    npx @vizioz/teamwork-mcp --deny=Reporting,Time
    ```

By default, all tools are exposed if neither allow nor deny list is provided. If both are provided, the allow list takes precedence.

The tool filtering is enforced at two levels for enhanced security:

1. When listing available tools (tools not in the allow list or in the deny list won't be visible)
2. When executing tool calls (attempts to call filtered tools will be rejected with an error)

## Setting Up Your Teamwork Project

To associate your current solution with a Teamwork project, you can use the following method:

### Using a Configuration File

You can create a `.teamwork` file in the root of your project with the following structure:

```
PROJECT_ID = YourTeamworkProjectID
```

This simple configuration file associates your solution with a specific Teamwork project, we may use it to store more details in the future.

Once configured, the MCP will be able to find your Teamwork project and associate it with your current solution, reducing the number of API calls needed to get the project and tasks related to the solution you are working on.

## Adding to MCP Clients

### Cursor

To add this MCP server to Cursor:

#### Versions before 0.47

1. Open Cursor Settings > Features > MCP
2. Click "+ Add New MCP Server"
3. Enter a name for the server (e.g., "Teamwork API")
4. Select "stdio" as the transport type
5. Enter the command to run the server: `npx @vizioz/teamwork-mcp` and add the credentials and domain command line arguments as mentioned above.
    - You can include tool filtering options: `--allow=getProjects,getTasks` or `--deny=deleteTask`
6. Click "Add"

#### Versions after 0.47 (editing the config manually)

```json
"Teamwork": {
  "command": "npx",
  "args": [
    "-y",
    "@vizioz/teamwork-mcp",
    "--domain",
    "yourdomain",
    "--user",
    "youruser@yourdomain.com",
    "--pass",
    "yourPassword"
  ]
}
```

To disable logging in Cursor, add the `--disable-logging` argument:

```json
"Teamwork": {
  "command": "npx",
  "args": [
    "-y",
    "@vizioz/teamwork-mcp",
    "--domain",
    "yourdomain",
    "--user",
    "youruser@yourdomain.com",
    "--pass",
    "yourPassword",
    "--disable-logging"
  ]
}
```

If you want to add the allow or deny arguments mentioned above you just add them like this, you can add any of the examples given above, you can also add both groups and individual tools as shown below:

```json
"Teamwork": {
  "command": "npx",
  "args": [
    "-y",
    "@vizioz/teamwork-mcp",
    "--domain",
    "yourdomain",
    "--user",
    "youruser@yourdomain.com",
    "--pass",
    "yourPassword",
    "--allow",
    "Tasks,Projects",
    "--deny",
    "getProjectsPeopleMetricsPerformance,getProjectsPeopleUtilization"
  ]
}
```

The Teamwork MCP tools will now be available to the Cursor Agent in Composer.

### Claude Desktop

To add this MCP server to Claude Desktop, edit your Claude Desktop configuration file:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

Add the following configuration:

```json
{
    "mcpServers": {
        "teamwork": {
            "command": "npx",
            "args": [
                "-y",
                "@vizioz/teamwork-mcp",
                "--domain",
                "yourdomain",
                "--user",
                "youruser@yourdomain.com",
                "--pass",
                "yourPassword"
            ]
        }
    }
}
```

### Windsurf

To add this MCP server to Windsurf, follow similar steps to Cursor by adding the MCP server configuration with the npx command and your credentials.

## Building from Source

_Note: You only need to follow these instructions if you plan to contribute to the project or submit a pull request. For regular usage, use the NPX installation method above._

### Local Development Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/readingdancer/teamwork-mcp.git
    cd teamwork-mcp
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file based on the `.env.example` file:

    ```bash
    cp .env.example .env
    ```

4. Update the `.env` file with your Teamwork credentials:

    ```
    PORT=3000
    NODE_ENV=development
    LOG_LEVEL=info
    TEAMWORK_DOMAIN=your-company
    TEAMWORK_USERNAME=your-email@example.com
    TEAMWORK_PASSWORD=your-password
    ```

### Building the Application

Build the application:

```bash
npm run build
```

This will compile the TypeScript code ready to be used as an MCP Server.

### Running as an MCP Server (Local Build)

To run as an MCP server for integration with Cursor and other applications, if you are using the .env file for your username, password & url, or if you have saved them in environment variables:

_NOTE: Don't forget to change the drive and path details based on where you have saved the repository._

```bash
node C:/your-full-path/build/index.js
```

Or you can pass them using line arguments:

```bash
node C:/your-full-path/build/index.js --teamwork-domain=your-company --teamwork-username=your-email@example.com --teamwork-password=your-password
```

You can also use the short form:

```bash
node C:/your-full-path/build/index.js --domain=your-company --user=your-email@example.com --pass=your-password
```

### Using the MCP Inspector

To run the MCP inspector for debugging:

```bash
npm run inspector
```

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/Vizioz/Teamwork-MCP?tab=MIT-1-ov-file#readme) file for details.

## Disclaimer

This project is not affiliated with, endorsed by, or sponsored by Teamwork.com. The use of the name "Teamwork" in the package name (@vizioz/teamwork-mcp) is solely for descriptive purposes to indicate compatibility with the Teamwork.com API.

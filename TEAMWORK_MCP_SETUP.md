# Teamwork MCP Server Setup for Windsurf

## Overview

This guide will help you set up the **official Teamwork.com MCP server** (hosted) in Windsurf IDE. The server includes full notebook support with create, read, update, delete, and list operations.

## Step 1: Choose Your Authentication Method

You have **two options** for authentication:

### Option A: Personal API Key (Recommended) ⭐

1. Log into your Teamwork account
2. Go to your profile → **Edit My Details** → **API & Mobile**
3. Copy your **API Key**
4. Encode it with: `echo -n "YOUR_API_KEY:xxx" | base64`
5. Use the encoded value in the configuration below

**See `AUTH_GUIDE.md` for detailed instructions.**

### Option B: Bearer Token (OAuth2)

Run this command to get a bearer token:

```bash
npx @teamwork/get-bearer-token
```

This will guide you through an interactive process to authenticate and retrieve your token.

## Step 2: Configure Windsurf MCP

### Option A: Using Windsurf UI (Recommended)

1. Open Windsurf
2. Click on the **Plugins** icon in the top right menu in the Cascade panel
3. Or go to **Windsurf Settings** > **Cascade** > **Plugins**
4. Click **Add Custom Server +**
5. Use one of these configurations:

**For API Key (Basic Auth):**

```json
{
  "mcpServers": {
    "teamwork": {
      "serverUrl": "https://mcp.ai.teamwork.com",
      "headers": {
        "Authorization": "Basic <BASE64_ENCODED_API_KEY>"
      }
    }
  }
}
```

**For Bearer Token (OAuth2):**

```json
{
  "mcpServers": {
    "teamwork": {
      "serverUrl": "https://mcp.ai.teamwork.com",
      "headers": {
        "Authorization": "Bearer <YOUR_TEAMWORK_BEARER_TOKEN>"
      }
    }
  }
}
```

6. Replace the placeholder with your actual credentials from Step 1
7. Click **Save** and **Refresh**

### Option B: Manual Configuration

1. Create or edit the file: `~/.codeium/windsurf/mcp_config.json`
2. Copy the contents from `teamwork-mcp-config.json` in this directory
3. Replace `<YOUR_TEAMWORK_BEARER_TOKEN>` with your actual token
4. Restart Windsurf

## Step 3: Verify Installation

1. Open the Cascade panel in Windsurf
2. Toggle from **Write** to **Chat** mode (small toggle at bottom of input)
3. Click the **hammer icon** 🔨
4. You should see "Teamwork" in the list of MCP servers with a green dot
5. The tool count should show the available Teamwork tools

## Available Notebook Tools

Once configured, you'll have access to these notebook tools:

- **`twprojects-create_notebook`** - Create new notebooks (MARKDOWN or HTML)
- **`twprojects-update_notebook`** - Update existing notebooks
- **`twprojects-delete_notebook`** - Delete notebooks
- **`twprojects-get_notebook`** - Get a specific notebook by ID
- **`twprojects-list_notebooks`** - List notebooks with filtering options

### Additional Tools Available

The Teamwork MCP server also provides tools for:

- Projects (create, read, update, delete, list)
- Tasks and Task Lists
- Users and Teams
- Companies
- Milestones
- Tags
- Comments
- Time Logs and Timers
- Activities
- Workload

## Example Usage

### Create a Notebook

Ask Cascade:

```
Create a notebook in project 12345 called "Meeting Notes" with markdown content
```

### List Notebooks

Ask Cascade:

```
Show me all notebooks in project 12345
```

### Update a Notebook

Ask Cascade:

```
Update notebook 789 with new content: "Updated meeting notes..."
```

## Troubleshooting

### MCP Server Not Showing Up

- Make sure you clicked the **Refresh** button after adding the configuration
- Restart Windsurf
- Check that your bearer token is valid

### Authentication Errors

- Your bearer token may have expired - regenerate it using `npx @teamwork/get-bearer-token`
- Ensure the token is correctly formatted in the configuration (no extra spaces)

### Tool Limit

- Windsurf has a limit of 100 total tools across all MCP servers
- You can disable tools you don't need in the plugin settings

## Security Notes

- ✅ Your bearer token authenticates you as the end user
- ✅ The hosted server is officially maintained by Teamwork.com
- ✅ Your token is stored locally in your Windsurf configuration
- ⚠️ Never commit your `mcp_config.json` file with tokens to version control
- ⚠️ Treat your bearer token like a password

## Additional Resources

- [Official Teamwork MCP Repository](https://github.com/Teamwork/mcp)
- [Teamwork API Documentation](https://apidocs.teamwork.com/)
- [Windsurf MCP Documentation](https://docs.windsurf.com/windsurf/cascade/mcp)
- [Model Context Protocol](https://modelcontextprotocol.io/)

## Support

If you encounter issues:

1. Check the Windsurf logs: Help > Show Logs
2. Visit [Teamwork Support](https://support.teamwork.com/)
3. Check the [GitHub Issues](https://github.com/Teamwork/mcp/issues)

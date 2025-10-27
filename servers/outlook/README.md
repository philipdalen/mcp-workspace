# Microsoft Outlook MCP Server

This directory contains MCP (Model Context Protocol) servers for integrating with Microsoft Outlook.

## Available Implementations

### Community

#### Simply Outlook MCP Server

- **Location**: `community/simply-outlook-mcp/`
- **Repository**: [hmmroger/simply-outlook-mcp](https://github.com/hmmroger/simply-outlook-mcp)
- **Language**: TypeScript/Node.js
- **Last Updated**: ~21 days ago (as of setup)
- **Status**: ✅ Active and maintained

**Features:**

- 📅 Calendar Management (get, create, update events)
- 📧 Email Operations (read, send, search, reply)
- 🔐 OAuth 2.0 Authentication via Azure AD
- ⚙️ Selective tool enable/disable
- 📦 Available on npm as `simply-outlook-mcp`

**Limitations:**

- ❌ No task management (Microsoft To Do)
- ❌ No contact management
- ❌ Limited attachment support
- ❌ No email rules/folder management

## Setup

See the comprehensive setup guide: [/docs/OUTLOOK_MCP_SETUP.md](../../docs/OUTLOOK_MCP_SETUP.md)

### Quick Start

1. **Set up Azure AD Application** (one-time):

   - Go to [Azure Portal](https://portal.azure.com/)
   - Create an App Registration
   - Enable device code flow
   - Copy the Client ID

2. **Authenticate**:

   ```bash
   cd community/simply-outlook-mcp
   npx simply-outlook-mcp --auth --client_id YOUR_CLIENT_ID
   ```

3. **Configure in `~/.cursor/mcp.json`**:

   ```json
   {
     "mcpServers": {
       "outlook": {
         "command": "node",
         "args": [
           "/Users/philip.dalen/repos/mcp/servers/outlook/community/simply-outlook-mcp/dist/index.js"
         ],
         "env": {
           "SIMPLY_OUTLOOK_MCP_CLIENT_ID": "YOUR_CLIENT_ID"
         }
       }
     }
   }
   ```

4. **Restart Cursor** to load the new server

## Alternative Installation

You can also use npx directly without cloning:

```json
{
  "mcpServers": {
    "outlook": {
      "command": "npx",
      "args": ["-y", "simply-outlook-mcp"],
      "env": {
        "SIMPLY_OUTLOOK_MCP_CLIENT_ID": "YOUR_CLIENT_ID"
      }
    }
  }
}
```

## Available Tools

Once configured, these tools are available to your AI assistant:

### Calendar Tools

- `get-calendar-events` - Retrieve events within date ranges
- `create-calendar-event` - Create personal events
- `create-calendar-event-with-invite` - Create events with attendees
- `update-calendar-event` - Modify existing events

### Email Tools

- `get-outlook-messages` - Fetch recent messages
- `get-outlook-message-content` - Get full message content
- `search-outlook-messages` - Search by keywords
- `send-outlook-message` - Send new emails
- `reply-outlook-message` - Reply to messages

## Directory Structure

```
outlook/
├── README.md (this file)
└── community/
    └── simply-outlook-mcp/
        ├── src/             # TypeScript source code
        ├── dist/            # Compiled JavaScript
        ├── package.json
        ├── tsconfig.json
        └── README.md        # Original project README
```

## Task Management

If you need Outlook task management or Microsoft To Do integration, this server does not provide it. You would need to:

1. Find a dedicated Microsoft To Do MCP server
2. Extend this server yourself
3. Use Teamwork or another task management integration instead

## Security Notes

### Why Create Your Own Azure AD App?

We **strongly recommend** creating your own Azure AD application registration rather than using a third-party client ID because:

- You control the app settings
- No one else can modify permissions
- Better security and privacy
- Complete trust in what's being requested

### Token Storage

Authentication tokens are stored securely on your local machine:

- **macOS**: Keychain
- **Windows**: Windows Credential Manager
- **Linux**: Encrypted file in `~/.msal-cache`

## Troubleshooting

### Common Issues

1. **Authentication fails**: Re-run the auth command and check client ID
2. **Server not responding**: Verify paths in `mcp.json`
3. **Permission errors**: Re-authenticate or check Azure AD settings

See the full troubleshooting guide in [OUTLOOK_MCP_SETUP.md](../../docs/OUTLOOK_MCP_SETUP.md).

## References

- [Microsoft Graph API Documentation](https://learn.microsoft.com/en-us/graph/overview)
- [Azure AD App Registration](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Simply Outlook MCP GitHub](https://github.com/hmmroger/simply-outlook-mcp)



# Microsoft Outlook MCP Server Setup Guide

This guide will help you set up the Simply Outlook MCP Server to integrate Microsoft Outlook with your AI assistant.

## Overview

The Simply Outlook MCP Server enables AI assistants to:

- 📅 Manage calendar events (create, read, update)
- 📧 Read and send emails
- 🔍 Search messages
- 📬 Reply to emails

**Note:** This server does NOT support Outlook task management. For task management, you would need a separate Microsoft To Do MCP integration.

## Prerequisites

- Node.js 20.19.0 or higher
- A Microsoft account (personal or work/school)
- Azure AD Application registration (we'll create this)

## Step 1: Azure AD Application Registration

You need to register an application in Azure AD to get a client ID. This allows the MCP server to authenticate and access your Outlook data securely.

### 1.1 Create the Application

1. Go to the [Azure Portal](https://portal.azure.com/)
2. Navigate to **Microsoft Entra ID** (formerly Azure Active Directory)
3. Click **Manage** → **App registrations** in the left sidebar
4. Click **+ New registration** at the top

### 1.2 Configure the Registration

Fill in the registration form:

- **Name**: Enter a descriptive name (e.g., "Simply Outlook MCP Server" or "My AI Outlook Integration")
- **Supported account types**: Select `Accounts in any organizational directory (Any Microsoft Entra ID tenant - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)`
- **Redirect URI**: Leave blank (we don't need this)

Click **Register**.

### 1.3 Note Your Client ID

After registration:

1. You'll be redirected to the application's Overview page
2. Copy the **Application (client) ID** - you'll need this later
3. Keep this somewhere safe (e.g., password manager)

### 1.4 Enable Device Code Flow

1. In your application's page, go to **Manage** → **Authentication**
2. Scroll down to **Advanced settings** section
3. Find **Allow public client flows**
4. Toggle **Enable the following mobile and desktop flows** to **Yes**
5. Click **Save** at the top

## Step 2: Required API Permissions

The application automatically requests these permissions during authentication:

- `Calendars.ReadWrite` - Read and write calendar events
- `Mail.Read` - Read email messages
- `Mail.Send` - Send email messages
- `User.Read` - Read user profile information

You don't need to manually configure these in Azure - they'll be requested when you authenticate.

## Step 3: Authentication

Once you have your Client ID, authenticate the MCP server:

```bash
cd /Users/philip.dalen/repos/mcp/servers/outlook/community/simply-outlook-mcp
npx simply-outlook-mcp --auth --client_id YOUR_CLIENT_ID
```

Replace `YOUR_CLIENT_ID` with the Application (client) ID from Step 1.3.

This will:

1. Open a device code authentication flow
2. Provide you with a code and URL
3. You'll visit the URL in your browser
4. Enter the code and sign in with your Microsoft account
5. Grant the requested permissions
6. The tokens will be securely stored on your local machine

## Step 4: Configure MCP Server

Update your MCP configuration file at `~/.cursor/mcp.json`:

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

### Optional Configuration

You can disable specific tools by adding them to `SIMPLY_OUTLOOK_MCP_DISABLED_TOOLS`:

```json
{
  "mcpServers": {
    "outlook": {
      "command": "node",
      "args": [
        "/Users/philip.dalen/repos/mcp/servers/outlook/community/simply-outlook-mcp/dist/index.js"
      ],
      "env": {
        "SIMPLY_OUTLOOK_MCP_CLIENT_ID": "YOUR_CLIENT_ID",
        "SIMPLY_OUTLOOK_MCP_DISABLED_TOOLS": "send-outlook-message,reply-outlook-message"
      }
    }
  }
}
```

**Available Tool Names:**

- **Calendar Tools:**
  - `get-calendar-events`
  - `create-calendar-event`
  - `create-calendar-event-with-invite`
  - `update-calendar-event`
- **Email Tools:**
  - `get-outlook-messages`
  - `get-outlook-message-content`
  - `search-outlook-messages`
  - `send-outlook-message`
  - `reply-outlook-message`

## Step 5: Test the Integration

1. Restart Cursor to load the new MCP server configuration
2. Try asking your AI assistant:
   - "Show me my calendar events for today"
   - "What are my recent emails?"
   - "Send an email to [recipient] with subject [subject]"

## Security Best Practices

### Why Create Your Own Azure AD Application?

**We strongly recommend creating your own Azure AD application** rather than using a client ID from a third party. Here's why:

- **Control**: You own the app registration and control all settings
- **Security**: No one else can modify the app's permissions or branding
- **Trust**: You know exactly what permissions are being requested
- **Privacy**: Your tokens are only associated with your own app registration

### What Could Go Wrong with a Third-Party Client ID?

If you use someone else's client ID, they could later:

- Change the display name/branding in consent prompts
- Request additional permissions
- Enable authentication flows that could phish your tokens
- Verify/unverify the publisher domain

**Remember**: The client ID only identifies _which_ app registration to use. Your access tokens stay on your local machine, but using a third-party client ID means accepting risks tied to their app registration.

## Troubleshooting

### Authentication Fails

1. Verify your Client ID is correct
2. Ensure device code flow is enabled in Azure AD
3. Check that you're signing in with the correct Microsoft account
4. Try re-authenticating:
   ```bash
   npx simply-outlook-mcp --auth --client_id YOUR_CLIENT_ID
   ```

### MCP Server Not Responding

1. Check the MCP server is configured correctly in `mcp.json`
2. Verify the path to `dist/index.js` is correct
3. Ensure the build was successful (`npm run build`)
4. Check Cursor's MCP logs for error messages

### Permission Errors

If you get permission errors:

1. Re-authenticate to grant necessary permissions
2. Verify your Microsoft account has access to the Outlook data
3. For work/school accounts, check with your IT admin about permission policies

## Architecture

### How It Works

```
┌─────────────────┐
│   AI Assistant  │
│   (Cursor)      │
└────────┬────────┘
         │
         │ MCP Protocol
         │
┌────────▼────────────────────┐
│  Simply Outlook MCP Server  │
│  (Local Node.js Process)    │
└────────┬────────────────────┘
         │
         │ OAuth 2.0 + Microsoft Graph API
         │
┌────────▼────────────────────┐
│  Microsoft Graph API        │
│  (cloud.microsoft.com)      │
└────────┬────────────────────┘
         │
         │
┌────────▼────────────────────┐
│  Your Outlook Data          │
│  (Email, Calendar, Profile) │
└─────────────────────────────┘
```

### Token Storage

Authentication tokens are stored locally on your machine using Azure Identity's secure token cache. The tokens are encrypted and stored in:

- **macOS**: Keychain
- **Windows**: Windows Credential Manager
- **Linux**: Encrypted file in `~/.msal-cache`

## Available MCP Tools

Once configured, the AI assistant can use these tools:

### Calendar Tools

1. **get-calendar-events** - Retrieve calendar events within date ranges
2. **create-calendar-event** - Create personal calendar events
3. **create-calendar-event-with-invite** - Create events and invite attendees
4. **update-calendar-event** - Modify existing events

### Email Tools

1. **get-outlook-messages** - Fetch recent messages with filtering
2. **get-outlook-message-content** - Get full content of specific messages
3. **search-outlook-messages** - Search by keywords (sender, subject, content)
4. **send-outlook-message** - Send new emails
5. **reply-outlook-message** - Reply to existing messages

## Alternative Installation Methods

### Using npx (No Local Clone)

Instead of cloning the repository, you can use npx directly in your `mcp.json`:

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

This will automatically download and run the latest published version from npm.

## Limitations

- **No Task Management**: This MCP server does not support Microsoft To Do or Outlook Tasks
- **No Contacts**: Contact management is not currently supported
- **No Attachments**: Email attachment handling is limited
- **No Rules/Folders**: Cannot create email rules or manage folder structure

For task management, you would need to integrate a separate Microsoft To Do MCP server (if available) or extend this server yourself.

## Repository Information

- **GitHub**: [hmmroger/simply-outlook-mcp](https://github.com/hmmroger/simply-outlook-mcp)
- **npm**: [simply-outlook-mcp](https://www.npmjs.com/package/simply-outlook-mcp)
- **License**: MIT
- **Issues**: [Report bugs or request features](https://github.com/hmmroger/simply-outlook-mcp/issues)

## Additional Resources

- [Microsoft Graph API Documentation](https://learn.microsoft.com/en-us/graph/overview)
- [Azure AD App Registration Guide](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)

## Support

If you encounter issues:

1. Check this documentation thoroughly
2. Review the [GitHub Issues](https://github.com/hmmroger/simply-outlook-mcp/issues)
3. Create a new issue with details about your problem
4. For Azure AD issues, consult [Microsoft's documentation](https://learn.microsoft.com/en-us/entra/)

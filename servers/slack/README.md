# Slack MCP Server

Get AI assistants like Claude to interact with your Slack workspace! This powerful MCP server enables reading messages, searching conversations, and managing channels through the Model Context Protocol.

## 🚀 Quick Start (5 Minutes)

### 1. Build the Server

```bash
cd community/slack-mcp-server
make build
```

The binary will be at: `community/slack-mcp-server/build/slack-mcp-server`

### 2. Get Your Slack Tokens (2 Minutes)

Open Slack in your browser (https://app.slack.com) and press **F12** for Developer Tools:

**Step 1: Get XOXC Token**
- Go to **Console** tab
- Paste and run:
```javascript
let config = JSON.parse(localStorage.getItem("localConfig_v2"));
let team = Object.values(config.teams)[0];
console.log("SLACK_MCP_XOXC_TOKEN:", team.token);
```
- Copy the `xoxc-...` token

**Step 2: Get XOXD Cookie**
- Go to **Application** tab → **Cookies** → Your workspace URL
- Find cookie named **`d`**
- Copy the entire value (starts with `xoxd-`)

### 3. Configure Your MCP Client

**For Claude Desktop** - Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "slack": {
      "command": "/absolute/path/to/slack-mcp-server/build/slack-mcp-server",
      "args": ["-transport", "stdio"],
      "env": {
        "SLACK_MCP_XOXC_TOKEN": "xoxc-your-token-here",
        "SLACK_MCP_XOXD_TOKEN": "xoxd-your-token-here",
        "SLACK_MCP_LOG_LEVEL": "info"
      }
    }
  }
}
```

**For Cursor** - Edit `~/.cursor/mcp.json` with the same structure.

### 4. Start Using It!

Restart your MCP client and try:
- "List my Slack channels"
- "Show me recent messages from #general"
- "Search for messages about 'project update'"

**Need help?** See the [Complete Setup Guide](SETUP.md) for detailed instructions, troubleshooting, and advanced configuration.

---

## Overview

This directory contains a production-ready Slack MCP server implementation.

### Community Implementation: Korotovsky's Slack MCP Server

**Location**: `community/slack-mcp-server/`

The most powerful and feature-rich Slack MCP server available, developed by [korotovsky](https://github.com/korotovsky/slack-mcp-server).

**Key Features:**
- ✅ **Stealth & OAuth Modes** - No admin permissions or bot installations required
- ✅ **Enterprise Slack Support** - Works with Enterprise Slack setups
- ✅ **Smart History Fetching** - Pagination by date (1d, 7d, 1m) or message count
- ✅ **Advanced Search** - Search messages with filters (date, user, content)
- ✅ **Channel & Thread Support** - Fetch messages from channels and threads using `#name` or `@lookup`
- ✅ **DM & Group DM Support** - Direct messages and group conversations
- ✅ **User Context Embedding** - Enriched messages with user information
- ✅ **Performance Caching** - Cache users and channels for faster access
- ✅ **Multiple Transports** - Stdio, SSE, and HTTP transports
- ✅ **Proxy Support** - Route requests through a proxy

**Technology**: Go-based (compiled binary)

**Build Status**: ✅ Built and tested successfully

## What You Can Do

✅ Read messages from any channel  
✅ Search messages with advanced filters  
✅ List all channels and DMs  
✅ Read thread conversations  
✅ Get user information  
✅ Access channel history  
✅ Send messages (optional, disabled by default)

## Available Tools

The server provides these MCP tools:

- **`channels_list`** - List all channels, DMs, and group conversations
- **`conversations_history`** - Get messages from channels with smart pagination
- **`conversations_replies`** - Read thread messages
- **`conversations_search_messages`** - Advanced search with date, user, and content filters
- **`conversations_add_message`** - Send messages (disabled by default for safety)

### Resources

- `slack://<workspace>/channels` - CSV directory of all channels
- `slack://<workspace>/users` - CSV directory of all users

## Documentation

- **[Complete Setup Guide](SETUP.md)** - Detailed installation, authentication, configuration, and troubleshooting
- [Authentication Setup](community/slack-mcp-server/docs/01-authentication-setup.md) - Advanced auth methods
- [Configuration & Usage](community/slack-mcp-server/docs/03-configuration-and-usage.md) - Advanced configuration options

## Security

🔒 **Never share or commit your tokens!** They provide full access to your Slack workspace.

- Store tokens in environment variables or secure vaults
- Browser tokens expire when you log out - re-extract as needed
- Message posting is disabled by default for safety
- Regularly rotate tokens for production use

## Links

- [GitHub Repository](https://github.com/korotovsky/slack-mcp-server)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Slack API Documentation](https://api.slack.com/)

---

**Technology:** Go 1.24.4 | **License:** MIT | **Status:** Production-ready ✅

**Note:** The official Anthropic Slack MCP server has been deprecated due to security vulnerabilities. This community implementation is the recommended alternative.


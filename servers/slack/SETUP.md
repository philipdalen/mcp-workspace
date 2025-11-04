# Slack MCP Server Setup Guide

This guide will walk you through setting up the Slack MCP server in your environment.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Authentication Setup](#authentication-setup)
4. [Configuration](#configuration)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

- **Go 1.24.4 or higher** - Required to build the server
- **Slack Workspace Access** - You need to be a member of the Slack workspace you want to interact with
- **MCP Client** - Claude Desktop, Cursor, or another MCP-compatible client

## Installation

### Step 1: Build the Server

```bash
cd servers/slack/community/slack-mcp-server

# Download dependencies
make deps

# Build the binary
make build

# Verify the build
ls -lh ./build/slack-mcp-server
```

The binary will be located at: `build/slack-mcp-server`

### Step 2: Verify Installation

```bash
./build/slack-mcp-server --help
```

You should see output showing the available transport options (stdio, sse, http).

## Authentication Setup

You have two authentication options:

### Option 1: Browser Tokens (Stealth Mode) - Recommended

This method requires extracting tokens from your browser session. It doesn't require any bot installations or admin approvals.

**Required Tokens:**
- `SLACK_MCP_XOXC_TOKEN` - Slack browser token (starts with `xoxc-`)
- `SLACK_MCP_XOXD_TOKEN` - Slack browser cookie (starts with `xoxd-`)

**How to Extract Tokens:**

#### Recommended: Hybrid Approach ⭐

This method combines JavaScript extraction (for xoxc token) with manual extraction (for xoxd cookie) for the most reliable results.

**Step 1: Get XOXC Token via Console**

1. Open Slack in your web browser (https://app.slack.com) and log in
2. Press **F12** to open Developer Tools
3. Go to the **Console** tab
4. Paste this JavaScript command and press **Enter**:

```javascript
// Extract XOXC token from localStorage
let config = JSON.parse(localStorage.getItem("localConfig_v2"));
let team = Object.values(config.teams)[0];
console.log("SLACK_MCP_XOXC_TOKEN:", team.token);
```

5. Copy the `xoxc-...` token value from the console output

**Step 2: Get XOXD Cookie from Application Tab**

6. In the same Developer Tools, go to the **Application** tab (Chrome) or **Storage** tab (Firefox)
7. Under **Cookies** → Click your Slack workspace URL
8. Find cookie named **`d`**
9. Copy the entire value (starts with `xoxd-`)
   - This is your `SLACK_MCP_XOXD_TOKEN`

**Why this approach?** The xoxc token is easily extracted via JavaScript from localStorage, but the xoxd cookie is more reliably obtained manually from the cookies interface.

**Security Note:** These tokens provide full access to your Slack workspace. Never share them or commit them to version control.

### Option 2: OAuth Token

This method uses a user OAuth token from a Slack app.

**Required Token:**
- `SLACK_MCP_XOXP_TOKEN` - User OAuth token (starts with `xoxp-`)

**How to Create OAuth Token:**

1. Go to https://api.slack.com/apps
2. Click **Create New App** → **From scratch**
3. Give it a name and select your workspace
4. Go to **OAuth & Permissions**
5. Add the following User Token Scopes:
   - `channels:read`
   - `channels:history`
   - `groups:read`
   - `groups:history`
   - `im:read`
   - `im:history`
   - `mpim:read`
   - `mpim:history`
   - `users:read`
   - `search:read`
   - `chat:write` (optional, for sending messages)
6. Click **Install to Workspace**
7. Copy the **User OAuth Token** (starts with `xoxp-`)

## Configuration

### For Claude Desktop

Edit your Claude Desktop configuration file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

**Using Browser Tokens:**

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

**Using OAuth Token:**

```json
{
  "mcpServers": {
    "slack": {
      "command": "/absolute/path/to/slack-mcp-server/build/slack-mcp-server",
      "args": ["-transport", "stdio"],
      "env": {
        "SLACK_MCP_XOXP_TOKEN": "xoxp-your-oauth-token-here",
        "SLACK_MCP_LOG_LEVEL": "info"
      }
    }
  }
}
```

### For Cursor

Edit your Cursor MCP configuration file:

**macOS:** `~/.cursor/mcp.json`

Use the same JSON structure as shown above for Claude Desktop.

### Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SLACK_MCP_XOXC_TOKEN` | Yes* | - | Browser token (`xoxc-...`) |
| `SLACK_MCP_XOXD_TOKEN` | Yes* | - | Browser cookie (`xoxd-...`) |
| `SLACK_MCP_XOXP_TOKEN` | Yes* | - | OAuth token (`xoxp-...`) |
| `SLACK_MCP_PORT` | No | `13080` | Server port (for SSE/HTTP) |
| `SLACK_MCP_HOST` | No | `127.0.0.1` | Server host |
| `SLACK_MCP_LOG_LEVEL` | No | `info` | Log level: debug, info, warn, error |
| `SLACK_MCP_USERS_CACHE` | No | `.users_cache.json` | User cache file path |
| `SLACK_MCP_CHANNELS_CACHE` | No | `.channels_cache_v2.json` | Channel cache file path |
| `SLACK_MCP_ADD_MESSAGE_TOOL` | No | `false` | Enable message posting |
| `SLACK_MCP_PROXY` | No | - | Proxy URL for requests |

*You need either `SLACK_MCP_XOXP_TOKEN` **OR** both `SLACK_MCP_XOXC_TOKEN` and `SLACK_MCP_XOXD_TOKEN`.

## Testing

### Test the Server Directly

```bash
# Set environment variables
export SLACK_MCP_XOXC_TOKEN="xoxc-..."
export SLACK_MCP_XOXD_TOKEN="xoxd-..."

# Run the server
./build/slack-mcp-server -transport stdio
```

### Test with MCP Inspector

```bash
# Install MCP Inspector
npm install -g @modelcontextprotocol/inspector

# Run with inspector
npx @modelcontextprotocol/inspector ./build/slack-mcp-server -transport stdio
```

### Test in Claude Desktop

1. Restart Claude Desktop after updating the configuration
2. Start a new conversation
3. Try asking: "List my Slack channels"
4. Or: "Show me recent messages from #general"

## Troubleshooting

### Server Won't Start

**Problem:** Binary not found or permission denied

**Solution:**
```bash
chmod +x ./build/slack-mcp-server
```

### Authentication Errors

**Problem:** "Invalid credentials" or "Unauthorized"

**Solutions:**
- Verify your tokens are correct and not expired
- Browser tokens expire when you log out - re-extract them
- OAuth tokens can be revoked - regenerate if needed
- Make sure there are no extra spaces or quotes in your tokens

### No Channels Found

**Problem:** Server starts but can't find channels

**Solutions:**
- Wait for the initial cache to build (can take 30-60 seconds)
- Check if `SLACK_MCP_CHANNELS_CACHE` file was created
- Verify you have permission to access the channels
- Try clearing the cache files and restarting:
  ```bash
  rm .users_cache.json .channels_cache_v2.json
  ```

### Messages Not Sending

**Problem:** Can't post messages to Slack

**Solution:**
- Message posting is disabled by default for safety
- Enable it by setting: `SLACK_MCP_ADD_MESSAGE_TOOL=true`
- Or restrict to specific channels: `SLACK_MCP_ADD_MESSAGE_TOOL=C1234567890,C0987654321`

### Logs and Debugging

Enable debug logging:
```bash
export SLACK_MCP_LOG_LEVEL=debug
```

View Claude Desktop logs:
```bash
# macOS
tail -f ~/Library/Logs/Claude/mcp*.log

# Windows
# Check: %APPDATA%\Claude\logs\
```

Run integration tests:
```bash
cd servers/slack/community/slack-mcp-server
make test-integration
```

## Advanced Configuration

### Using with Proxy

```json
{
  "env": {
    "SLACK_MCP_PROXY": "http://proxy.example.com:8080"
  }
}
```

### Enterprise Slack

```json
{
  "env": {
    "SLACK_MCP_USER_AGENT": "Custom-Agent/1.0",
    "SLACK_MCP_CUSTOM_TLS": "true"
  }
}
```

### SSE Transport (Server-Sent Events)

```json
{
  "command": "/path/to/slack-mcp-server",
  "args": ["-transport", "sse"],
  "env": {
    "SLACK_MCP_PORT": "13080",
    "SLACK_MCP_API_KEY": "your-bearer-token"
  }
}
```

## Security Best Practices

1. **Never commit tokens** to version control
2. **Use environment variables** or secure vaults for token storage
3. **Regularly rotate tokens** especially browser tokens
4. **Keep message posting disabled** unless specifically needed
5. **Monitor usage** through Slack's audit logs
6. **Use OAuth tokens** for production deployments when possible

## Additional Resources

- [Official Repository](https://github.com/korotovsky/slack-mcp-server)
- [Detailed Documentation](community/slack-mcp-server/docs/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Slack API Documentation](https://api.slack.com/)

## Getting Help

If you encounter issues:

1. Check the [GitHub Issues](https://github.com/korotovsky/slack-mcp-server/issues)
2. Review server logs with debug mode enabled
3. Test with MCP Inspector to isolate problems
4. Verify your Slack workspace permissions

---

**Note:** This server is not an official Slack product. Use responsibly and in accordance with your organization's policies.


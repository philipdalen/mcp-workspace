# Telegram MCP Server Setup Guide

## Overview
The Telegram MCP server (`chigwell/telegram-mcp`) provides comprehensive Telegram integration with 80+ tools for chat management, messaging, contacts, media, and more. It uses Telethon (MTProto) for full Telegram client capabilities.

## Prerequisites
- Python 3.10+
- `uv` package manager (installed)
- Telegram account
- Telegram API credentials

## Installation Steps

### 1. Repository Setup
The repository has been cloned to:
```
/Users/philip.dalen/repos/mcp/telegram-mcp
```

### 2. Dependencies
Dependencies have been installed using `uv sync`.

### 3. Get Telegram API Credentials

**IMPORTANT:** You need to obtain API credentials from Telegram:

1. Visit [https://my.telegram.org/apps](https://my.telegram.org/apps)
2. Log in with your phone number
3. Create a new application
4. Note down your:
   - `API ID` (numeric)
   - `API Hash` (alphanumeric string)

### 4. Generate Session String

You need to generate a session string to authenticate with Telegram:

```bash
cd /Users/philip.dalen/repos/mcp/telegram-mcp
$HOME/.local/bin/uv run session_string_generator.py
```

**Follow the prompts:**
- Enter your API ID
- Enter your API Hash
- Enter your phone number (with country code, e.g., +1234567890)
- Enter the verification code sent to your Telegram app
- If you have 2FA enabled, enter your password

The script will generate a session string that you'll use in the next step.

### 5. Configure Environment

Create a `.env` file in the telegram-mcp directory:

```bash
cd /Users/philip.dalen/repos/mcp/telegram-mcp
cp .env.example .env
```

Edit the `.env` file with your credentials:

```env
# Telegram API Credentials (from my.telegram.org/apps)
TELEGRAM_API_ID=your_api_id_here
TELEGRAM_API_HASH=your_api_hash_here

# Session Management
TELEGRAM_SESSION_NAME=anon
TELEGRAM_SESSION_STRING=your_generated_session_string_here
```

**Security Note:** Never commit your `.env` file or session string. The session string gives full access to your Telegram account.

### 6. Configure MCP Client

#### For Claude Desktop
Edit: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "telegram-mcp": {
      "command": "/Users/philip.dalen/.local/bin/uv",
      "args": [
        "--directory",
        "/Users/philip.dalen/repos/mcp/telegram-mcp",
        "run",
        "main.py"
      ]
    }
  }
}
```

#### For Cursor
Edit: `~/.cursor/mcp.json`

```json
{
  "mcpServers": {
    "telegram-mcp": {
      "command": "/Users/philip.dalen/.local/bin/uv",
      "args": [
        "--directory",
        "/Users/philip.dalen/repos/mcp/telegram-mcp",
        "run",
        "main.py"
      ]
    }
  }
}
```

### 7. Restart Your MCP Client

After configuration, restart Claude Desktop or Cursor to load the new MCP server.

## Available Features

### Chat & Group Management (18 tools)
- Get/list chats with pagination and filtering
- Create groups and channels
- Edit chat titles and photos
- Manage participants (promote/demote/ban/unban)
- Get invite links and join chats

### Messaging (17 tools)
- Send, edit, delete, forward messages
- Reply to messages
- Pin/unpin messages
- Search messages with filters
- Create polls
- Get message history and context

### Contact Management (12 tools)
- List and search contacts
- Add/delete contacts
- Block/unblock users
- Import/export contacts
- Find direct chats with contacts

### User & Profile (5 tools)
- Get user info and status
- Update profile
- Manage profile photos

### Media (1 tool)
- Get media information

### Search & Discovery (3 tools)
- Search public chats/channels
- Resolve usernames
- Search messages

### Stickers, GIFs, Bots (3 tools)
- Get sticker sets
- Get bot info
- Set bot commands

### Privacy & Settings (8 tools)
- Manage privacy settings
- Mute/unmute chats
- Archive/unarchive chats
- Get recent admin actions

## Usage Examples

Once configured, you can use natural language in your MCP client:

- "Show my recent chats"
- "Send 'Hello world' to chat 123456789"
- "Create a group 'Project Team' with users 111, 222, 333"
- "Search for public channels about 'news'"
- "Join the Telegram group with invite link https://t.me/+AbCdEfGhIjK"
- "Get all unread messages from my chats"
- "Mute notifications for chat 123456789"

## Troubleshooting

### Session Issues
- If you change your Telegram password, regenerate the session string
- Use session string authentication (not file-based) to avoid database lock issues

### Error Logs
- Check `mcp_errors.log` in the telegram-mcp directory for detailed errors
- Check your MCP client logs (Claude/Cursor)

### Authentication Errors
- Verify your API ID and Hash are correct
- Ensure your session string is valid and not expired
- Make sure you're using the correct phone number format

### Path Issues
- Ensure the full path to telegram-mcp is correct in your MCP config
- Avoid paths with spaces or special characters
- Don't use iCloud/Dropbox synced folders

## Security Considerations

⚠️ **CRITICAL SECURITY NOTES:**
- Never commit your `.env` file or session string to version control
- The session string provides full access to your Telegram account
- All processing is local; no data is sent anywhere except Telegram's API
- Keep your API credentials and session string secure

## Docker Alternative (Optional)

If you prefer Docker:

```bash
cd /Users/philip.dalen/repos/mcp/telegram-mcp
docker build -t telegram-mcp:latest .
docker compose up --build
```

## Next Steps

1. ✅ Get Telegram API credentials from https://my.telegram.org/apps
2. ✅ Run the session string generator
3. ✅ Configure your `.env` file
4. ✅ Update your MCP client configuration
5. ✅ Restart your MCP client
6. ✅ Test by asking your AI assistant to "show my recent Telegram chats"

## Resources

- [Telegram API Documentation](https://core.telegram.org/api)
- [Telethon Documentation](https://docs.telethon.dev/)
- [MCP Documentation](https://modelcontextprotocol.io/)
- [Repository](https://github.com/chigwell/telegram-mcp)

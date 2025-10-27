# WhatsApp MCP Setup Guide

This guide will help you set up the WhatsApp MCP server by Luke Harries to integrate your personal WhatsApp account with Claude/Cursor.

## 📋 Prerequisites

- ✅ **Go** - Installed
- ✅ **UV** - Python package manager (installed at `/Users/philip.dalen/.local/bin/uv`)
- ✅ **Python 3.11+** - Required for the MCP server
- 🔧 **FFmpeg** (_optional_) - Only needed for audio messages
  - Install: `brew install ffmpeg` (macOS)
  - Without FFmpeg, you can still send audio files, but they won't appear as playable WhatsApp voice messages

## 🚀 Quick Start

### Step 1: Start the WhatsApp Bridge

The WhatsApp bridge is the Go application that connects to your WhatsApp account:

```bash
cd /Users/philip.dalen/repos/mcp/servers/whatsapp/community/whatsapp-mcp
./start-bridge.sh
```

Or manually:

```bash
cd /Users/philip.dalen/repos/mcp/servers/whatsapp/community/whatsapp-mcp/whatsapp-bridge
./whatsapp-bridge
```

**On first run:**

1. A QR code will appear in the terminal
2. Open WhatsApp on your phone
3. Go to **Settings** > **Linked Devices** > **Link a Device**
4. Scan the QR code

**Important:** The bridge must remain running to maintain your WhatsApp connection!

### Step 2: Verify MCP Configuration

The WhatsApp MCP server is already configured in your Cursor MCP config:

```json
{
  "mcpServers": {
    "whatsapp": {
      "command": "/Users/philip.dalen/.local/bin/uv",
      "args": [
        "--directory",
        "/Users/philip.dalen/repos/mcp/servers/whatsapp/community/whatsapp-mcp/whatsapp-mcp-server",
        "run",
        "main.py"
      ]
    }
  }
}
```

### Step 3: Restart Cursor

1. Quit Cursor completely
2. Restart Cursor
3. Open a new chat
4. You should see WhatsApp tools available in the MCP tools list

## 🛠️ Available Tools

Once connected, Claude/Cursor can use these WhatsApp tools:

### Message Operations

- `search_contacts` - Search for contacts by name or phone number
- `list_messages` - Retrieve messages with optional filters and context
- `send_message` - Send a WhatsApp message to a specified phone number or group JID
- `get_message_context` - Retrieve context around a specific message

### Chat Operations

- `list_chats` - List available chats with metadata
- `get_chat` - Get information about a specific chat
- `get_direct_chat_by_contact` - Find a direct chat with a specific contact
- `get_contact_chats` - List all chats involving a specific contact
- `get_last_interaction` - Get the most recent message with a contact

### Media Operations

- `send_file` - Send a file (image, video, raw audio, document) to a specified recipient
- `send_audio_message` - Send an audio file as a WhatsApp voice message (requires .ogg opus format or FFmpeg)
- `download_media` - Download media from a WhatsApp message and get the local file path

## 📁 Data Storage

All your WhatsApp data is stored locally:

```
servers/whatsapp/community/whatsapp-mcp/whatsapp-bridge/store/
├── whatsapp.db    # Session data and device information
└── messages.db    # Message history, chats, and media references
```

### Privacy Note

- ✅ All messages are stored **locally** on your machine
- ✅ Messages are only sent to Claude when you explicitly access them through tools
- ✅ No data is sent to external servers (except WhatsApp's official servers)
- ⚠️ Be aware of [the lethal trifecta](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/) - project injection could lead to private data exfiltration

## 🔧 Architecture

```
┌─────────────────────────────────────────────┐
│          WhatsApp Web API                   │
└─────────────────┬───────────────────────────┘
                  │ whatsmeow library
┌─────────────────▼───────────────────────────┐
│   whatsapp-bridge (Go) - Port 8080         │
│   • Maintains WhatsApp connection           │
│   • Stores messages in SQLite               │
│   • Provides REST API                       │
└─────────────────┬───────────────────────────┘
                  │ HTTP REST + SQLite
┌─────────────────▼───────────────────────────┐
│   whatsapp-mcp-server (Python)             │
│   • Implements MCP protocol                 │
│   • Queries SQLite for reads                │
│   • Calls REST API for sends                │
└─────────────────┬───────────────────────────┘
                  │ MCP Protocol
┌─────────────────▼───────────────────────────┐
│          Cursor / Claude Desktop            │
└─────────────────────────────────────────────┘
```

## 💡 Usage Examples

### Example 1: Search Messages

```
Search for messages containing "meeting" in my WhatsApp
```

### Example 2: Send a Message

```
Send a WhatsApp message to John Smith saying "The meeting is at 3pm tomorrow"
```

### Example 3: Send Media

```
Send the file /path/to/image.jpg to the "Team Project" group
```

### Example 4: Check Recent Conversations

```
Show me my 10 most recent WhatsApp conversations
```

### Example 5: Download Media

```
Download the latest image from my chat with Sarah
```

## 🔍 Troubleshooting

### Bridge Won't Start

**Problem:** `whatsapp-bridge` fails to start

**Solutions:**

1. Check Go is installed: `go version`
2. Rebuild the bridge: `cd whatsapp-bridge && go build -o whatsapp-bridge main.go`
3. Check for port conflicts (default port 8080)

### QR Code Not Appearing

**Problem:** No QR code shown on first run

**Solutions:**

1. Make sure you don't have an existing session
2. Delete the session files: `rm -rf store/*.db`
3. Restart the bridge

### Authentication Expired

**Problem:** "Not connected to WhatsApp" errors

**Solution:**

- WhatsApp requires re-authentication approximately every 20 days
- Simply restart the bridge and scan the QR code again

### Messages Out of Sync

**Problem:** Recent messages not showing up

**Solutions:**

1. Wait a few minutes - initial sync can take time
2. Delete databases and re-authenticate:
   ```bash
   cd whatsapp-bridge/store
   rm -f messages.db whatsapp.db
   cd ..
   ./whatsapp-bridge
   ```

### MCP Server Not Connecting

**Problem:** Cursor doesn't show WhatsApp tools

**Solutions:**

1. Make sure the bridge is running
2. Check Cursor's MCP logs: `~/Library/Logs/Cursor/`
3. Verify the config in `~/.cursor/mcp.json`
4. Restart Cursor completely

### Python Dependencies Issues

**Problem:** Module not found errors

**Solution:**

```bash
cd /Users/philip.dalen/repos/mcp/servers/whatsapp/community/whatsapp-mcp/whatsapp-mcp-server
/Users/philip.dalen/.local/bin/uv sync
```

## 🔐 Security Best Practices

1. **Keep the bridge running only when needed** - While it's secure, limiting exposure is good practice
2. **Secure your machine** - All your messages are stored locally in SQLite
3. **Use strong device security** - Lock your Mac when away
4. **Be cautious with media downloads** - Downloads are stored in your temp directory
5. **Review project context** - Be aware of what context Claude has access to

## 📊 Performance Tips

1. **Initial sync can take time** - Be patient on first run, especially if you have many chats
2. **Large media files** - Downloading/uploading large files may take time
3. **Message search** - Searching is fast thanks to SQLite indexing

## 🆘 Need Help?

- **GitHub Issues**: https://github.com/lharries/whatsapp-mcp/issues
- **WhatsApp MCP README**: `servers/whatsapp/community/whatsapp-mcp/README.md`
- **Check Bridge Logs**: The bridge outputs detailed logs in the terminal

## 🔄 Updating

To update the WhatsApp MCP server:

```bash
cd /Users/philip.dalen/repos/mcp/servers/whatsapp/community/whatsapp-mcp

# Pull latest changes (if you reconnect git)
git pull

# Rebuild bridge
cd whatsapp-bridge
go build -o whatsapp-bridge main.go

# Update Python dependencies
cd ../whatsapp-mcp-server
/Users/philip.dalen/.local/bin/uv sync
```

---

**Status**: ✅ Ready to use - Built and configured

**Location**: `/Users/philip.dalen/repos/mcp/servers/whatsapp/community/whatsapp-mcp/`

**Bridge**: `/Users/philip.dalen/repos/mcp/servers/whatsapp/community/whatsapp-mcp/whatsapp-bridge/whatsapp-bridge`



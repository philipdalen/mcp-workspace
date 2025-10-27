# WhatsApp MCP Server

This directory contains WhatsApp MCP server implementations.

## Community Implementation

The `community/whatsapp-mcp` directory contains the popular whatsapp-mcp server by Luke Harries.

- **GitHub:** https://github.com/lharries/whatsapp-mcp
- **Stars:** ~4,800
- **Features:**
  - Search and read personal WhatsApp messages
  - Access images, videos, documents, and audio messages
  - Search contacts
  - Send messages to individuals or groups (including media files)
  - Privacy-focused with local SQLite storage
  - Connects via WhatsApp Web multidevice API

### Setup

See the [README.md](community/whatsapp-mcp/README.md) in the whatsapp-mcp directory for detailed setup instructions.

### Quick Start

1. Navigate to the server directory:

   ```bash
   cd servers/whatsapp/community/whatsapp-mcp
   ```

2. Follow the setup instructions in the README for:
   - WhatsApp Bridge setup
   - MCP Server configuration
   - Claude Desktop integration

## Documentation

For detailed setup instructions, see [docs/WHATSAPP_MCP_SETUP.md](../../docs/WHATSAPP_MCP_SETUP.md).

## 🚀 Quick Build & Setup

The WhatsApp MCP has been built and configured for you:

### Start the WhatsApp Bridge

```bash
cd servers/whatsapp/community/whatsapp-mcp
./start-bridge.sh
```

Or manually:

```bash
cd servers/whatsapp/community/whatsapp-mcp/whatsapp-bridge
./whatsapp-bridge
```

### Configuration

The MCP server is already configured in your Cursor config (`~/.cursor/mcp.json`).

### Next Steps

1. Start the bridge (see above)
2. Scan the QR code with WhatsApp on your phone
3. Restart Cursor
4. Start using WhatsApp tools in your conversations!

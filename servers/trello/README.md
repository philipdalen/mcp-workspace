# Trello MCP Server

This directory contains MCP (Model Context Protocol) servers for integrating with Trello.

## Available Implementations

### Community

#### Claude MCP Trello Server

- **Location**: `community/claude-mcp-trello/`
- **Repository**: [hrs-asano/claude-mcp-trello](https://github.com/hrs-asano/claude-mcp-trello)
- **Language**: TypeScript/Node.js
- **Status**: ✅ Active and maintained

**Features:**

- 📋 Full Trello Board Integration (cards, lists, activities)
- ⚡ Built-in Rate Limiting (respects Trello API limits)
- 🔒 Type-Safe Implementation (TypeScript)
- ✅ Input Validation & Error Handling
- 🔍 Cross-board search capabilities

## Setup

### Prerequisites

1. **Node.js** (16 or higher)
   - Install: https://nodejs.org/

2. **Trello API Credentials**
   - Get your API key and token from: https://trello.com/app-key
   - You'll need:
     - `TRELLO_API_KEY` - Your Trello API key
     - `TRELLO_TOKEN` - Your Trello token
     - `TRELLO_BOARD_ID` - The ID of the board you want to work with

### Installation

1. **Navigate to the server directory**:
   ```bash
   cd servers/trello/community/claude-mcp-trello
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

### Configuration

Add this to your MCP configuration (e.g., `~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "trello": {
      "command": "node",
      "args": [
        "/path/to/mcp-workspace/servers/trello/community/claude-mcp-trello/build/index.js"
      ],
      "env": {
        "TRELLO_API_KEY": "your_trello_api_key",
        "TRELLO_TOKEN": "your_trello_token",
        "TRELLO_BOARD_ID": "your_trello_board_id"
      }
    }
  }
}
```

Replace `/path/to/mcp-workspace` with the actual path to your repository.

### Getting Trello Credentials

1. **Get API Key and Token**:
   - Visit https://trello.com/app-key
   - Copy your API Key
   - Generate a token (you may need to authorize the token)
   - Copy the token

2. **Get Board ID**:
   - Open your Trello board in a web browser
   - The Board ID is in the URL: `https://trello.com/b/{BOARD_ID}/board-name`
   - Or add `.json` to the URL and find the `id` field

### Restart Your IDE

After configuring, restart Cursor/Claude Desktop to load the new server.

## Available Tools

Once configured, these tools are available to your AI assistant:

### Card Management
- `trello_get_cards_by_list` - Retrieve cards from a specific list
- `trello_get_my_cards` - Get all cards related to your account
- `trello_add_card` - Create a new card in a list
- `trello_update_card` - Update card details (name, description, due date, labels)
- `trello_archive_card` - Archive (close) a card

### List Management
- `trello_get_lists` - Get all lists in the board
- `trello_add_list` - Create a new list
- `trello_archive_list` - Archive (close) a list

### Board Operations
- `trello_get_recent_activity` - Get recent board activities
- `trello_search_all_boards` - Cross-board search across workspace/organization

## Rate Limiting

The server implements automatic rate limiting to comply with Trello's API limits:
- **300 requests per 10 seconds** per API key
- **100 requests per 10 seconds** per token

Rate limiting uses a token bucket algorithm and requests are automatically queued if limits are reached.

## Directory Structure

```
trello/
├── README.md (this file)
└── community/
    └── claude-mcp-trello/
        ├── src/             # TypeScript source code
        │   ├── index.ts      # Main server implementation
        │   ├── trello-client.ts
        │   ├── rate-limiter.ts
        │   ├── types.ts
        │   └── validators.ts
        ├── build/            # Compiled JavaScript (after build)
        ├── package.json
        ├── tsconfig.json
        └── README.md         # Original project README
```

## Troubleshooting

### Common Issues

1. **"TRELLO_API_KEY / TRELLO_TOKEN / TRELLO_BOARD_ID are not set"**
   - Ensure all three environment variables are set in your MCP configuration
   - Check that the paths are correct

2. **Rate Limit Errors**
   - The server handles rate limiting automatically, but if you see errors, wait a few seconds and try again

3. **Invalid Board/List/Card IDs**
   - Double-check that the IDs are correct
   - Board ID is in the URL when viewing the board
   - List and Card IDs can be found in the board JSON (add `.json` to board URL)

4. **Authentication Errors**
   - Verify your API key and token are correct
   - Make sure your token has not expired
   - You may need to regenerate the token at https://trello.com/app-key

### Development

To run the server in development mode:

```bash
cd servers/trello/community/claude-mcp-trello
npm run dev
```

To run tests:

```bash
npm test
```

## References

- [Trello REST API Documentation](https://developer.atlassian.com/cloud/trello/rest/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Claude MCP Trello GitHub](https://github.com/hrs-asano/claude-mcp-trello)


# MCP Servers Repository

This repository contains configuration, documentation, and server implementations for various MCP (Model Context Protocol) servers.

## 📦 MCP Servers

### Teamwork MCP (Node.js) ⭐ Active

- **Path**: `servers/teamwork/community/vizioz-teamwork-mcp`
- **Language**: TypeScript/Node.js
- **Status**: Working implementation used in production
- **Features**: Teamwork integration with calendar, projects, tasks, time tracking, and more
- **Documentation**: `docs/TEAMWORK_MCP_SETUP.md`

### Telegram MCP (Python) ⭐ Active

- **Path**: `servers/telegram/telegram-mcp`
- **Language**: Python
- **Status**: Working implementation used in production
- **Features**: Telegram messaging and chat management
- **Documentation**: `docs/TELEGRAM_MCP_SETUP.md`

### Official Teamwork MCP (Go) 📚 Reference Only

- **Path**: `servers/teamwork/official/teamwork-mcp`
- **Language**: Go
- **Status**: Reference implementation - not installed or run
- **Purpose**: Used to study implementation details when adding features to vizioz-teamwork-mcp
- **Documentation**: Check the submodule README

> **Architecture Note**: When we need new functionality in the Teamwork MCP, we reference the official Go implementation to understand how it works, then implement the logic in our vizioz-teamwork-mcp Node.js server.

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/philipdalen/mcp.git
cd mcp
```

### 2. Install All Servers

```bash
make install
```

This will:

- Install Node.js dependencies for Teamwork MCP (vizioz-teamwork-mcp)
- Install Python dependencies for Telegram MCP

### 3. Install Individual Servers (Optional)

```bash
make install-teamwork         # Install only Teamwork MCP (Node.js)
make install-telegram         # Install only Telegram MCP (Python)
```

### 3. View All Available Commands

```bash
make help
```

> 📘 **Need detailed installation instructions?** See [SETUP.md](SETUP.md) for comprehensive installation guide, troubleshooting, and manual installation steps.

## 📁 Repository Structure

```
mcp/
├── Makefile                    # Installation and setup automation
├── README.md                   # This file
├── SETUP.md                    # Detailed installation guide
├── configs/                    # Example configuration files
│   ├── teamwork-mcp-config-bearer.json
│   └── telegram-mcp-config-example.json
├── docs/                       # Documentation
│   ├── AUTH_GUIDE.md
│   ├── NOTEBOOK_OPERATIONS.md
│   ├── TEAMWORK_MCP_SETUP.md
│   └── TELEGRAM_MCP_SETUP.md
├── examples/                   # Usage examples
├── logs/                       # Log files
└── servers/                    # MCP server implementations
    ├── teamwork/
    │   ├── official/          # Official Teamwork MCP (Go)
    │   └── community/         # Community Teamwork MCP (Node.js)
    └── telegram/              # Telegram MCP (Python)
```

## 🔧 Prerequisites

Depending on which servers you want to use, you'll need:

- **Node.js** (18+) - For Teamwork MCP
  - Install: https://nodejs.org/
- **Python** (3.9+) - For Telegram MCP
  - Install: https://www.python.org/downloads/

> **Note**: Go is **not required**. The official Teamwork MCP (Go) is included only as a reference implementation for studying how features are built.

## 📖 Setup Guides

### Teamwork MCP Quick Setup

#### 1. Get Your Bearer Token

```bash
npx @teamwork/get-bearer-token
```

#### 2. Configure Your IDE

Add this to your Windsurf/Cursor/Claude Desktop MCP configuration:

```json
{
  "mcpServers": {
    "teamwork": {
      "serverUrl": "https://mcp.ai.teamwork.com",
      "headers": {
        "Authorization": "Bearer <YOUR_TOKEN_HERE>"
      }
    }
  }
}
```

For detailed setup instructions, see `docs/TEAMWORK_MCP_SETUP.md`.

### Telegram MCP Quick Setup

See `docs/TELEGRAM_MCP_SETUP.md` for complete setup instructions.

## 📚 What's Included

### Teamwork MCP Features

- ✅ Notebooks (Create, Update, Delete, List)
- ✅ Projects & Task Management
- ✅ Users, Teams & Companies
- ✅ Milestones, Tags & Comments
- ✅ Time Logs & Timers
- ✅ Workload Management
- ✅ 30+ tools available

### Telegram MCP Features

- ✅ Send & receive messages
- ✅ Chat management
- ✅ Contact management
- ✅ Group & channel operations
- ✅ Media handling
- ✅ 50+ tools available

## 🛠️ Makefile Commands

```bash
make help                      # Show all available commands
make install                   # Install all MCP servers
make install-teamwork          # Install Teamwork MCP only (Node.js)
make install-telegram          # Install Telegram MCP only (Python)
make clean                     # Remove all installed dependencies
```

## 📖 Documentation

- **Installation Guide**: `SETUP.md` - Comprehensive installation, troubleshooting, and manual setup
- **Teamwork Setup**: `docs/TEAMWORK_MCP_SETUP.md`
- **Teamwork Notebook Operations**: `docs/NOTEBOOK_OPERATIONS.md`
- **Telegram Setup**: `docs/TELEGRAM_MCP_SETUP.md`
- **Authentication Guide**: `docs/AUTH_GUIDE.md`
- **Teamwork API Docs**: https://apidocs.teamwork.com/
- **Official Teamwork MCP Repo**: https://github.com/Teamwork/mcp

## 💡 Example Usage

### Teamwork Examples

```
Create a markdown notebook in project 12345 called "Sprint Planning"
with our Q1 goals
```

```
List all notebooks in project 12345 tagged with "documentation"
```

```
Show me all overdue tasks assigned to me
```

### Telegram Examples

```
Send a message to chat ID 12345
```

```
List my recent conversations
```

```
Search for messages containing "meeting notes" in chat 67890
```

## 🆘 Need Help?

- Check the setup guides in the `docs/` directory
- Visit [Teamwork Support](https://support.teamwork.com/)
- Check [Teamwork MCP GitHub Issues](https://github.com/Teamwork/mcp/issues)
- Check [Telegram MCP GitHub Issues](https://github.com/philipdalen/telegram-mcp/issues)

## 🤝 Contributing

Contributions are welcome! Each server has its own repository:

- Official Teamwork MCP: https://github.com/Teamwork/mcp
- Community Teamwork MCP: https://github.com/philipdalen/Teamwork-MCP
- Telegram MCP: https://github.com/philipdalen/telegram-mcp

## 📝 License

Each MCP server has its own license. Please check the individual server directories for license information.

---

**Status**: ✅ Ready to use - Multiple MCP servers with comprehensive features

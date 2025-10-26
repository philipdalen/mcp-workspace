# MCP Servers Installation Guide

This guide will walk you through setting up the MCP servers in this repository.

## Architecture Overview

This repository contains two active MCP servers and one reference implementation:

- **Teamwork MCP (Node.js)** - `vizioz-teamwork-mcp` - Our working implementation ⭐
- **Telegram MCP (Python)** - Working implementation ⭐
- **Official Teamwork MCP (Go)** - Reference only, not installed 📚

> **Key Concept**: The official Teamwork MCP (Go) is kept as a reference implementation. When we need new functionality in our Teamwork MCP, we study the official implementation to understand how features work, then implement the logic in our vizioz-teamwork-mcp (Node.js) server.

> **Note**: All code is included directly in the repository - no git submodules are used. This makes setup simpler and keeps everything in one place.

## Prerequisites

Before you begin, ensure you have the following installed:

### For Teamwork MCP (Required if using Teamwork)

- **Node.js** (version 18 or higher)
  - macOS: `brew install node`
  - Linux: Use your package manager or download from https://nodejs.org/
  - Windows: Download installer from https://nodejs.org/

### For Telegram MCP (Required if using Telegram)

- **Python** (version 3.9 or higher)
  - macOS: `brew install python@3.9` (or use system Python)
  - Linux: Use your package manager
  - Windows: Download from https://www.python.org/downloads/

> **Note**: Go is **not required**. The official Teamwork MCP (Go) is included only as a reference for studying implementations.

## Installation Methods

### Method 1: Install Everything (Recommended)

This is the easiest way to get started. It will install both active MCP servers.

```bash
# Clone the repository
git clone https://github.com/philipdalen/mcp.git
cd mcp

# Install all servers
make install
```

This will:

1. Install Node.js dependencies and build Teamwork MCP (vizioz-teamwork-mcp)
2. Create Python virtual environment and install Telegram MCP dependencies

### Method 2: Install Individual Servers

If you only want specific servers, you can install them individually:

```bash
# Clone the repository
git clone https://github.com/philipdalen/mcp.git
cd mcp

# Install only what you need
make install-teamwork         # Teamwork MCP (Node.js/vizioz-teamwork-mcp)
make install-telegram         # Telegram MCP (Python)
```

### Method 3: Manual Installation

If you prefer to install manually or the Makefile doesn't work on your system:

#### Teamwork MCP (Node.js/vizioz-teamwork-mcp)

```bash
cd servers/teamwork/community/vizioz-teamwork-mcp
npm install
npm run build
```

#### Telegram MCP (Python)

```bash
cd servers/telegram/telegram-mcp
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

> **Note**: The official Teamwork MCP (Go) is not installed. It's available in `servers/teamwork/official/teamwork-mcp` as a reference for studying implementations.

## Updating Servers

To update all servers to their latest versions:

```bash
git pull origin main
make install
```

The server code is part of the main repository, so a simple `git pull` will update everything.

## Cleaning Up

To remove all installed dependencies and build artifacts:

```bash
make clean
```

This will:

- Remove Node.js `node_modules` and `build` directories from Teamwork MCP
- Remove Python virtual environment from Telegram MCP

## Verification

After installation, verify that each server is working:

### Teamwork MCP (vizioz-teamwork-mcp)

```bash
cd servers/teamwork/community/vizioz-teamwork-mcp
npm start
```

### Telegram MCP

```bash
cd servers/telegram/telegram-mcp
source venv/bin/activate
python main.py
```

## Troubleshooting

### Server Directories Are Empty

If the server directories are empty after cloning, you may need to re-clone the repository:

```bash
git clone https://github.com/philipdalen/mcp.git
```

All code is included in the main repository (no submodules), so a fresh clone should contain everything.

### Permission Denied on Makefile

Ensure the Makefile is executable (usually not necessary):

```bash
chmod +x Makefile
```

### Node.js/npm Issues

- Ensure you have Node.js 18 or higher: `node --version`
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

### Python Issues

- Ensure you have Python 3.9 or higher: `python3 --version`
- Try recreating the virtual environment:
  ```bash
  cd servers/telegram/telegram-mcp
  rm -rf venv
  python3 -m venv venv
  source venv/bin/activate
  pip install --upgrade pip
  pip install -r requirements.txt
  ```

## Next Steps

After installation, configure each server you want to use:

1. **Teamwork MCP**: See `docs/TEAMWORK_MCP_SETUP.md`
2. **Telegram MCP**: See `docs/TELEGRAM_MCP_SETUP.md`
3. **Authentication**: See `docs/AUTH_GUIDE.md`

## Getting Help

- Check the troubleshooting section above
- Read the documentation in the `docs/` directory
- Check the README in each server's directory
- Open an issue on the respective GitHub repositories

## Available Makefile Commands

```bash
make help                      # Show all available commands
make install                   # Install all MCP servers
make install-teamwork          # Install Teamwork MCP only (Node.js)
make install-telegram          # Install Telegram MCP only (Python)
make clean                     # Remove all installed dependencies
```

---

**Happy coding with MCP servers! 🚀**

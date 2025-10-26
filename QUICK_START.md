# Quick Start Guide

Get up and running with MCP servers in 2 minutes!

> **Architecture Note**: We use vizioz-teamwork-mcp (Node.js) as our working Teamwork MCP server. The official Teamwork MCP (Go) is included only as a reference to study implementations when adding new features.

## 🚀 Installation

### Option 1: Fresh Clone (Recommended)

```bash
# Clone with submodules
git clone --recurse-submodules https://github.com/philipdalen/mcp.git
cd mcp

# Install everything
make install
```

### Option 2: Already Cloned?

```bash
cd mcp

# Initialize submodules
make update-submodules

# Install everything
make install
```

## ⚡ Available Commands

```bash
make help                       # Show all commands
make install                    # Install all servers
make update-submodules          # Update submodules
make install-teamwork           # Install Teamwork MCP (Node.js)
make install-telegram           # Install Telegram MCP (Python)
make clean                      # Clean all installations
```

## 📋 Prerequisites Checklist

- [ ] **Node.js** 18+ (for Teamwork MCP)

  - Check: `node --version`
  - Install: https://nodejs.org/

- [ ] **Python** 3.9+ (for Telegram MCP)
  - Check: `python3 --version`
  - Install: https://www.python.org/downloads/

> **Note**: Go is not required. The official Teamwork MCP (Go) is included only as a reference.

## 🎯 Next Steps After Installation

### For Teamwork MCP

1. Get your bearer token:

   ```bash
   npx @teamwork/get-bearer-token
   ```

2. See `docs/TEAMWORK_MCP_SETUP.md` for IDE configuration

### For Telegram MCP

1. See `docs/TELEGRAM_MCP_SETUP.md` for complete setup

## 📚 Documentation

| Document                      | Purpose                                   |
| ----------------------------- | ----------------------------------------- |
| `README.md`                   | Repository overview and features          |
| `SETUP.md`                    | Detailed installation and troubleshooting |
| `docs/TEAMWORK_MCP_SETUP.md`  | Teamwork configuration guide              |
| `docs/TELEGRAM_MCP_SETUP.md`  | Telegram configuration guide              |
| `docs/AUTH_GUIDE.md`          | Authentication information                |
| `docs/NOTEBOOK_OPERATIONS.md` | Teamwork notebook examples                |

## ❓ Common Issues

### Submodules are empty

```bash
make update-submodules
```

### Installation failed for a specific server

Install them individually:

```bash
make install-teamwork
make install-telegram
```

### Missing prerequisites

The Makefile will warn you if Node.js or Python is missing. Install the missing tool and run the installation again.

## 🆘 Getting Help

1. Check `SETUP.md` for detailed troubleshooting
2. Review the documentation in `docs/`
3. Check the server-specific README in each submodule
4. Open an issue on the respective GitHub repository

---

**Happy coding! 🎉**

.PHONY: help install update-submodules install-teamwork install-telegram clean

# Default target
help:
	@echo "MCP Servers Setup"
	@echo "================="
	@echo ""
	@echo "Available targets:"
	@echo "  make install                  - Initialize all submodules and install dependencies"
	@echo "  make update-submodules        - Update all submodules to latest commits"
	@echo "  make install-teamwork         - Install Node.js dependencies for Teamwork MCP"
	@echo "  make install-telegram         - Install Python dependencies for Telegram MCP"
	@echo "  make clean                    - Remove all installed dependencies"
	@echo ""
	@echo "Note: The official Teamwork MCP (Go) is kept as a reference only."
	@echo "      We use vizioz-teamwork-mcp (Node.js) as the working implementation."
	@echo ""

# Initialize and install everything
install: update-submodules install-teamwork install-telegram
	@echo ""
	@echo "✅ All MCP servers have been installed successfully!"
	@echo ""
	@echo "Next steps:"
	@echo "  1. Review docs/TEAMWORK_MCP_SETUP.md for Teamwork setup"
	@echo "  2. Review docs/TELEGRAM_MCP_SETUP.md for Telegram setup"
	@echo ""

# Initialize and update git submodules
update-submodules:
	@echo "📥 Initializing and updating git submodules..."
	git submodule update --init --recursive
	@echo "✅ Submodules updated"
	@echo ""
	@echo "ℹ️  Note: The official Teamwork MCP (Go) is included as a reference implementation."
	@echo "   We use vizioz-teamwork-mcp (Node.js) as our working MCP server."

# Install Teamwork MCP (Node.js/TypeScript)
# This is the working implementation we use
install-teamwork:
	@echo ""
	@echo "🔧 Installing Teamwork MCP (vizioz-teamwork-mcp - Node.js)..."
	@if [ ! -d "servers/teamwork/community/vizioz-teamwork-mcp" ]; then \
		echo "❌ Submodule not found. Run 'make update-submodules' first."; \
		exit 1; \
	fi
	@if command -v npm > /dev/null 2>&1; then \
		cd servers/teamwork/community/vizioz-teamwork-mcp && \
		npm install && \
		npm run build && \
		echo "✅ Teamwork MCP installed and built"; \
	else \
		echo "⚠️  npm not found. Skipping Teamwork MCP installation."; \
		echo "   Install Node.js from https://nodejs.org/"; \
	fi

# Install Telegram MCP (Python)
install-telegram:
	@echo ""
	@echo "🔧 Installing Telegram MCP (Python)..."
	@if [ ! -d "servers/telegram/telegram-mcp" ]; then \
		echo "❌ Submodule not found. Run 'make update-submodules' first."; \
		exit 1; \
	fi
	@if command -v python3 > /dev/null 2>&1; then \
		cd servers/telegram/telegram-mcp && \
		python3 -m venv venv && \
		. venv/bin/activate && \
		pip install -r requirements.txt && \
		echo "✅ Telegram MCP installed"; \
	else \
		echo "⚠️  Python3 not found. Skipping Telegram MCP installation."; \
		echo "   Install Python from https://www.python.org/downloads/"; \
	fi

# Clean all installed dependencies
clean:
	@echo "🧹 Cleaning installed dependencies..."
	@if [ -d "servers/teamwork/community/vizioz-teamwork-mcp/node_modules" ]; then \
		rm -rf servers/teamwork/community/vizioz-teamwork-mcp/node_modules; \
		rm -rf servers/teamwork/community/vizioz-teamwork-mcp/build; \
		echo "✅ Cleaned Teamwork MCP"; \
	fi
	@if [ -d "servers/telegram/telegram-mcp/venv" ]; then \
		rm -rf servers/telegram/telegram-mcp/venv; \
		echo "✅ Cleaned Telegram MCP"; \
	fi
	@echo "✅ All dependencies cleaned"


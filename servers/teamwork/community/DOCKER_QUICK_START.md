# Docker Quick Start Guide

Get the Teamwork MCP Community Server running in Docker in 3 simple steps!

## 🚀 Quick Start (3 Steps)

### Step 1: Build the Image

```bash
cd servers/teamwork/community
./docker-build.sh
```

Or manually:

```bash
docker build -f Dockerfile.standalone -t teamwork-mcp:local .
```

### Step 2: Test Run

```bash
docker run -i --rm \
  -e TEAMWORK_DOMAIN=your-company \
  -e TEAMWORK_USERNAME=your-email@example.com \
  -e TEAMWORK_PASSWORD=your-password \
  -e DISABLE_LOGGING=true \
  teamwork-mcp:local
```

Replace:

-   `your-company` with your Teamwork domain (e.g., if your URL is `https://acme.teamwork.com`, use `acme`)
-   `your-email@example.com` with your Teamwork username
-   `your-password` with your Teamwork password

### Step 3: Configure Claude Desktop

Edit your Claude config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Add this (replace with your actual credentials):

```json
{
    "mcpServers": {
        "Teamwork.com": {
            "command": "docker",
            "args": [
                "run",
                "-i",
                "--rm",
                "-e",
                "TEAMWORK_DOMAIN",
                "-e",
                "TEAMWORK_USERNAME",
                "-e",
                "TEAMWORK_PASSWORD",
                "-e",
                "DISABLE_LOGGING",
                "teamwork-mcp:local"
            ],
            "env": {
                "TEAMWORK_DOMAIN": "your-company",
                "TEAMWORK_USERNAME": "your-email@example.com",
                "TEAMWORK_PASSWORD": "your-password",
                "DISABLE_LOGGING": "true"
            }
        }
    }
}
```

Restart Claude Desktop, and you're done! 🎉

## 📚 Need More Help?

-   **Full Docker Documentation**: See [DOCKER_SETUP.md](DOCKER_SETUP.md)
-   **General Documentation**: See [README.md](README.md)
-   **Issues**: https://github.com/vizioz/teamwork-mcp/issues

## 🔧 Advanced Options

### Filter Tools

Only expose specific tool groups:

```bash
-e ALLOW_TOOLS=Tasks,Projects
```

Or deny specific tools:

```bash
-e DENY_TOOLS=deleteTask,deletePerson
```

### Set Default Project

```bash
-e TEAMWORK_PROJECT_ID=123456
```

### Enable Logging

Remove or set to false:

```bash
-e DISABLE_LOGGING=false
```

## 🐛 Troubleshooting

### Check the image exists

```bash
docker images | grep teamwork-mcp
```

### Test with verbose output

```bash
docker run -i --rm \
  -e TEAMWORK_DOMAIN=your-company \
  -e TEAMWORK_USERNAME=your-email@example.com \
  -e TEAMWORK_PASSWORD=your-password \
  teamwork-mcp:local
```

### Rebuild from scratch

```bash
docker build --no-cache -f Dockerfile.standalone -t teamwork-mcp:local .
```

## 🎯 What's Next?

Once integrated with Claude:

1. Ask Claude to list your Teamwork projects
2. Create tasks directly from your conversation
3. Get task updates and project status
4. Manage your Teamwork workflow with natural language!

Enjoy using Teamwork MCP! 🚀


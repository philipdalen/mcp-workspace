# Docker Setup for Teamwork MCP Community Server

This guide explains how to run the Teamwork MCP Community Server using Docker, which can be integrated with Claude Desktop and other MCP clients.

## Quick Start

### 1. Prerequisites

-   Docker and Docker Compose installed
-   Teamwork account with API credentials

### 2. Configuration

Create a `.env` file in the `servers/teamwork/community/` directory:

```bash
# Copy the example environment file
cp .env.docker.example .env
```

Edit the `.env` file with your credentials:

```env
TEAMWORK_DOMAIN=your-company
TEAMWORK_USERNAME=your-email@example.com
TEAMWORK_PASSWORD=your-password
```

### 3. Build and Run

#### Option A: Using Docker directly (Recommended for testing)

```bash
# Navigate to the community directory
cd servers/teamwork/community

# Build the image
docker build -f Dockerfile.standalone -t teamwork-mcp:local .

# Run the container interactively (for testing with MCP clients)
docker run -i --rm \
  -e TEAMWORK_DOMAIN=your-company \
  -e TEAMWORK_USERNAME=your-email@example.com \
  -e TEAMWORK_PASSWORD=your-password \
  -e DISABLE_LOGGING=true \
  teamwork-mcp:local
```

#### Option B: Using Docker Compose

```bash
# Create your .env file from the example
cp env.docker.example .env
# Edit .env with your credentials

# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

## Integration with Claude Desktop

To use this Docker container with Claude Desktop, update your Claude configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Add this configuration (after building the image locally):

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

### Alternative: Using Pre-built Image

If you've pushed the image to a registry (e.g., Docker Hub):

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
                "your-registry/teamwork-mcp:latest"
            ],
            "env": {
                "TEAMWORK_DOMAIN": "your-company",
                "TEAMWORK_USERNAME": "your-email@example.com",
                "TEAMWORK_PASSWORD": "your-password"
            }
        }
    }
}
```

## Integration with Cursor

For Cursor (version 0.47+), edit your MCP configuration file:

**Location**: `.cursor/mcp.json` in your workspace or home directory

```json
{
    "mcpServers": {
        "Teamwork": {
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

## Advanced Configuration

### Disable Logging

Add to your `.env` file:

```env
DISABLE_LOGGING=true
```

### Filter Available Tools

Only expose specific tools:

```env
ALLOW_TOOLS=Tasks,Projects,getTaskById
```

Or deny specific tools:

```env
DENY_TOOLS=deleteTask,deletePerson
```

### Set Default Project

```env
TEAMWORK_PROJECT_ID=123456
```

## Docker Compose Advanced Options

### Persistent Logs

Logs are automatically saved to `./logs/` directory when the container runs.

### Custom Configuration File

If you have a `teamwork.config.json` file, it will be mounted automatically:

```json
{
    "teamworkProjectId": "123456",
    "solutionRootPath": "/path/to/solution"
}
```

## Troubleshooting

### Container won't start

Check the logs:

```bash
docker-compose logs teamwork-mcp
```

### Authentication errors

Verify your credentials:

```bash
docker-compose exec teamwork-mcp node -e "console.log('Domain:', process.env.TEAMWORK_DOMAIN); console.log('Username:', process.env.TEAMWORK_USERNAME);"
```

### Test the API connection

```bash
docker-compose exec teamwork-mcp npm run test-connection
```

### Rebuild after code changes

```bash
docker-compose build --no-cache
docker-compose up -d
```

## Security Best Practices

1. **Never commit `.env` files** - They contain sensitive credentials
2. **Use environment variables** - Don't hardcode credentials
3. **Limit tool access** - Use `ALLOW_TOOLS` or `DENY_TOOLS` to restrict capabilities
4. **Use read-only mounts** - When possible, mount config files as read-only (`:ro`)
5. **Run as non-root** - The Dockerfile already creates a non-root user

## Building for Production

To build and tag for production:

```bash
# Build with version tag
docker build -f Dockerfile.standalone -t teamwork-mcp:v1.0.0 .

# Tag as latest
docker tag teamwork-mcp:v1.0.0 teamwork-mcp:latest

# Push to registry (if using one)
docker push your-registry/teamwork-mcp:v1.0.0
docker push your-registry/teamwork-mcp:latest
```

## Updating the Container

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build
```

## Support

For issues and questions:

-   GitHub Issues: https://github.com/vizioz/teamwork-mcp/issues
-   Documentation: https://github.com/vizioz/teamwork-mcp

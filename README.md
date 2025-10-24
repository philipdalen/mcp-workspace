# Teamwork MCP Server Setup

This directory contains configuration and documentation for setting up the **official Teamwork.com MCP server** in Windsurf IDE.

## 🎉 Good News!

The official Teamwork MCP server **already includes full notebook support**! No custom development needed.

## 📁 Files in This Directory

- **`TEAMWORK_MCP_SETUP.md`** - Complete setup guide for Windsurf
- **`NOTEBOOK_OPERATIONS.md`** - Quick reference for notebook operations
- **`teamwork-mcp-config.json`** - Example MCP configuration file
- **`teamwork-mcp/`** - Cloned official Teamwork MCP repository (for reference)

## 🚀 Quick Start

### 1. Get Your Bearer Token
```bash
npx @teamwork/get-bearer-token
```

### 2. Configure Windsurf

Add this to your Windsurf MCP configuration:

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

### 3. Verify

- Open Windsurf Cascade panel
- Click the hammer icon 🔨
- Look for "Teamwork" with a green dot

## 📚 What's Included

### Notebook Tools (5)
- ✅ Create notebooks (Markdown or HTML)
- ✅ Update notebooks
- ✅ Delete notebooks
- ✅ Get notebook by ID
- ✅ List notebooks with filtering

### Additional Tools (30+)
- Projects, Tasks, Task Lists
- Users, Teams, Companies
- Milestones, Tags, Comments
- Time Logs, Timers, Activities
- Workload management

## 🔐 Authentication

The hosted MCP server uses **Bearer token authentication**, which represents you as the end user. This means:
- ✅ All actions are performed as you
- ✅ You have the same permissions as your Teamwork account
- ✅ Audit logs show your user ID
- ✅ No separate service account needed

## 📖 Documentation

- **Setup Guide**: See `TEAMWORK_MCP_SETUP.md` for detailed installation instructions
- **Notebook Reference**: See `NOTEBOOK_OPERATIONS.md` for notebook operation examples
- **Official Repo**: https://github.com/Teamwork/mcp
- **API Docs**: https://apidocs.teamwork.com/

## 🎯 Next Steps

1. ✅ Follow the setup guide in `TEAMWORK_MCP_SETUP.md`
2. ✅ Get your bearer token
3. ✅ Configure Windsurf
4. ✅ Start using notebooks with Cascade!

## 💡 Example Usage

Once configured, you can ask Cascade:

```
Create a markdown notebook in project 12345 called "Sprint Planning" 
with our Q1 goals
```

```
List all notebooks in project 12345 tagged with "documentation"
```

```
Update notebook 789 to add the new deployment process
```

## 🆘 Need Help?

- Check the troubleshooting section in `TEAMWORK_MCP_SETUP.md`
- Visit [Teamwork Support](https://support.teamwork.com/)
- Check [GitHub Issues](https://github.com/Teamwork/mcp/issues)

---

**Status**: ✅ Ready to use - Official Teamwork MCP server with full notebook support

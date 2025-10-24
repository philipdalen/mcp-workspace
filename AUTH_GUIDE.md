# Teamwork MCP Authentication Guide

You have **two options** for authenticating with the Teamwork MCP server:

## Option 1: Personal API Key (Basic Auth) ⭐ Recommended

### Where to Find Your API Key

1. Log into your Teamwork account
2. Click your profile picture (top right)
3. Go to **Edit My Details** or **Settings**
4. Navigate to the **API & Mobile** section
5. Copy your **API Key**

### How to Encode Your API Key

Your API key needs to be base64-encoded in the format `{API_KEY}:xxx` (the password part can be anything).

**Quick encoding command:**
```bash
echo -n "YOUR_API_KEY:xxx" | base64
```

Example:
```bash
echo -n "tkn_abc123xyz:xxx" | base64
# Output: dGtuX2FiYzEyM3h5ejp4eHg=
```

### Configuration

Use this in your `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "teamwork": {
      "serverUrl": "https://mcp.ai.teamwork.com",
      "headers": {
        "Authorization": "Basic dGtuX2FiYzEyM3h5ejp4eHg="
      }
    }
  }
}
```

**Replace** `dGtuX2FiYzEyM3h5ejp4eHg=` with your actual base64-encoded API key.

---

## Option 2: Bearer Token (OAuth2)

### How to Get a Bearer Token

Run this command:
```bash
npx @teamwork/get-bearer-token
```

This will:
1. Open your browser
2. Ask you to log in to Teamwork
3. Generate a bearer token
4. Display it in your terminal

### Configuration

Use this in your `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "teamwork": {
      "serverUrl": "https://mcp.ai.teamwork.com",
      "headers": {
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }
  }
}
```

**Replace** the token with your actual bearer token from the command.

---

## Which Should You Use?

### Use Personal API Key (Option 1) if:
- ✅ You want a **permanent** authentication method
- ✅ You don't want to regenerate tokens periodically
- ✅ You're the only one using this configuration
- ✅ You already have an API key from your profile

### Use Bearer Token (Option 2) if:
- ✅ You prefer **OAuth2** authentication
- ✅ You want **time-limited** access tokens
- ✅ You're setting up for the first time and don't have an API key yet
- ✅ Your organization requires OAuth2

---

## Complete Setup Example

### Using API Key (Recommended)

**Step 1:** Get your API key from Teamwork profile

**Step 2:** Encode it
```bash
echo -n "tkn_YOUR_ACTUAL_KEY:xxx" | base64
```

**Step 3:** Create/edit `~/.codeium/windsurf/mcp_config.json`:
```json
{
  "mcpServers": {
    "teamwork": {
      "serverUrl": "https://mcp.ai.teamwork.com",
      "headers": {
        "Authorization": "Basic YOUR_BASE64_ENCODED_KEY_HERE"
      }
    }
  }
}
```

**Step 4:** Restart Windsurf and verify the connection

---

## Troubleshooting

### "Unauthorized" Error
- ✅ Check that your API key is correct
- ✅ Verify the base64 encoding is correct
- ✅ Make sure you included `:xxx` after the API key before encoding
- ✅ For bearer tokens, regenerate if expired

### "Invalid Token" Error
- ✅ Bearer tokens may expire - regenerate using `npx @teamwork/get-bearer-token`
- ✅ API keys are permanent unless you regenerate them in your profile

### Connection Issues
- ✅ Verify you can access `https://mcp.ai.teamwork.com` in your browser
- ✅ Check your network/firewall settings
- ✅ Ensure Windsurf has internet access

---

## Security Best Practices

### DO ✅
- Store your API key/token securely
- Use environment variables for sensitive data
- Regenerate tokens if compromised
- Keep your `mcp_config.json` out of version control

### DON'T ❌
- Commit tokens to Git repositories
- Share your API key with others
- Use the same API key across multiple services
- Store tokens in plain text in shared locations

---

## Quick Reference

| Method | Format | Permanence | Setup Difficulty |
|--------|--------|------------|------------------|
| **API Key** | `Basic {base64}` | Permanent | Easy |
| **Bearer Token** | `Bearer {token}` | Temporary | Very Easy |

---

## Example Files

- **`teamwork-mcp-config.json`** - API Key (Basic Auth) example
- **`teamwork-mcp-config-bearer.json`** - Bearer Token (OAuth2) example

Choose the file that matches your preferred authentication method and copy it to:
```
~/.codeium/windsurf/mcp_config.json
```

---

## Need Help?

- Check the main setup guide: `TEAMWORK_MCP_SETUP.md`
- Teamwork API docs: https://apidocs.teamwork.com/guides/teamwork/authentication
- Windsurf MCP docs: https://docs.windsurf.com/windsurf/cascade/mcp

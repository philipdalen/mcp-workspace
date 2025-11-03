# Trello API Authentication

Trello API authentication primarily relies on a token-based system to grant third-party applications access to a user's Trello data. This involves obtaining an API key and a user-specific token, which are then included in API requests. Trello also supports OAuth 1.0 as an alternative for more advanced integrations.

## Getting an API Key

The API key is associated with a Power-Up (even if you're not building one, you can create a placeholder). To obtain it:

1. Go to the Trello Power-Ups admin page at https://trello.com/power-ups/admin.
2. Select or create a Power-Up.
3. Navigate to the "API Key" tab and generate a new key if one doesn't exist.

API keys can be treated as public, but they should be kept secure in production environments.

## Getting a Token

Tokens are user-specific and grant delegated access. To acquire one:

1. Direct the user to the authorization endpoint with a URL like this:
   ```
   https://trello.com/1/authorize?expiration=never&scope=read,write,account&response_type=token&key={YourAPIKey}
   ```
   - Customize parameters such as `expiration` (options: `1hour`, `1day`, `30days`, or `never`), `scope` (`read`, `write`, `account` - comma-separated for multiple scopes), and optionally `name` for your app's name.
2. The user will be prompted to log in (if needed) and click "Allow" to grant access.
3. Upon approval, the user is redirected to a success page displaying the token (or handled via callback methods like `postMessage` or `fragment` for web apps, with a `return_url` parameter).

Tokens provide full access to the user's account based on the granted scopes, so they must be stored securely and never exposed publicly.

## Using the Key and Token in API Requests

Once you have both, authenticate requests to the Trello REST API (base URL: `https://api.trello.com/1/`) by including them in one of these ways:

- **Query Parameters**: Append `?key={apiKey}&token={apiToken}` to the URL. Example for getting a member's details:
  ```
  GET https://api.trello.com/1/members/me?key={apiKey}&token={apiToken}
  ```
- **Authorization Header**: Use OAuth-style formatting:
  ```
  Authorization: OAuth oauth_consumer_key="{apiKey}", oauth_token="{apiToken}"
  ```
- **Request Body**: For methods like POST or PUT, include `key` and `token` as fields in the body (e.g., in JSON or form data).

All requests must use HTTPS. If a token is invalid or revoked, you'll get a 401 Unauthorized response.

## OAuth 1.0 Support

For integrations requiring full OAuth flow (e.g., without manual token copying), Trello supports OAuth 1.0:

- You'll need an application secret (available in the API Key tab of your Power-Up admin).
- Use these endpoints:
  - Request token: `https://trello.com/1/OAuthGetRequestToken`
  - Authorize: `https://trello.com/1/OAuthAuthorizeToken`
  - Access token: `https://trello.com/1/OAuthGetAccessToken`

This flow involves signing requests with your key and secret, redirecting the user for approval, and exchanging for an access token.

## Token Management and Security

- **Scopes**: `read` for viewing data, `write` for modifications, `account` for email access and notifications.
- **Revocation**: Users can revoke tokens via their Trello account settings (https://trello.com/{username}/account > Applications). You can also delete tokens programmatically via the `/1/tokens` API.
- **Best Practices**: Always use secure storage for tokens, configure allowed origins in your Power-Up settings to prevent redirect vulnerabilities, and handle token expiration gracefully by re-authorizing users.

For full details and examples, refer to the official [Trello API documentation](https://developer.atlassian.com/cloud/trello/guides/rest-api/api-introduction/). If you're building an integration, start with simple key/token auth before moving to OAuth if needed.

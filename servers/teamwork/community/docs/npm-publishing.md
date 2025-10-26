# Publishing to npm

This project uses GitHub Actions to automatically publish new releases to npm when a GitHub release is created.

## Setup Instructions

To set up automatic npm publishing, you need to configure an npm access token as a GitHub repository secret.

### Creating an npm Access Token

1. Log in to your npm account at [npmjs.com](https://www.npmjs.com/)
2. Navigate to your account settings by clicking on your profile picture and selecting "Access Tokens"
3. Click "Generate New Token"
4. Select "Publish" as the token type
5. Provide a name for your token (e.g., "GitHub Actions")
6. Click "Generate Token"
7. Copy the generated token (you won't be able to see it again!)

### Adding the Token to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to "Settings" > "Secrets and variables" > "Actions"
3. Click "New repository secret"
4. Enter `NPM_TOKEN` as the name
5. Paste your npm token as the value
6. Click "Add secret"

## Publishing Process

Once the token is set up, the publishing process works as follows:

1. Update the version in `package.json`
2. Commit and push your changes
3. Create a new GitHub release (this triggers the workflow)
4. The GitHub Action will:
   - Check out the code
   - Set up Node.js
   - Install dependencies
   - Build the project
   - Publish to npm using the stored token

## Troubleshooting

If the npm publishing fails, check the following:

- Verify that the `NPM_TOKEN` secret is correctly set in your repository
- Ensure the package version in `package.json` is not already published
- Check that the package name in `package.json` is available on npm
- Review the GitHub Actions logs for specific error messages

For more information, see the [GitHub Actions documentation](https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages)

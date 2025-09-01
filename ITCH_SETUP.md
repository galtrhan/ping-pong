# Itch.io Publishing Setup

This guide explains how to set up automatic publishing to itch.io using GitHub Actions.

## Prerequisites

1. An itch.io account
2. A game project created on itch.io
3. An itch.io API key

## Setup Steps

### 1. Create Your Game on Itch.io

1. Go to [itch.io](https://itch.io) and log in
2. Click "Upload new project" or go to your dashboard
3. Fill in your game details:
   - **Title**: Ping Pong Game
   - **Project URL**: Choose a URL like `your-username/ping-pong`
   - **Classification**: Game
   - **Kind of project**: HTML (for web games)
4. You can save as draft for now - we'll upload files via the GitHub Action

### 2. Get Your Itch.io API Key

1. Go to [itch.io API keys page](https://itch.io/user/settings/api-keys)
2. Click "Generate new API key"
3. Give it a name like "GitHub Actions"
4. Copy the generated key (keep it secure!)

### 3. Add the API Key to GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `ITCH_IO_API_KEY`
5. Value: Paste your itch.io API key
6. Click **Add secret**

### 4. Run the Workflow

1. Go to your repository's **Actions** tab
2. Click **Publish to Itch.io** workflow
3. Click **Run workflow**
4. Fill in the parameters:
   - **itch_user**: Your itch.io username
   - **itch_game**: Your game's URL name (e.g., "ping-pong")
   - **version_name**: Optional version identifier
   - **channel**: Usually "html" for web games

## Workflow Parameters Explained

- **itch_user**: Your itch.io username (appears in your profile URL)
- **itch_game**: The game identifier from your project URL
  - If your game URL is `https://username.itch.io/my-game`, then use `my-game`
- **version_name**: Optional version string (e.g., "v1.0.0", "alpha-1")
- **channel**: The upload channel:
  - `html` - For web games that run in browser
  - `windows` - For Windows executables
  - `mac` - For macOS builds
  - `linux` - For Linux builds

## Example

If your itch.io page will be `https://johndoe.itch.io/ping-pong-game`, then:
- **itch_user**: `johndoe`
- **itch_game**: `ping-pong-game`
- **channel**: `html`

## What Happens During Publishing

1. The workflow builds your game using the existing `deploy.sh` script
2. Extracts the game files for itch.io
3. Uses Butler (itch.io's CLI tool) to upload the game
4. Your game will be updated on itch.io with the new build

## Troubleshooting

### "Authentication failed"
- Check that your `ITCH_IO_API_KEY` secret is set correctly
- Make sure the API key hasn't expired

### "Project not found"
- Verify your `itch_user` and `itch_game` parameters match your itch.io project URL exactly
- Make sure the project exists on itch.io (even if it's just a draft)

### "Build failed"
- Check the workflow logs in the Actions tab
- Ensure your game builds successfully locally with `./deploy.sh`

## Tips

- You can run this workflow multiple times to update your game
- Each upload will create a new build on itch.io
- Use meaningful version names to track your releases
- The workflow also saves build artifacts in GitHub for 7 days
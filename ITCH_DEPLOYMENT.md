# Itch.io Automatic Deployment Setup

This guide will help you set up automatic deployment to itch.io using GitHub Actions.

## Prerequisites

1. **Itch.io account** and a **game project** created on itch.io
2. **GitHub repository** with your Phaser ping-pong game
3. **Butler API key** from itch.io

## Step 1: Create Your Game on Itch.io

1. Go to [itch.io](https://itch.io) and log in
2. Click "Create new project"
3. Fill out basic information:
   - **Title**: Your game name (e.g., "Ping Pong Game")
   - **Project URL**: This will be your game's slug (e.g., `ping-pong-game`)
   - **Classification**: Game
   - **Kind of project**: HTML
   - Check "This file will be played in the browser"
4. **Save & view page** - note your game URL: `https://yourusername.itch.io/your-game-name`

## Step 2: Get Your Butler API Key

1. Go to [itch.io API Keys](https://itch.io/user/settings/api-keys)
2. Click "Generate new API key"
3. Give it a name like "GitHub Actions Deploy"
4. **Copy the API key** - you'll need it for GitHub secrets

## Step 3: Set Up GitHub Secrets

In your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"** and add these three secrets:

### Required Secrets:

| Secret Name | Value | Example |
|-------------|-------|---------|
| `ITCH_IO_API_KEY` | Your itch.io API key from Step 2 | `abc123def456...` |
| `ITCH_IO_USERNAME` | Your itch.io username | `yourusername` |
| `ITCH_GAME` | Your game's project slug | `ping-pong-game` |

## Step 4: How It Works

The GitHub Action (`publish-to-itch.yml`) will:

1. **Build** your game using the existing `deploy.sh` script
2. **Extract** the built files for itch.io
3. **Upload** to itch.io using butler
4. **Set** the correct channel (`html5`)
5. **Version** the upload with your git tag
6. **Create** a GitHub release with itch.io play links (for tag-based deploys)

## Step 5: Deploy Your Game

### Option A: Tag-based Release (Recommended)
```bash
git tag v1.0.0
git push origin v1.0.0
```

### Option B: Manual Trigger
1. Go to **Actions** tab in your GitHub repo
2. Select **"Publish to Itch.io"** workflow
3. Click **"Run workflow"**
4. Optionally enter a version name (defaults to latest git tag)
5. Click **"Run workflow"**

## What Happens Automatically

✅ **Game is built** with flattened structure  
✅ **Uploaded to itch.io** as HTML5 game  
✅ **Set as playable** in browser automatically  
✅ **Versioned** with your git tag  
✅ **Old versions** are kept in itch.io's channel history  
✅ **GitHub release** created with download link  

## Itch.io Channel Management

Butler automatically creates and manages an `html5` channel for your game. Each deployment:

- **Replaces** the current live version
- **Keeps** old versions in channel history
- **Updates** the playable version immediately
- **Maintains** all your itch.io settings

## Troubleshooting

### Common Issues:

**"Invalid API key"**
- Double-check your `ITCH_IO_API_KEY` secret
- Make sure you copied the full key from itch.io

**"Game not found"**
- Verify `ITCH_IO_USERNAME` matches your exact username
- Verify `ITCH_GAME` matches your game's URL slug
- Make sure your game project exists on itch.io

**"Build failed"**
- Check that your `package.json` and `deploy.sh` work locally
- Ensure all game files are committed to git

### Testing Locally:
```bash
# Test your build script
./deploy.sh

# Verify the zip contains correct files
unzip -l game.zip
```

## Benefits of This Setup

🚀 **Zero Manual Work** - Tag and push, game is live  
🎮 **Always Playable** - Automatic HTML5 configuration  
📦 **Consistent Builds** - Same process every time  
🔄 **Version Control** - Track deployments with git tags  
📱 **Cross-Platform** - Works in any browser  
⚡ **Fast Updates** - Deploy in minutes, not hours  

## Your Game URLs

After setup, your game will be available at:
- **Play**: `https://[ITCH_IO_USERNAME].itch.io/[ITCH_GAME]`
- **Admin**: `https://itch.io/game/edit/[game-id]` (found in itch.io dashboard)

## Next Steps

1. Set up the GitHub secrets (most important!)
2. Create a test release: `git tag v0.1.0 && git push origin v0.1.0`
3. Watch the GitHub Actions run
4. Play your game on itch.io!
5. Share your itch.io link with players

---

**Need help?** Check the GitHub Actions logs for detailed error messages, or verify your secrets are set correctly.
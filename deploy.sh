#!/bin/bash

# Create temporary directory
mkdir -p temp_deploy

# Copy HTML file as index.html (itch.io expects this name)
cp index.html temp_deploy/index.html

# Copy all game files
cp game.js temp_deploy/
cp AudioManager.js temp_deploy/
cp -r scenes/ temp_deploy/
cp -r assets/ temp_deploy/

# Create a flattened structure for better itch.io compatibility
# Copy Phaser directly to root instead of nested node_modules
cp node_modules/phaser/dist/phaser.min.js temp_deploy/

# Update the HTML file to use the flattened structure
sed -i 's|node_modules/phaser/dist/phaser.min.js|phaser.min.js|g' temp_deploy/index.html

# Create zip archive
cd temp_deploy
zip -r ../game.zip .
cd ..

# Clean up
rm -rf temp_deploy

echo "Deployment package created: game.zip"
echo "This package is ready for itch.io upload or local play"
echo "For itch.io: Set 'Kind of project' to 'HTML' and check 'This file will be played in the browser'"

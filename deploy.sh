#!/bin/bash

# Create temporary directory
mkdir -p temp_deploy

# Copy required files
cp game.js temp_deploy/
cp index.html temp_deploy/
cp -r scenes/ temp_deploy/
cp -r assets/ temp_deploy/

# Create node_modules directory and copy only phaser
mkdir -p temp_deploy/node_modules/phaser/dist
cp node_modules/phaser/dist/phaser.min.js temp_deploy/node_modules/phaser/dist/

# Create zip archive
cd temp_deploy
zip -r ../game.zip .
cd ..

# Clean up
rm -rf temp_deploy

echo "Deployment package created: game.zip" 
#!/bin/bash

# Simple installation script that can be piped from curl
# Usage: curl -fsSL https://sudhirkumar.in/linux/install.sh | bash

set -e

echo "Installing aiedit v0.1.1..."

# Download and install in one step
TEMP_DEB="$(mktemp)"
trap 'rm -f $TEMP_DEB' EXIT

# Using your domain
curl -fsSL https://sudhirkumar.in/linux/aiedit_0.1.1_amd64.deb -o "$TEMP_DEB"

# Install dependencies
apt-get update
apt-get install -y libwebkit2gtk-4.1-0 libgtk-3-0

# Install the package
dpkg -i "$TEMP_DEB" || apt-get install -f -y

echo "aiedit has been successfully installed!"
echo "Run 'aiedit' to start the application."
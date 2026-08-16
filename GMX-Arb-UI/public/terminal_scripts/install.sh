#!/bin/bash

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "Git is not installed. Please install Git by following the instructions at https://git-scm.com/download/mac and run this script again."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python is not installed. Please install Python from https://www.python.org/downloads/macos/ and run this script again."
    exit 1
fi

# Clone the repository
cd ~
git clone -b backend_flask_server https://github.com/50shadesofgwei/funding-rate-arbitrage.git
cd funding-rate-arbitrage

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -e .

# Rename example.env to .env
mv "example.env" ".env" 2>/dev/null

# Run the project UI
echo "Installation complete. Running the project UI..."
project-run-ui

# Instructions for connecting to the botlsof
echo "Look for a URL like http://127.0.0.1:6969 in the console output above."
echo "Copy that URL and use it to connect to the bot'"'"'s web interface."' > install.sh && chmod +x install.sh && ./install.sh
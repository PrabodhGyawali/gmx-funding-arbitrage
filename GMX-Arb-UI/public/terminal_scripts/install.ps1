# Check if Git is installed
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Git is not installed. Please install Git from https://git-scm.com/download/win and run this script again."
    exit
}

# Check if Python is installed
if (!(Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "Python is not installed. Please install Python from https://www.python.org/downloads/windows/ and run this script again."
    exit
}

# Clone the repository
Set-Location C:\
git clone -b backend_flask_server https://github.com/50shadesofgwei/funding-rate-arbitrage.git
Set-Location funding-rate-arbitrage

# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -e .

# Rename example.env to .env
Rename-Item -Path "example.env" -NewName ".env" -ErrorAction SilentlyContinue

# Run the project UI
Write-Host "Installation complete. Running the project UI..."
project-run-ui

# Instructions for connecting to the bot
Write-Host "Look for a URL like http://127.0.0.1:6969 in the console output above."
Write-Host "Copy that URL and use it to connect to the bot's web interface."
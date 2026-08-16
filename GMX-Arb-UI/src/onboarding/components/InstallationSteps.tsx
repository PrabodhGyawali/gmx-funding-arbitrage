import React, { useState } from 'react'
import { Box, Typography, Paper, Button, TextField, Snackbar, ToggleButton, ToggleButtonGroup, IconButton, Tooltip } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import BotStatusIndicator from '../../components/NavBarSide/BotStatusIndicator'
import { useSocket } from '../../Context/SocketContext'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Link } from 'react-router-dom'
import { saveAs } from 'file-saver';
import DownloadIcon from '@mui/icons-material/Download';



export const ConnectToBot: React.FC = () => {
    const {connected, setBackendUrl} = useSocket();
    const [url, setUrl] = useState('')
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [error, setError] = useState('')

    const validateUrl = (input: string) => {
        const urlRegex = /^(https?:\/\/)?(localhost|((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6})(:\d{1,5})?$/;
        return urlRegex.test(input);
    }

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUrl = e.target.value;
        setUrl(newUrl);
        if (newUrl && !validateUrl(newUrl)) {
            setError('Invalid URL format. Please enter a valid IP address, localhost, or DNS name with an optional port (1-65535).');
        } else {
            setError('');
        }
    }

    const handleUrlSubmit = () => {
        if (validateUrl(url)) {
            localStorage.setItem('backendURL', url)
            setBackendUrl(url)
            setSnackbarMessage('URL submitted successfully!')
            setSnackbarOpen(true)
        } else {
            setSnackbarMessage('Invalid URL format. Please check and try again.')
            setSnackbarOpen(true)
        }
    }

    return (
        <>
            <Typography variant='h5' mt={3}>Find the URL</Typography>
            <Typography>
                Check the terminal console output for a url like <strong>http://127.0.0.1:6969</strong>.
                Copy that url as it is the address of the bot's web interface.
            </Typography>
            <Box mt={2} display="flex" alignItems="center">
                <TextField
                    label="Paste URL here"
                    variant="outlined"
                    value={url}
                    onChange={handleUrlChange}
                    sx={{ mr: 2, width: '50%' }}
                    error={!!error}
                    helperText={error}
                />
                <Button variant="contained" onClick={handleUrlSubmit} disabled={!!error || !url}>
                    Connect
                </Button>
            </Box>

            <Typography variant='h6' mt={3}>Check Bot Connection</Typography>
            <Typography>
                Look for the green below showing if the bot is connected.
            </Typography>
            <BotStatusIndicator isConnected={connected} />

            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </>
    )
}

export const TerminalBox: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(children as string);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Paper 
            elevation={3} 
            sx={{ 
                bgcolor: '#000', 
                color: '#0f0', 
                p: 2, 
                my: 2, 
                position: 'relative',
                minWidth: '300px',
                maxWidth: '800px',
                overflowX: 'hidden',
                '&::-webkit-scrollbar': {
                    height: '8px',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#0f0',
                    borderRadius: '4px',
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: '#333',
                },
            }}
        >
            <Typography 
                variant="body2" 
                sx={{ 
                    fontFamily: 'monospace', 
                    whiteSpace: 'nowrap', 
                    paddingRight: '30px', 
                    overflowX: 'auto',
                    width: '95%',
                }}
            >
                {children}
            </Typography>
            <Tooltip title={copied ? "Copied!" : "Copy to clipboard"} placement="top">
                <IconButton 
                    onClick={handleCopy}
                    sx={{ 
                        position: 'absolute', 
                        top: 5, 
                        right: 5, 
                        color: '#0f0',
                        '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.1)'
                        }
                    }}
                >
                    <ContentCopyIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </Paper>
    )
}

const InstallationSteps = () => {
    const [os, setOs] = useState<'mac' | 'windows'>('windows')
    const [installMethod, setInstallMethod] = useState<'manual' | 'automated'>('automated')

    const handleOsChange = () => {
        const newOs = os === "windows" ? "mac" : "windows"
        setOs(newOs);
    };

    const handleInstallMethodChange = (method: 'manual' | 'automated') => {
        setInstallMethod(method);
    };

    const downloadScript = (os: 'windows' | 'mac') => {
        const scriptPath = os === 'windows' ? '/terminal_scripts/install.ps1' : '/terminal_scripts/install.sh';
        const fileName = os === 'windows' ? 'install.ps1' : 'install.sh';
      
        fetch(scriptPath)
          .then(response => response.blob())
          .then(blob => {
            saveAs(blob, fileName);
          })
          .catch(error => console.error('Error downloading the script:', error));
      };

    const renderAutomatedScript = () => {
        const scriptContent = os === 'mac' ? (
            `echo '#!/bin/bash
    
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
    
    # Instructions for connecting to the bot
    echo "Look for a URL like http://127.0.0.1:5000 in the console output above."
    echo "Copy that URL and use it to connect to the bot'"'"'s web interface."' > install.sh && chmod +x install.sh && ./install.sh`
        ) : (
            `# Check if Git is installed
    if (!(Get-Command git -ErrorAction SilentlyContinue)) {
        Write-Host "Git is not installed. Please install Git from https://git-scm.com/download/win and run this script again."
        exit
    }
    
    # Check if Python is installed
    if (!(Get-Command python -ErrorAction SilentlyContinue)) {
        Write-Host "Python is not installed. Please install Python from https://www.python.org/downloads/windows/ and run this script again."
        exit
    }
    
    # Move to user directory
    cd ~
    
    # Clone the repository
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
    Write-Host "Copy that URL and use it to connect to the bot's web interface."`
        );
    
        return (
            <>
                <TerminalBox>
                    {scriptContent}
                </TerminalBox>
                <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={() => downloadScript(os)}
                    sx={{ mt: 2 }}
                >
                    Download {os === 'windows' ? 'PowerShell' : 'Bash'} Script
                </Button>
            </>
        );
    };


    return (
        <Paper sx={{display: 'flex', flexDirection: 'column', margin:'2em', padding: '1em', alignContent: 'center', justifyContent: 'center'}}>
            <Typography variant='h4' gutterBottom>Installation Steps</Typography>
            
            <Box mb={2}>
                <Typography variant='body1' mb={0.75} gutterBottom>Select your operating system:</Typography>
                <ToggleButtonGroup
                    value={os}
                    exclusive
                    onChange={() => handleOsChange()}
                    aria-label="operating system"
                >
                    <ToggleButton value="windows" aria-label="windows">
                        Windows
                    </ToggleButton>
                    <ToggleButton value="mac" aria-label="mac">
                        Mac
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Box mb={2}>
                <Typography variant='body1' mb={0.75} gutterBottom>Choose installation method:</Typography>
                <Button
                    variant={installMethod === 'manual' ? 'contained' : 'outlined'}
                    onClick={() => handleInstallMethodChange('manual')}
                    sx={{ mr: 1 }}
                >
                    Manual Installation
                </Button>
                <Button
                    variant={installMethod === 'automated' ? 'contained' : 'outlined'}
                    onClick={() => handleInstallMethodChange('automated')}
                >
                    Automated Script
                </Button>
            </Box>

            {installMethod === 'manual' ? (
                <>
                    <Typography variant='h5' mt={4}>Install Git</Typography>
                    {os === 'windows' ? (
                        <Typography>
                            Download Git from <Typography component={Link} to="https://git-scm.com/download/win" sx={{color: '#5ea0ee'}}>git-scm.com/download/win</Typography>.
                        </Typography>
                    ) : (
                        <>
                            <Typography>
                                Follow the steps in <a href="https://support.apple.com/en-gb/guide/terminal/apd5265185d-f365-44cb-8b09-71a064a42125/mac" target="_blank" rel="noopener noreferrer">support.apple.com/...</a> to open your terminal.
                            </Typography>
                            <Typography>
                                Download Git through the terminal by following the steps in <a href="https://git-scm.com/download/mac" target="_blank" rel="noopener noreferrer">git-scm.com/download/mac</a>.
                            </Typography>
                        </>
                    )}

                    {os === 'windows' ? (
                        <>
                            <Typography variant='h5' mt={3}>Open a Powershell Terminal</Typography>
                            <Typography>
                                Press <strong>Win + X</strong> and select <strong>Terminal</strong>
                            </Typography>
                        </>
                    ) : (
                        <></>
                    )}
                    
                    {os === 'windows' ? (
                        <TerminalBox>
                            cd ~
                        </TerminalBox>
                    ) : (
                        <TerminalBox>
                            cd ~/
                        </TerminalBox>
                    )}

                    <Typography variant='h5' mt={3}>Clone the Repository</Typography>
                    <TerminalBox>
                        git clone https://github.com/50shadesofgwei/SynthetixFundingRateArbitrage.git
                    </TerminalBox>

                    <Typography variant='h5' mt={3}>Navigate to the Project Directory</Typography>
                    <TerminalBox>cd SynthetixFundingRateArbitrage</TerminalBox>
                    <TerminalBox>git checkout -d backend_flask_server</TerminalBox>
                    <TerminalBox>git pull origin backend_flask_server</TerminalBox>
                    <Typography variant='h5' mt={3}>Install Python</Typography>
                    {os === 'windows' ? (
                        <Typography>
                            Install Python from the <Typography component={Link} to="https://www.python.org/downloads/windows/" sx={{color: '#5ea0ee'}}>Python website</Typography> or through the Microsoft Store.
                        </Typography>
                    ) : (
                        <Typography>
                            Install Python from <a href="https://www.python.org/downloads/macos/" target="_blank" rel="noopener noreferrer">python.org/downloads/macos/</a>
                        </Typography>
                    )}

                    <Typography variant='h5' mt={3}>Create a Virtual Environment</Typography>
                    <TerminalBox>python -m venv venv</TerminalBox>

                    <Typography variant='h5' mt={3}>Activate the Virtual Environment<span><Tooltip
                        title={
                            <Typography>
                                You must always activate your terminal or else the <strong>project-run-ui</strong> command won't work.
                            </Typography>
                        }
                    >
                        <IconButton>
                            <InfoOutlinedIcon />
                        </IconButton>   
                    </Tooltip></span></Typography>
                    {os === 'windows' ? (
                        <TerminalBox>.\venv\Scripts\Activate.ps1</TerminalBox>
                    ) : (
                        <TerminalBox>source venv/bin/activate</TerminalBox>
                    )}

                    <Typography variant='h5' mt={3}>Install Dependencies</Typography>
                    <TerminalBox>pip install -e .</TerminalBox>

                    <Typography variant='h5' mt={3}>Run the Project UI</Typography>
                    <TerminalBox>project-run-ui</TerminalBox>

                    <Typography>
                        Run the code below to rename the <strong>example.env</strong> file to <strong>.env<Tooltip
                        title={
                            <Typography>
                                The .env file is where your settings are going to be stored on your local computer. It will contains your API keys, private key and bot settings. It is important to keep this file secure.
                            </Typography>
                        }
                    >
                        <IconButton>
                            <InfoOutlinedIcon />
                        </IconButton>   
                    </Tooltip></strong>.
                    </Typography>
                    {os === 'windows' ? (
                        <TerminalBox>
                            Rename-Item -Path "example.env" -NewName ".env"
                        </TerminalBox>
                    ) : (
                        <TerminalBox>
                            mv "example.env" ".env"
                        </TerminalBox>
                    )}
                </>
            ) : (
                <Box>
                    <Typography variant='h5' mt={3}>Automated Installation Script</Typography>
                    <Typography>
                        Copy and run the following script in your terminal to automate the installation process:
                    </Typography>
                    {renderAutomatedScript()}
                </Box>
            )}

            <ConnectToBot />
        </Paper>
    )
}

export default InstallationSteps
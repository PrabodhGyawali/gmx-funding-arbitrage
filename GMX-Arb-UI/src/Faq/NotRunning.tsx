import { Box, Button, Typography } from "@mui/material"
import theme from "../styledComponent/customTheme"
import DownloadIcon from '@mui/icons-material/Download';
import { useOs, ToggleOS } from "../Context/DownloaderContext";

const downloadScript = (os: 'windows' | 'mac') => {
    const scriptPath = os === 'windows' ? '/terminal_scripts/kill.ps1' : '/terminal_scripts/kill.sh';
    const fileName = os === 'windows' ? 'kill.ps1' : 'kill.sh';
    const element = document.createElement('a');
    element.setAttribute('href', scriptPath);
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};

const NotRunning = () => {
    const { os } = useOs();

    return (
        <Box sx={{backgroundColor: theme.palette.background.paper, padding: 2}}>
            <Typography variant='body1' gutterBottom>Download and run the script that will force restart the bot.</Typography>
            <ToggleOS />
            <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => downloadScript(os)}
                sx={{ mt: 2 }}
            >
                Download {os === 'windows' ? 'PowerShell' : 'Bash'} Script
            </Button>
        </Box>
    )
}

export default NotRunning
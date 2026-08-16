import React, { useState, useEffect } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import ErrorIcon from '@mui/icons-material/Error';
import { 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Button,
  Tabs,
  Tab,
  Box,
  Tooltip,
  Alert
} from "@mui/material";
import BotSettings from './Settings/BotSettings';
import WalletSettings from './Settings/WalletSettings';
import ExchangeSettings from './Settings/ExchangeSettings';
import BotStatusIndicator from './NavBarSide/BotStatusIndicator';
import { useSocket } from '../Context/SocketContext';
import { ConnectToBot } from '../onboarding/components/InstallationSteps';
/**
 * Navbar button to access settings dialog
 */
const SettingsButton: React.FC = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [hasError, setHasError] = useState<boolean>(false);
    const { connected } = useSocket();

    const checkForErrors = async () => {
        try {
            const backendURL = localStorage.getItem('backendURL');
            const response = await fetch(`${backendURL}/settings/find`);
            if (!response.ok) {
                throw new Error('Settings error');
            }
            setHasError(false);
        } catch (error) {
            setHasError(true);
        }
    };

    useEffect(() => {
        if (connected) {
            checkForErrors();
        } else {
            setHasError(true);
        }
    }, [connected]);

    const handleOpen = (): void => {
        setOpen(true);
    };

    const handleClose = (): void => {
        setOpen(false);
    };

    return (
        <>
            <Tooltip title={hasError ? "Settings error detected" : "Settings"}>
                <IconButton onClick={handleOpen}>
                    {hasError ? <ErrorIcon sx={{ fontSize: 40, color: 'error.main' }} /> : <SettingsIcon sx={{ fontSize: 40 }} />}
                </IconButton>
            </Tooltip>
            <SettingsDialog open={open} onClose={handleClose} hasError={hasError} />
        </>
    );
}

interface SettingsDialogProps {
    open: boolean;
    onClose: () => void;
    hasError: boolean;
}


const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onClose, hasError }) => {
    const [tabValue, setTabValue] = useState<number>(0);
    const { connected } = useSocket();
    const [socketDialogMessage, setSocketDialogMessage] = useState(false);

    const handleTabChange = ( newValue: number): void => {
        setTabValue(newValue);
    };

    const socketDialog = () => (
        <Dialog open={socketDialogMessage} onClose={() => setSocketDialogMessage(false)}>
            <DialogTitle>Bot Status</DialogTitle>
            <DialogContent>
                <ConnectToBot />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setSocketDialogMessage(false)}>Close</Button>
            </DialogActions>
        </Dialog>
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignContent: 'center'}}>
                <DialogTitle>Settings</DialogTitle>
                <Tooltip title="Make sure that you are connected to bot to get current settings and set the settings">
                    <IconButton onClick={() => setSocketDialogMessage(prev => !prev)}>
                        <BotStatusIndicator isConnected={connected} />
                    </IconButton>
                </Tooltip>
            </Box>
            {socketDialog()}
            <DialogContent>
                {hasError && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        There is an error in the current settings configuration. Please review and update your settings.
                    </Alert>
                )}
                <Tabs value={tabValue} onChange={(_, newValue) => handleTabChange(newValue)}>
                    <Tab label="Exchange" />
                    <Tab label="Bot" />
                    <Tab label="Env" />
                </Tabs>
                <Box sx={{ mt: 2 }}>
                    {tabValue === 0 && <ExchangeSettings />}
                    {tabValue === 1 && <BotSettings />}
                    {tabValue === 2 && <WalletSettings />}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}


export { SettingsButton };
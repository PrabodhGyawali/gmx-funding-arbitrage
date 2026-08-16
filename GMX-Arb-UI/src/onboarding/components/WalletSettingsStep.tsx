import React, { useState, useEffect } from 'react';
import { Typography, TextField, Box, Paper, 
          List, ListItem, ListItemIcon, ListItemText, 
          Stepper, Step, StepLabel, StepContent, Button,
          Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
          Tooltip, FormControlLabel, Checkbox } from '@mui/material';
import { UserData, WalletConfig, NetworkType } from '../types';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import PrivateKeyInstructions from './PrivateKeyInstructions';
import theme from '../../styledComponent/customTheme';
import BotStatusIndicator from '../../components/NavBarSide/BotStatusIndicator'
import { useSocket } from '../../Context/SocketContext';

interface WalletSettingsStepProps {
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  onValidationChange: (isValid: boolean) => void;
}

interface NetworkInfo {
  name: string;
  chainId: NetworkType;
  color: string;
}

const networks: NetworkInfo[] = [
  { name: 'Arbitrum One', chainId: NetworkType.Mainnet, color: '#28a0f0' },
  { name: 'Arbitrum Sepolia', chainId: NetworkType.Sepolia, color: '#8A2BE2' }
];

const AlchemySetupSteps = [
  {
    label: 'Create Alchemy Account',
    description: 'Go to Alchemy.com and sign up for a free account.',
  },
  {
    label: 'Create New App',
    description: 'Once logged in, click on "Create App" and select Arbitrum as the chain.',
  },
  {
    label: 'Get API Key',
    description: 'After creating the app, find and copy your API key.',
  },
  {
    label: 'Use as RPC URL',
    description: 'Use the Alchemy API key as your Arbitrum RPC URL in the field below.',
  },
];



const WalletSettingsStep: React.FC<WalletSettingsStepProps> = ({ setUserData, onValidationChange }) => {
  const {connected} = useSocket();

  const [walletConfig, setWalletConfig] = useState<WalletConfig>({
    address: '',
    arbitrum_rpc: '',
    base_rpc: '',
    network: null,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof WalletConfig, string>>>({});
  const [privateKeyConfirmed, setPrivateKeyConfirmed] = useState(false);

  const handlePrivateKeyConfirmation = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrivateKeyConfirmed(event.target.checked);
  };

  const validationRules: Partial<Record<keyof WalletConfig, { regex: RegExp; errorMessage: string }>> = {
    address: { 
        regex: /^0x[a-fA-F0-9]{40}$/, 
        errorMessage: 'Invalid Ethereum address format' 
    },
    arbitrum_rpc: { 
        regex: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, 
        errorMessage: 'Invalid URL format' 
    },
    base_rpc: {
        regex: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, 
        errorMessage: 'Invalid URL format'
    }
  };

  const validateField = (name: keyof WalletConfig, value: string | NetworkType | null): string => {
    if (value === null || value === '') return 'This field is required';
    
    if (name === 'address' || name === 'arbitrum_rpc' || name === 'base_rpc') {
        const rule = validationRules[name];
        if (rule && typeof value === 'string') {
            return rule.regex.test(value) ? '' : rule.errorMessage;
        }
    }
    
    if (name === 'network') {
        return value === null ? 'A network must be selected' : '';
    }
    
    return '';
};

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const newValue = name === 'chain_id_base' ? parseInt(value, 10) || 0 : value;
    
    setWalletConfig(prev => ({
      ...prev,
      [name]: newValue,
    }));

    const error = validateField(name as keyof WalletConfig, value);
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleNetworkSelect = (network: NetworkType) => {
    setWalletConfig(prev => ({ ...prev, network }));
    setErrors(prev => ({ ...prev, network: '' }));
  };

  // Alchemy Setup
  const [activeStep, setActiveStep] = useState(0);
  // Helper Images
  const [rpcDialog, setRpcDialog] = useState<{open: boolean, type: "arbitrum" | "base"}>({
    open: false,
    type: "arbitrum"
  });

  const handleOpenRpcDialog = (type: 'arbitrum' | 'base') => {
    setRpcDialog({ open: true, type });
  };

  const handleCloseRpcDialog = () => {
    setRpcDialog({ open: false, type: 'arbitrum' });
  };

  const handleContinue = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  useEffect(() => {
    const isValid = Object.values(errors).every(error => !error) &&
                    walletConfig.address !== '' &&
                    walletConfig.arbitrum_rpc !== '' &&
                    walletConfig.base_rpc !== '' &&
                    walletConfig.network !== null;

    onValidationChange(isValid);
    
    setUserData(prevData => ({
      ...prevData,
      walletSettings: walletConfig,
    }));
  }, [walletConfig, errors, setUserData, onValidationChange]);

  return (
    <Box>      
      <BotStatusIndicator isConnected={connected}/>
      <Paper elevation={3} sx={{ p: 3, my: 3}}>
        <Typography variant="h6" gutterBottom><strong>IMPORTANT: Security Considerations</strong></Typography>
        <List>
          <ListItem>
            <ListItemIcon><WarningIcon color="error" /></ListItemIcon>
            <ListItemText primary="Never share your private key with anyone." />
          </ListItem>
          <ListItem>
            <ListItemIcon><InfoIcon color="primary" /></ListItemIcon>
            <ListItemText 
              primary="Review the backend client code"
              secondary="Make sure your private keys will be stored safely in python code. Ask trusted Developer or cyber security expert to review codebase."
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon><WarningIcon color="warning" /></ListItemIcon>
            <ListItemText 
              primary="Using without review"
              secondary="You use this bot at your own risk and cannot hold developers liable for vulnerabilities."
            />
          </ListItem>
        </List>
        <Typography variant="body2" sx={{ mt: 2 }}>
          The developers believe the private key field in <code>.env</code> is completely isolated and can only be changed by the user (last reviewed: <span style={{ color: 'red' }}>05/09/2024</span>).
        </Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          After reviewing the open-source backend code, open your filesystem: 
          <Box component="span" sx={{ 
            fontFamily: 'monospace', 
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            p: 0.5, 
            borderRadius: 1,
            mx: 1
          }}>
            C:\funding-rate-arbitrage\.env
          </Box> 
          and paste your private key in the <Typography component="span" color="url.main">PRIVATE_KEY</Typography> field.
        </Typography>
        <PrivateKeyInstructions />
      </Paper>

      <Tooltip
        title={
          <React.Fragment>
            <Typography color="inherit">Security Recommendation</Typography>
            <Typography variant="body2">
              We recommend using a new wallet address specifically for this bot. 
              This practice isolates your trading activities and limits potential 
              risks. In case of any security compromise, your main assets in other 
              wallets remain unaffected.
            </Typography>
          </React.Fragment>
        }
        arrow
        placement="top-start"
      >
        <TextField
          fullWidth
          margin="normal"
          name="address"
          label="Your New Wallet Address"
          value={walletConfig.address}
          onChange={handleChange}
          error={!!errors.address}
          helperText={errors.address}
          InputProps={{
            endAdornment: (
              <IconButton edge="end">
                <InfoOutlinedIcon color="primary" />
              </IconButton>
            ),
          }}
        />
      </Tooltip>
      <Box sx={{ mt: 2, mb: 2, display: 'flex', alignItems: 'center' }}>
        <WarningIcon color="warning" sx={{ mr: 1 }} />
        <Typography variant="body2" color="warning.main">
          Important: Add your private key to the file 
          <Box component="span" sx={{ 
            fontFamily: 'monospace', 
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            p: 0.5, 
            borderRadius: 1,
            mx: 1
          }}>
            C:\funding-rate-arbitrage\.env
          </Box> 
          in the 
          <Box component="span" sx={{ 
            fontFamily: 'monospace', 
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            p: 0.5, 
            borderRadius: 1,
            mx: 1
          }}>
            PRIVATE_KEY
          </Box> 
          field.
        </Typography>
      </Box>
      <FormControlLabel
        control={
          <Checkbox
            checked={privateKeyConfirmed}
            onChange={handlePrivateKeyConfirmation}
            name="privateKeyConfirmed"
            color="primary"
          />
        }
        label={
          <Typography variant="body2">
            I confirm that I have added my private key to the required file and understand the security implications.
          </Typography>
        }
      />
      <Paper elevation={3} sx={{ p: 3, my: 3}}>
        <Typography variant="h6" gutterBottom><strong>Select Network</strong></Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', my: 2 }}>
          {networks.map((network) => (
            <Box key={network.chainId} sx={{ textAlign: 'center', width: '45%' }}>
              <Button
                onClick={() => handleNetworkSelect(network.chainId)}
                sx={{
                  width: '100%',
                  py: 2,
                  bgcolor: walletConfig.network === network.chainId 
                    ? '#1a1a1a'  // Darker color when selected
                    : network.color,
                  color: '#ffffff',
                  '&:hover': {
                    bgcolor: walletConfig.network === network.chainId 
                      ? '#000000'  // Even darker on hover when selected
                      : '#4a4a4a',  // Darker shade on hover when not selected
                  },
                  transition: 'background-color 0.3s',
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {network.name}
                </Typography>
              </Button>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Chain ID: {network.chainId}
              </Typography>
            </Box>
          ))}
        </Box>
        {errors.network && (
          <Typography color="error" variant="caption">
            {errors.network}
          </Typography>
        )}
      </Paper>

      <Paper elevation={3} sx={{ p: 3, my: 3 }}>
        <Typography variant="h6" gutterBottom><strong>Setting up <a href="https://alchemy.com">Alchemy</a> API Key</strong></Typography>
        <Stepper activeStep={activeStep} orientation="vertical">
          {AlchemySetupSteps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
              <StepContent>
                <Typography>{step.description}</Typography>
                {index === AlchemySetupSteps.length - 1 && (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                      <TextField
                        fullWidth
                        margin="normal"
                        name="arbitrum_rpc"
                        label="Arbitrum RPC URL"
                        value={walletConfig.arbitrum_rpc}
                        onChange={handleChange}
                        error={!!errors.arbitrum_rpc}
                        helperText={errors.arbitrum_rpc}
                      />
                      <IconButton onClick={() => handleOpenRpcDialog('arbitrum')} sx={{ ml: 1 }}>
                        <HelpOutlineIcon />
                      </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <TextField
                      fullWidth
                      margin="normal"
                      name="base_rpc"
                      label="Base RPC URL"
                      value={walletConfig.base_rpc}
                      onChange={handleChange}
                      error={!!errors.base_rpc}
                      helperText={errors.base_rpc}
                    />
                      <IconButton onClick={() => handleOpenRpcDialog('base')} sx={{ ml: 1 }}>
                        <HelpOutlineIcon />
                      </IconButton>
                    </Box>
                  </>
                )}
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      variant="contained"
                      onClick={handleContinue}
                      sx={{ mt: 1, mr: 1 }}
                      disabled={index === AlchemySetupSteps.length - 1 && !!errors.arbitrum_rpc}
                    >
                      {index === AlchemySetupSteps.length - 1 ? 'Finish' : 'Continue'}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === AlchemySetupSteps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>All steps completed - you&apos;re finished</Typography>
            <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
              Reset
            </Button>
          </Paper>
        )}
      </Paper>

      <Dialog open={rpcDialog.open} onClose={handleCloseRpcDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          How to Find Your {rpcDialog.type === 'arbitrum' ? 'Arbitrum': 'Base'} RPC URL
          <IconButton
            aria-label="close"
            onClick={handleCloseRpcDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <img 
            src={rpcDialog.type === 'arbitrum' ? "/Alchemy1.png" : "/Alchemy2.png"}
            alt={`${rpcDialog.type === 'arbitrum' ? 'Arbitrum' : 'Base'} API Key Guide`}
            style={{ width: '100%', height: 'auto' }} 
          />
          <Typography variant="body1" mb={0.75} sx={{ mt: 2 }}>
            {rpcDialog.type === 'arbitrum' 
              ? "Note that if you want to use the test network, you can select Sepolia net."
              : "Follow these steps to set up your Base RPC URL using Alchemy."}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRpcDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      <TextField
        fullWidth
        margin="normal"
        name="arbitrum_rpc"
        label="Arbitrum RPC URL"
        value={walletConfig.arbitrum_rpc}
        onChange={handleChange}
        error={!!errors.arbitrum_rpc}
        helperText={errors.arbitrum_rpc}
      />
      <TextField
        fullWidth
        margin="normal"
        name="base_rpc"
        label="Base RPC URL"
        value={walletConfig.base_rpc}
        onChange={handleChange}
        error={!!errors.base_rpc}
        helperText={errors.base_rpc}
      />
    </Box>
  );
};

export default WalletSettingsStep;




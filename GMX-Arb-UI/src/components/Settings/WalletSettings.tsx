import React, { useState, useEffect } from 'react';
import { 
  Typography, TextField, Box, Button, Checkbox, 
  FormControlLabel, Tooltip, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { WalletConfig, NetworkType } from '../../onboarding/types';
import { useSocket } from '../../Context/SocketContext';

const networks = [
  { name: 'Arbitrum One', chainId: NetworkType.Mainnet, color: '#28a0f0' },
  { name: 'Arbitrum Sepolia', chainId: NetworkType.Sepolia, color: '#8A2BE2' }
];

const WalletSettings: React.FC = () => {
  const [walletConfig, setWalletConfig] = useState<WalletConfig>({
    address: '',
    arbitrum_rpc: '',
    base_rpc: '',
    network: null,
  });
  const [privateKeyConfirmed, setPrivateKeyConfirmed] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof WalletConfig, string>>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const { connected } = useSocket();

  const validateField = (name: keyof WalletConfig, value: string | NetworkType | null): string => {
    if (value === null || value === '') return 'This field is required';
    if (name === 'address' && !/^0x[a-fA-F0-9]{40}$/.test(value as string)) {
      return 'Invalid Ethereum address format';
    }
    if ((name === 'arbitrum_rpc' || name === 'base_rpc') && 
        !/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(value as string)) {
      return 'Invalid URL format';
    }
    return '';
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setWalletConfig(prev => ({ ...prev, [name]: value }));
    const error = validateField(name as keyof WalletConfig, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleNetworkSelect = (network: NetworkType) => {
    setWalletConfig(prev => ({ ...prev, network }));
    setErrors(prev => ({ ...prev, network: '' }));
  };

  const handlePrivateKeyConfirmation = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrivateKeyConfirmed(event.target.checked);
  };

  const handleSave = () => {
    if (connected && isValid) {
      const backendUrl = localStorage.getItem('backendURL');
      fetch(`${backendUrl}/settings/wallet-settings/set`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(walletConfig),
      })
    }
  };

  useEffect(() => {
    const validConfig = Object.values(errors).every(error => !error) &&
        walletConfig.address !== '' &&
        walletConfig.arbitrum_rpc !== '' &&
        walletConfig.base_rpc !== '' &&
        walletConfig.network !== null &&
                    privateKeyConfirmed;
    setIsValid(validConfig);
  }, [walletConfig, errors, privateKeyConfirmed]);

  return (
    <Box>
      <Tooltip title="Use a new wallet address for this bot to isolate trading activities and limit potential risks.">
        <TextField
          fullWidth
          margin="normal"
          name="address"
          label="Your Wallet Address"
          value={walletConfig.address}
          onChange={handleChange}
          error={!!errors.address}
          helperText={errors.address}
          InputProps={{
            endAdornment: <IconButton><InfoOutlinedIcon color="primary" /></IconButton>,
          }}
        />
      </Tooltip>

      <FormControlLabel
        control={
          <Checkbox
            checked={privateKeyConfirmed}
            onChange={handlePrivateKeyConfirmation}
            name="privateKeyConfirmed"
          />
        }
        label="I confirm that I have added my private key to the .env file"
      />

      <Box sx={{ my: 2 }}>
        <Typography variant="h6">Select Network</Typography>
        {networks.map((network) => (
          <Button
            key={network.chainId}
            onClick={() => handleNetworkSelect(network.chainId)}
            sx={{
              m: 1,
              bgcolor: walletConfig.network === network.chainId ? network.color : 'grey.300',
              color: walletConfig.network === network.chainId ? 'white' : 'black',
            }}
          >
            {network.name}
          </Button>
        ))}
      </Box>

      <Tooltip title="Enter your Arbitrum RPC URL from Alchemy">
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
      </Tooltip>

      <Tooltip title="Enter your Base RPC URL from Alchemy">
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
      </Tooltip>

      <Button 
        onClick={() => setIsDialogOpen(true)} variant="contained" sx={{ mt: 2 }}
        disabled={!isValid || !connected}  
      >
        Save Configuration
      </Button>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Confirm Wallet Configuration</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to save this wallet configuration?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WalletSettings;
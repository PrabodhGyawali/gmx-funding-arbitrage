import { useEffect, useState } from "react";
import { ExchangeConfig } from "../../onboarding/types";
import { useSocket } from "../../Context/SocketContext";
import { Box, FormControlLabel, Checkbox, Grid, TextField, Dialog, Typography, DialogTitle, Button, DialogContent, DialogActions } from "@mui/material";


const ExchangeSettings = () => {
    const { connected } = useSocket();

    const [isValid, setIsValid] = useState(false);
    const [exchangeConfig, setExchangeConfig] = useState<ExchangeConfig>({
        bybit: { apiKey: '', apiSecret: '', enabled: false },
        binance: { apiKey: '', apiSecret: '', enabled: false },
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [errors, setErrors] = useState({
        bybit: { apiKey: '', apiSecret: '' },
        binance: { apiKey: '', apiSecret: '' },
    });

    const apiKeyRegex = /^[A-Za-z0-9]{18,64}$/;
    const apiSecretRegex = /^[A-Za-z0-9]{32,64}$/;

    const validateField = (exchange: 'bybit' | 'binance', field: 'apiKey' | 'apiSecret', value: string) => {
        const regex = field === 'apiKey' ? apiKeyRegex : apiSecretRegex;
        if (!value && exchangeConfig[exchange].enabled) {
          return `${field === 'apiKey' ? 'API Key' : 'API Secret'} is required`;
        }
        if (value && !regex.test(value)) {
          return `Invalid ${field === 'apiKey' ? 'API Key' : 'API Secret'} format`;
        }
        return '';
    };
    
    const handleChange = (exchange: 'bybit' | 'binance', field: 'apiKey' | 'apiSecret' | 'enabled') => (
        event: React.ChangeEvent<HTMLInputElement>
      ) => {
        const value = field === 'enabled' ? event.target.checked : event.target.value;
        setExchangeConfig(prevSettings => ({
          ...prevSettings,
          [exchange]: {
            ...prevSettings[exchange],
            [field]: value,
          },
        }));
    
        if (field !== 'enabled') {
          setErrors(prevErrors => ({
            ...prevErrors,
            [exchange]: {
              ...prevErrors[exchange],
              [field]: validateField(exchange, field, value as string),
            },
          }));
        } else if (field === 'enabled' && !value) {
          // Clear errors when disabling an exchange
          setErrors(prevErrors => ({
            ...prevErrors,
            [exchange]: { apiKey: '', apiSecret: '' },
          }));
        }
    };

    const handleSave = () => {
        const backendUrl = localStorage.getItem('backendURL');
        fetch(`${backendUrl}/settings/exchange-settings/set`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(exchangeConfig)
        }).then(response => {
            if (response.ok) {
                setIsDialogOpen(false);
                alert('Exchange settings saved successfully');
            } else {
                throw new Error('Error saving exchange settings');
            }
        }).catch(error => {
            alert(`There was an error saving the exchange settings: ${error}`);
        });
    }

    const renderExchangeFields = (exchange: 'bybit' | 'binance') => (
        <Box mb={3}>
          <FormControlLabel
            control={
              <Checkbox
                checked={exchangeConfig[exchange].enabled}
                onChange={handleChange(exchange, 'enabled')}
              />
            }
            label={`Enable ${exchange.charAt(0).toUpperCase() + exchange.slice(1)} Client`}
          />
          {exchangeConfig[exchange].enabled && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  name={`apiKey${exchange}`}
                  label={`${exchange.charAt(0).toUpperCase() + exchange.slice(1)} API Key`}
                  value={exchangeConfig[exchange].apiKey}
                  onChange={handleChange(exchange, 'apiKey')}
                  error={!!errors[exchange].apiKey}
                  helperText={errors[exchange].apiKey}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  name={`apiSecret${exchange}`}
                  label={`${exchange.charAt(0).toUpperCase() + exchange.slice(1)} API Secret`}
                  type="password"
                  value={exchangeConfig[exchange].apiSecret}
                  onChange={handleChange(exchange, 'apiSecret')}
                  error={!!errors[exchange].apiSecret}
                  helperText={errors[exchange].apiSecret}
                />
              </Grid>
            </Grid>
          )}
        </Box>
    );

    useEffect(() => {
        const valid: boolean =
        (exchangeConfig.bybit.enabled || exchangeConfig.binance.enabled) &&
        (exchangeConfig.bybit.enabled && (exchangeConfig.bybit.apiKey.length > 7 && exchangeConfig.bybit.apiSecret.length > 10 )) ||
        (exchangeConfig.binance.enabled && (exchangeConfig.binance.apiKey.length > 7 && exchangeConfig.binance.apiSecret.length > 10)) &&
        Object.values(errors.bybit).every(error => error === '') &&
        Object.values(errors.binance).every(error => error === '');
        setIsValid(valid);

    }, [exchangeConfig, errors, isValid]);

    return (
        <Box>
            {renderExchangeFields('bybit')}
            <Button 
                onClick={() => setIsDialogOpen(true)} variant="contained" sx={{ mt: 2 }}
                disabled={!isValid || !connected}  
            >
                Save Configuration
            </Button>

            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogTitle>Confirm Wallet Configuration</DialogTitle>
                <DialogContent>
                <Typography>Are you sure you want to save this exchange configuration?</Typography>
                </DialogContent>
                <DialogActions>
                <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSave} variant="contained">Confirm</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default ExchangeSettings
import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import DeployCard from './DeployCard';
import { useSocket } from '../../Context/SocketContext';

interface ExchangeData {
  amount: string;
  tokenAddress: string;
  error: {
    amountError: boolean;
    addressError: boolean;
  };
  balance: string;
}

interface Exchanges {
  [key: string]: ExchangeData;
}

function DeploySection() {
  const { socket } = useSocket();

  const [exchanges, setExchanges] = useState<Exchanges>({
    Bybit: {
      amount: '',
      tokenAddress: '',
      error: { amountError: false, addressError: false },
      balance: '...'
    }
  });

  const validateAmount = (value: string): boolean => {
    const numValue = parseFloat(value);
    return !(isNaN(numValue) || numValue < 1);
  };

  const handleAmountChange = (exchange: string, value: string) => {
    const isValid = validateAmount(value);
    setExchanges(prev => ({
      ...prev,
      [exchange]: {
        ...prev[exchange],
        amount: value,
        error: { ...prev[exchange].error, amountError: !isValid }
      }
    }));
  };

  const handleAddressChange = (exchange: string, value: string) => {
    setExchanges(prev => ({
      ...prev,
      [exchange]: {
        ...prev[exchange],
        tokenAddress: value,
        error: { ...prev[exchange].error, addressError: false }
      }
    }));
  };

  const handleDeploy = (exchange: string) => {
    const backendUrl = localStorage.getItem('backendURL');
    const { amount, tokenAddress } = exchanges[exchange];
    const isValid = validateAmount(amount);
    if (isValid) {
      fetch(`${backendUrl}/collateral/deploy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ exchange, amount, tokenAddress }),
      });
    } else {
      setExchanges(prev => ({
        ...prev,
        [exchange]: { ...prev[exchange], error: { ...prev[exchange].error, amountError: true } }
      }));
    }
  };

  const fetchData = async (exchange: string) => {
    try {
      const backendUrl = localStorage.getItem('backendUrl');
      const response = await fetch(`${backendUrl}/collateral/${exchange}`);
      if (response.status === 200) {
        const data = await response.json();
        setExchanges(prev => ({
          ...prev,
          [exchange]: { ...prev[exchange], balance: data }
        }));
      }
    } catch (error) {
      setExchanges(prev => ({
        ...prev,
        [exchange]: { ...prev[exchange], error: { ...prev[exchange].error, amountError: true } }
      }));
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        Object.keys(exchanges).forEach(fetchData);
      });
    }
  }, [socket]);

  return (
    <Box sx={{
      height: '50vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Typography variant="h4" color="primary" sx={{ padding: '0em', textAlign: 'center' }}>Deploy Collateral</Typography>
      <Box sx={{
        flexGrow: 1,
        overflowY: 'auto',
        padding: '1em',
        '&::-webkit-scrollbar': {
          width: '0.4em'
        },
        '&::-webkit-scrollbar-track': {
          boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
          webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,.1)',
          outline: '1px solid slategrey'
        }
      }}>
        <Box className="deploy" sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2em',
          justifyContent: 'flex-start',
          alignItems: 'center',
          padding: '2em',
          backgroundColor: 'background.paper',
          borderRadius: '8px',
          minHeight: 'min-content',
          overflow: 'hidden',
        }}>
          {Object.entries(exchanges).map(([exchange, data]) => (
            <DeployCard
              key={exchange}
              exchange={exchange}
              data={data}
              onAmountChange={(value) => handleAmountChange(exchange, value)}
              onAddressChange={(value) => handleAddressChange(exchange, value)}
              onDeploy={() => handleDeploy(exchange)}
              exchangeLogo={`svg/${exchange.toLowerCase()}-logo.svg`}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default DeploySection;
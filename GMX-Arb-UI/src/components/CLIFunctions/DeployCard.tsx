import { Box, Button, TextField, InputAdornment, Card, CardContent, Avatar, Typography } from "@mui/material"
const sxInput = {
    width: '200px',
        '& .MuiOutlinedInput-root': {
        '& fieldset': {
        borderColor: 'secondary.main',
        },
        '&:hover fieldset': {
        borderColor: 'secondary.light',
        },
        '&.Mui-focused fieldset': {
        borderColor: 'secondary.dark',
        },
    },
    margin: '1em 0 0 0',
};

interface ExchangeData {
  amount: string;
  tokenAddress: string;
  error: {
    amountError: boolean;
    addressError: boolean;
  };
  balance: string;
}


interface DeployCardProps {
  exchange: string;
  data: ExchangeData;
  onAmountChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onDeploy: () => void;
  exchangeLogo: string;
}

const DeployCard: React.FC<DeployCardProps> = ({ 
  exchange, 
  data, 
  onAmountChange, 
  onAddressChange, 
  onDeploy, 
  exchangeLogo 
})=> {
  
  return (
    <Card sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1em',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar src={exchangeLogo} alt="Exchange Logo" sx={{ mr: 1 }} />
          <Typography variant="h6">{exchange}</Typography>
        </Box>

        <Typography variant="body1" fontWeight="bold" mb={2}>
          Balance: <span style={{ color: '#1976d2' }}>${data.balance}</span>
        </Typography>
        <TextField
          sx={sxInput}
          type="number"
          placeholder="Enter Amount"
          variant="outlined"
          color="secondary"
          value={data.amount}
          onChange={(e) => onAmountChange(e.target.value)}
          error={data.error.amountError}
          helperText={data.error.amountError ? "Amount must be 1 or greater" : ""}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />

        <TextField
          sx={sxInput}
          type="text"
          placeholder="Token Address"
          variant="outlined"
          color="secondary"
          value={data.tokenAddress}
          onChange={(e) => onAddressChange(e.target.value)}
          error={data.error.addressError}
          helperText={data.error.addressError ? "Invalid Token Address" : ""}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={onDeploy}
          fullWidth
          sx={{ mt: 2 }}
        >
          Deploy
        </Button>
      </CardContent>
    </Card>
  )
}

export default DeployCard

import { Run } from '../components/CLIFunctions';
import { SettingsButton } from './Settings';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, IconButton, useTheme, useMediaQuery, Button, Typography } from '@mui/material';
import BotStatusIndicator from './NavBarSide/BotStatusIndicator';
import NotificationButton from '../Notifications/NotificationButton';
import { restartBot } from '../onboarding/Onboarding';
import { useSocket } from '../Context/SocketContext';
import { useAccount } from '../Context/AccountContext';
import { useBotContext } from '../Context/BotContext';

function NavBarSide({ isConnected }: { isConnected: boolean }) {
  const navigateHome = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {connected} = useSocket();
  const {account} = useAccount();
  const {isRunning} = useBotContext();
  return (
    <>
      <Box
        className="nav"
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'row' : 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: isMobile ? 'auto' : '90vh',
          width: isMobile ? '100%' : 'auto',
          minWidth: isMobile ? 'auto' : '200px',
          maxWidth: isMobile ? 'none' : '300px',
          padding: isMobile ? '1em' : '2em 1em',
          flexWrap: isMobile ? 'wrap' : 'nowrap',
        }}
      >
        <Box
          className="nav-top"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            padding: '1em',
            flexDirection: isMobile ? 'row' : 'column',
          }}
        >
          <IconButton
            sx={{ padding: isMobile ? '0.5em' : '1em' }}
            onClick={() => {
              navigateHome('/');
            }}
          >
            <img
              src="/svg/gmx-logo.svg"
              alt=""
              style={{ width: isMobile ? '2em' : '3em', height: isMobile ? '2em' : '3em' }}
            />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <NotificationButton />
            <SettingsButton />
          </Box>
        </Box>
        <Run />
        <BotStatusIndicator isConnected={isConnected} />
        <Button variant='contained' onClick={restartBot} disabled={!connected||isRunning}>
            Restart Bot
          </Button>
          <Paper sx={{alignSelf: "flex-end", padding: 2}}>
            <Paper sx={{backgroundColor: theme.palette.background.default, padding: 2, marginBottom: 2}}>
            <Typography variant="body2" sx={{ mt: 2 }}><strong>Profit:</strong> {account.realized_pnl.toFixed(2)}</Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>Total value through bot {"(USD)"}: {account.total}</Typography>
            </Paper>
            <Paper sx={{backgroundColor: theme.palette.background.default, padding: 2}}>

            <Typography variant="h3" sx={{ mt: 2 }}>Collateral:</Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>GMX: {account.balance.GMX}</Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>ByBit: {account.balance.ByBit}</Typography>
            </Paper>

          </Paper>
      </Box>    
    </>
  );
}

export default NavBarSide;
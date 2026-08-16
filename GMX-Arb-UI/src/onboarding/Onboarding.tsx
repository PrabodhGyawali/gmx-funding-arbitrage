import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Dialog} from '@mui/material';
import InstallationSteps from './components/InstallationSteps';
import WalletSettingsStep from './components/WalletSettingsStep';
import ExchangeSettingsStep from './components/ExchangeSettingsStep';
import BotSettingsStep from './components/BotSettingsStep';
import {WelcomeStep} from './components/WelcomeStep';
import { useSocket } from '../Context/SocketContext';
import { UserData } from '../onboarding/types'
import BotStatusIndicator from '../components/NavBarSide/BotStatusIndicator';
import { flexAround, flexColumn } from '../styledComponent/custonCss';
import { useBotContext } from '../Context/BotContext';

export const restartBot = async () => {
  const backendUrl = localStorage.getItem('backendURL');
  await fetch(`${backendUrl}/settings/restart-bot`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  }).catch(() => {});
}

const RestartBotDialog:React.FC<{open: boolean, onClose: () => void, onGoHome: () => void}> = ({open, onClose, onGoHome}) => {
  const {connected} = useSocket();
  const {isRunning} = useBotContext();

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ p: 3, maxWidth: 400 }}>
        <Typography variant="h5" gutterBottom>Bot Settings Updated Successfully</Typography>
        <Typography variant="body1" mb={0.75} gutterBottom>
          You have completed the onboarding process. To apply the new settings and register the environment variables, you need to restart the bot.
        </Typography>
        <Button variant='contained' onClick={restartBot} disabled={!connected||isRunning}>
          Restart Bot
        </Button>
        <BotStatusIndicator isConnected={connected} />
        <Typography variant="body2" gutterBottom>
          Make sure that you do not turn off the bot on your laptop while it is running. Set your computer to not go to sleep or hibernate.
        </Typography>
        <Typography variant="body2" gutterBottom>
          Note that in order to access the front-end and monitor your bot you have to use the browser and settings where you did the onboarding, for example you will have to do an onboarding again if you tried to access the website on incognito mode.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button variant="outlined" onClick={onClose}>Close</Button>
          <Button variant="contained" onClick={onGoHome}>Go to Home Page</Button>
        </Box>
      </Box>
    </Dialog>
  );
}

function Onboarding() {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState<UserData>({
    walletSettings: {
      address: '',
      network: null,
      arbitrum_rpc: '',
      base_rpc: '',
    },
    exchangeSettings: {
      bybit: { apiKey: '', apiSecret: '', enabled: false },
      binance: { apiKey: '', apiSecret: '', enabled: false },
    },
    botSettings: {
      max_allowable_percentage_away_from_liquidation_price: 15,
      trade_leverage: 5,
      percentage_capital_per_trade: 10,
      default_trade_duration_hours: 12,
      default_trade_size_usd: 1000,
    },
  });
  const {connected, backendUrl} = useSocket();
  // Step validation states
  const [isWelcomeStepValid, setIsWelcomeStepValid] = useState(false);
  const [isWalletSettingsValid, setIsWalletSettingsValid] = useState(false);
  const [isExchangeSettingsValid, setIsExchangeSettingsValid] = useState(false);
  const [showRestartDialog, setShowRestartDialog] = useState(false);

  const navigate = useNavigate();

  const steps = [
    { 
      component: <WelcomeStep onValidationChange={setIsWelcomeStepValid} isValid={isWelcomeStepValid} />, 
      valid: isWelcomeStepValid },
    { 
      component: <InstallationSteps />,
      valid: connected
    },
    { 
      component: <WalletSettingsStep setUserData={setUserData} onValidationChange={setIsWalletSettingsValid} />, 
      valid: isWalletSettingsValid },
    { 
      component: <ExchangeSettingsStep setUserData={setUserData} onValidationChange={setIsExchangeSettingsValid} />, 
      valid: isExchangeSettingsValid },
    { 
      component: <BotSettingsStep setUserData={setUserData} />, 
      valid: true 
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      finishOnboarding();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const finishOnboarding = async () => {
    try {
      const response = await fetch(`${backendUrl}/settings/complete-onboarding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      await response.json();
      localStorage.setItem('onboarding', 'completed');
      localStorage.setItem('backendURL', backendUrl);
      checkOnboardingStatus();
    } catch (error) {
      console.error('Error completing onboarding:', error);
      alert(`There was an error { ${error} } when completing your onboarding.`);
    }
  }

  const checkOnboardingStatus = () => {
    const onboardingStatus = localStorage.getItem('onboarding');
    if (onboardingStatus === 'completed') {
      setShowRestartDialog(true);
    }
  };

  const handleGoHome = () => {
    navigate('/'); 
  };


  return (
    <Box className="onboarding" sx={{...flexColumn}} >
      {showRestartDialog ? (
        <RestartBotDialog 
          open={showRestartDialog} 
          onClose={() => setShowRestartDialog(false)} 
          onGoHome={handleGoHome}
        />
      ) : localStorage.getItem('onboarding') === 'completed' ? (
        <Box sx={{ mt: 3, display: 'flex', flexDirection:'column', justifyContent: 'space-between' }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: "bold", 
              fontStyle: "italic", 
              letterSpacing: "0.5px", 
              lineHeight: "1.4" 
            }}
          >
            Onboarding Complete
          </Typography>
          <BotStatusIndicator isConnected={connected} />
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" onClick={() => {
              localStorage.removeItem('onboarding');
              setStep(0);
              navigate('/onboarding');
            }}>
              Repeat Onboarding
            </Button>
            <Button variant="contained" onClick={() => navigate('/faq')}>
              FAQ
            </Button>
          </Box>
        </Box>
      ) : (
        <>
          {steps[step].component}
          <Box sx={{ ...flexAround, width:'50vw'}}>
            <Button onClick={handleBack} disabled={step === 0} variant='contained' color='secondary' sx={{color: 'white'}}>
              Back
            </Button>
            <Button onClick={handleNext} variant="contained" disabled={!steps[step].valid}>
              {step === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
  

export default Onboarding;

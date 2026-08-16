import React, { useState } from 'react';
import {
  Box,
  Slider,
  Typography,
  Paper,
  Grid,
  Tooltip,
  IconButton,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { BotConfig, UserData } from '../types';

interface BotSettingsStepProps {
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

const BotSettingsStep: React.FC<BotSettingsStepProps> = ({ setUserData }) => {
  const initialSettings: BotConfig = {
    max_allowable_percentage_away_from_liquidation_price: 15,
    trade_leverage: 5,
    percentage_capital_per_trade: 10,
    default_trade_duration_hours: 12,
    default_trade_size_usd: 1000,
  };

  const [botConfig, setBotConfig] = useState<BotConfig>(initialSettings);

  const handleSettingChange = (setting: keyof BotConfig) => (
    newValue: number | number[]
  ) => {
    const updatedSettings = {
      ...botConfig,
      [setting]: newValue as number
    };
    setBotConfig(updatedSettings);
    setUserData(prevData => ({
      ...prevData,
      botSettings: updatedSettings
    }));
  };

  const settingConfigs: {
    key: keyof BotConfig;
    label: string;
    min: number;
    max: number;
    step: number;
    tooltip: string;
  }[] = [
    {
      key: 'max_allowable_percentage_away_from_liquidation_price',
      label: 'Max Allowable Percentage from Liquidation Price',
      min: 5,
      max: 30,
      step: 1,
      tooltip: 'The maximum percentage the price can move towards the liquidation price before the bot closes the position. Higher values allow for more price movement but increase risk.',
    },
    {
      key: 'trade_leverage',
      label: 'Trade Leverage',
      min: 1,
      max: 10,
      step: 1,
      tooltip: 'The amount of leverage used for trades. Higher leverage increases potential profits but also increases risk.',
    },
    {
      key: 'percentage_capital_per_trade',
      label: 'Percentage Capital per Trade',
      min: 1,
      max: 100,
      step: 1,
      tooltip: 'The percentage of your total capital to use for each trade. Higher percentages can lead to larger profits but also increase risk.',
    },
    {
      key: 'default_trade_duration_hours',
      label: 'Default Trade Duration (Hours)',
      min: 12,
      max: 168,
      step: 1,
      tooltip: 'The default duration for each trade in hours. Longer durations allow for more price movement but may increase exposure to market volatility.',
    },
    {
      key: 'default_trade_size_usd',
      label: 'Default Trade Size (USD)',
      min: 50,
      max: 1_000_000,
      step: 10,
      tooltip: 'The default size of each trade in USD. Larger trade sizes can lead to higher profits but also increase potential losses.',
    },
  ];

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom mt={2}>
        Bot Settings
      </Typography>
      <Grid container spacing={3}>
        {settingConfigs.map((config) => (
          
          <Grid item xs={12} key={config.key}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography gutterBottom>
                {config.label}: {botConfig[config.key]}
              </Typography>
              <Tooltip title={config.tooltip} arrow placement="top">
                <IconButton size="small" sx={{ ml: 1 }}>
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ px: 2 }}>
              <Slider
                value={botConfig[config.key]}
                onChange={(_, newValue) => handleSettingChange(config.key)(newValue as number)}
                aria-labelledby={`${config.key}-slider`}
                valueLabelDisplay="auto"
                min={config.min}
                max={config.max}
                step={config.step}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default BotSettingsStep;
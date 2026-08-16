import React, { useState } from 'react';
import {
  Card,
  Typography,
  Button,
  Box,
  Avatar,
  Grid,
  Divider,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  ContentCopy as ContentCopyIcon,
  Check as CheckIcon,
  CurrencyBitcoin as CurrencyBitcoinIcon,
} from '@mui/icons-material';

const DeveloperCard: React.FC<{
  username: string;
  githubUrl: string;
  avatarUrl: string;
  role: string;
}> = ({ username, githubUrl, role }) => (
  <Card sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
    <Avatar
      src={`https://github.com/${username}.png`}
      alt={username}
      sx={{ width: 60, height: 60 }}
    />
    <Box>
      <Typography variant="h6">{username}</Typography>
      <Typography variant="body2" color="text.secondary">{role}</Typography>
      <Button
        variant="outlined"
        size="small"
        startIcon={<GitHubIcon />}
        href={githubUrl}
        target="_blank"
        sx={{ mt: 1 }}
      >
        GitHub Profile
      </Button>
    </Box>
  </Card>
);

const EthereumAddress: React.FC<{ address: string }> = ({ address }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
      <Typography variant="body1" component="code" sx={{ 
        bgcolor: 'rgba(0, 0, 0, 0.04)', 
        p: 1, 
        borderRadius: 1,
        fontFamily: 'monospace' 
      }}>
        {formatAddress(address)}
      </Typography>
      <Tooltip title={copied ? "Copied!" : "Copy address"}>
        <IconButton onClick={handleCopy} size="small">
          {copied ? <CheckIcon color="success" /> : <ContentCopyIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

const About: React.FC = () => {
  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 3 }}>
      {/* Project Title and Description */}
      <Typography variant="h4" gutterBottom>
        GMX Funding Rate Arbitrage Bot
      </Typography>
      <Typography variant="body1" paragraph>
        An advanced trading bot that leverages delta-neutral arbitrage opportunities between GMX and HMX perpetual futures platforms, helping you capitalize on funding rate discrepancies.
      </Typography>
      
      <Divider sx={{ my: 4 }} />

      {/* Developer Section */}
      <Typography variant="h5" gutterBottom>
        Meet the Developers
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <DeveloperCard
            username="PrabodhGyawali"
            githubUrl="https://github.com/PrabodhGyawali"
            avatarUrl="https://github.com/PrabodhGyawali.png"
            role="Core Developer"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <DeveloperCard
            username="50shadesofgwei"
            githubUrl="https://github.com/50shadesofgwei"
            avatarUrl="https://github.com/50shadesofgwei.png"
            role="Lead Developer"
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Support Section */}
      <Typography variant="h5" gutterBottom align="center">
        Support the Development
      </Typography>
      <Typography variant="body1" paragraph align="center">
        If you find this project useful, consider supporting the developers. Your support helps us maintain and improve the bot.
      </Typography>

      <Grid container spacing={3}>
        {/* Prabodh's Support Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Support Prabodh
            </Typography>
			<a href="https://www.buymeacoffee.com/prabodh" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style={{
				height: "60px",
				width: "217px"
			}} /></a>
			</Card>
        </Grid>

        {/* 50shadesofgwei's Support Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Support 50shadesofgwei
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Send ETH to:
            </Typography>
            <EthereumAddress address="0x7D8127Da2E23c5b371Ee436303BDCCe1c252afb1" />
            <Button
              variant="contained"
              color="primary"
              startIcon={<CurrencyBitcoinIcon />}
              href={`https://etherscan.io/address/0x7D8127Da2E23c5b371Ee436303BDCCe1c252afb1`}
              target="_blank"
              sx={{ mt: 2 }}
            >
              View on Etherscan
            </Button>
          </Card>
        </Grid>
      </Grid>

      {/* Project Links */}
      <Card sx={{ p: 3, textAlign: 'center', mt: 4 }}>
        <Button
          variant="contained"
          startIcon={<GitHubIcon />}
          href="https://github.com/50shadesofgwei/GMXFundingRateArbitrage"
          target="_blank"
          sx={{ mx: 1 }}
        >
          View on GitHub
        </Button>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Version 0.3.0 | MIT License
        </Typography>
      </Card>
    </Box>
  );
};

export default About;

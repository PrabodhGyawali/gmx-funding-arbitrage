import React from 'react';
import { Card, CardContent, Typography, Grid, styled } from '@mui/material';
import { Position } from '../Settings/Position'; // Adjust this import path as needed

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.grey[900],
  color: theme.palette.common.white,
  marginBottom: theme.spacing(2),
}));

interface PositionCardProps {
  position: Position;
}

const PositionCard: React.FC<PositionCardProps> = ({ position }) => {
  return (
    <StyledCard>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2">Market: {position.symbol}</Typography>
            <Typography variant="body2">Exchange: {position.exchange}</Typography>
            <Typography variant="body2">Side: {position.side}</Typography>
            <Typography variant="body2">Size: {position.size_in_asset}</Typography>
            <Typography variant="body2">Is Hedge: {position.is_hedge ? 'Yes' : 'No'}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">Strategy ID: {position.strategy_execution_id}</Typography>
            <Typography variant="body2">Liq Price: {position.liquidation_price}</Typography>
            <Typography variant="body2">Status: {position.open_close.charAt(0).toUpperCase() + position.open_close.slice(1)}</Typography>
            <Typography variant="body2">Open Time: {position.open_time.toLocaleString()}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </StyledCard>
  );
};

export default PositionCard;
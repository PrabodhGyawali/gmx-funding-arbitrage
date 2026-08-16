import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
} from '@mui/material';
import PositionCard from './PositionCard';
import { Position } from '../Settings/Position';

interface ClosePositionDialogProps {
  open: boolean;
  position: Position | null;
  onClose: () => void;
  onClosePosition: (closeEntirePair: boolean, positionId?: Number) => void;
  getOtherPosition: (strategyExecutionId: string) => Promise<Position | null>;
}

const ClosePositionDialog: React.FC<ClosePositionDialogProps> = ({
  open,
  position,
  onClose,
  onClosePosition,
  getOtherPosition,
}) => {
  const [otherPosition, setOtherPosition] = useState<Position | null>(null);

  useEffect(() => {
    const fetchOtherPosition = async () => {
      if (position && position.strategy_execution_id) {
        const other = await getOtherPosition(position.strategy_execution_id);
        setOtherPosition(other);
      }
    };
    fetchOtherPosition();
  }, [position, getOtherPosition]);

  if (!position) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        style: {
          backgroundColor: '#1e222d',
          color: 'white',
          maxWidth: '600px',
          width: '100%',
        },
      }}
    >
      <DialogTitle sx={{ backgroundColor: '#2c3e50', color: '#ecf0f1' }}>Close Position</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ backgroundColor: '#34495e', p: 2, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 1, color: '#3498db' }}>Current Position</Typography>
              <PositionCard position={position} />
              <Button 
                onClick={() => onClosePosition(false, position.id)}
                variant="contained"
                color="error"
                fullWidth
                sx={{ mt: 2 }}
              >
                Close This Side
              </Button>
            </Box>
          </Grid>
          {otherPosition && (
            <Grid item xs={12} md={6}>
              <Box sx={{ backgroundColor: '#34495e', p: 2, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 1, color: '#2ecc71' }}>Other Position</Typography>
                <PositionCard position={otherPosition} />
                <Button 
                  onClick={() => onClosePosition(false, otherPosition.id)}
                  variant="contained"
                  color="error"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Close This Side
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
        <Typography sx={{ mt: 3, color: '#bdc3c7' }}>
          Do you want to close the entire position execution pair (both short and long sides) or just one side?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: '#2c3e50' }}>
        <Button onClick={onClose} color="primary" variant="outlined">Cancel</Button>
        <Button onClick={() => onClosePosition(true)} color="error" variant="contained">Close Entire Pair</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClosePositionDialog;
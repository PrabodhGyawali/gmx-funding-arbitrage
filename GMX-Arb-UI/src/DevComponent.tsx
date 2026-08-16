import React, { useState } from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';
import { styled } from '@mui/material/styles';
import Logs from './components/Logs';


const StyledDevButton = styled(Button)(() => ({
  position: 'fixed',
  bottom: '20px',
  left: '20px',
  zIndex: 1000,
}));

const StyledModal = styled(Modal)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));


const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[24],
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  width: 'auto',
  textAlign: 'center',
  maxWidth: '85vw',
  maxHeight: '85vh',
}));

const DevDialog: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <StyledDevButton variant="contained" color="primary" onClick={handleOpen}>
        Dev
      </StyledDevButton>
      <StyledModal
        open={open}
        onClose={handleClose}
        aria-labelledby="dev-dialog-title"
        aria-describedby="dev-dialog-description"
      >
        <ModalContent>
            <Typography id="dev-dialog-title" variant="h6" component="h2" gutterBottom>
                Dev Options
            </Typography>
            <Logs  />
            <Button 
                variant="contained" 
                onClick={handleClose}
                sx={{
                    backgroundColor: 'red',
                    color: 'white',
                    '&:hover': {
                    backgroundColor: 'darkred',
                    },
                    mt: '10px',
                }}
            >
                Close
            </Button>
        </ModalContent>
      </StyledModal>
    </>
  );
};

export { DevDialog };
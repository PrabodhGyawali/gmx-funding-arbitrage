import React, { useState } from 'react';
import { Badge, IconButton } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { useNotifications } from '../Context/NotificationContext';
import NotificationDialog from './NotificationDialog';

const NotificationButton: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { notifications } = useNotifications();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleOpenDialog}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <NotificationDialog open={dialogOpen} onClose={handleCloseDialog} />
    </>
  );
};

export default NotificationButton;
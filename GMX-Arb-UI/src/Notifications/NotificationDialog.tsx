import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useNotifications } from '../Context/NotificationContext';

interface NotificationDialogProps {
  open: boolean;
  onClose: () => void;
}

const NotificationDialog: React.FC<NotificationDialogProps> = ({ open, onClose }) => {
  const { notifications, markAsRead, clearAllNotifications } = useNotifications();

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
    // You can add additional logic here, such as opening a detailed view
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Notifications
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <List>
          {notifications.map((notification) => (
            <ListItem
              key={notification.id}
              button
              onClick={() => handleNotificationClick(notification.id)}
              sx={{ backgroundColor: notification.read ? 'inherit' : 'action.hover' }}
            >
              <ListItemText
                primary={
                  <Typography variant="subtitle1" component="div">
                    {notification.title}
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{ marginLeft: 1 }}
                    >
                      ({notification.type})
                    </Typography>
                  </Typography>
                }
                secondary={
                  <>
                    <Typography variant="body2" component="span">
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" component="div">
                      {notification.timestamp.toLocaleString()}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
        {notifications.length > 0 && (
          <Button onClick={clearAllNotifications} color="primary">
            Clear All
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NotificationDialog;
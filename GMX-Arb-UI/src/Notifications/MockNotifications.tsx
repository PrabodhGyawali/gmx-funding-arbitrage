import { v4 as uuidv4 } from 'uuid';
import { _Notification } from './NotificationType';

export const createMockNotifications = (): _Notification[] => {
  return [
    {
      id: uuidv4(),
      type: 'trade',
      title: 'New Trade Executed',
      message: 'Your trade for 100 shares of XYZ has been executed.',
      timestamp: new Date(),
      read: false,
    },
    {
      id: uuidv4(),
      type: 'developer',
      title: 'New App Update',
      message: 'A new version of the app is available. Please update.',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      read: false,
    },
    {
      id: uuidv4(),
      type: 'trade',
      title: 'Trade Completed',
      message: 'Your order to buy 50 shares of ABC has been completed.',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      read: true,
    },
    {
      id: uuidv4(),
      type: 'developer',
      title: 'Server Maintenance',
      message: 'Scheduled maintenance will occur this Sunday.',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      read: false,
    },
  ];
};
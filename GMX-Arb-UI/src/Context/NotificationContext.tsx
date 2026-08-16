import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { _NotificationType, _Notification } from '../Notifications/NotificationType';
import { v4 as uuidv4 } from 'uuid';
import { createMockNotifications } from '../Notifications/MockNotifications';

interface NotificationContextType {
  notifications: _Notification[];
  addNotification: (type: _NotificationType, title: string, message: string) => void;
  markAsRead: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<_Notification[]>([]);

  useEffect(() => {
    setNotifications(createMockNotifications());
  }, []);

  const addNotification = (type: _NotificationType, title: string, message: string) => {
    const newNotification: _Notification = {
      id: uuidv4(),
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
    };
    setNotifications((prev) => [...prev, newNotification]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, markAsRead, clearAllNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
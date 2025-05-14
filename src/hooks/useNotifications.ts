import { useState, useEffect } from 'react';

interface Notification {
  id: string;
  message: string;
  timestamp: number;
  read: boolean;
  link?: string;
}

const STORAGE_KEY = 'notifications';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = async (message: string, link?: string) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      message,
      timestamp: Date.now(),
      read: false,
      link
    };

    // Request permission for browser notifications if not already granted
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification('99CarMart Notifications Enabled', {
          body: 'You will now receive notifications about your saved searches and watched vehicles',
          icon: '/vite.svg' // Replace with your app icon
        });
      }
    }

    // Show browser notification if permission is granted
    if (Notification.permission === 'granted') {
      new Notification('99CarMart', {
        body: message,
        icon: '/vite.svg' // Replace with your app icon
      });
    }

    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    markAsRead,
    clearNotifications
  };
};
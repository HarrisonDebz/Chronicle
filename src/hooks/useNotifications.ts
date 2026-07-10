import { useState, useEffect, useCallback } from 'react';

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notification');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, []);

  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (!('Notification' in window)) return;
    
    if (Notification.permission === 'granted') {
      try {
        new Notification(title, {
          icon: '/pwa-icon.svg',
          badge: '/favicon.svg',
          ...options,
        });
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }
  }, []);

  return {
    permission,
    requestPermission,
    sendNotification,
  };
};

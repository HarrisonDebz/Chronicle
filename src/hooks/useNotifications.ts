import { useState, useCallback, useRef } from 'react';
import type { ChronicleEvent } from '../types/Event';
import {
    calculateNotificationTime,
    buildNotificationContent,
} from '../utils/notifications';

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>(() => {
    return (typeof window !== 'undefined' && 'Notification' in window && window.Notification)
      ? window.Notification.permission
      : 'default';
  });

  const timersRef = useRef<number[]>([]);

  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window) || !window.Notification) {
      console.warn('This browser does not support desktop notifications');
      return false;
    }

    try {
      const result = await window.Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, []);

  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (typeof window === 'undefined' || !('Notification' in window) || !window.Notification) return;

    if (window.Notification.permission === 'granted') {
      try {
        new window.Notification(title, {
          icon: '/pwa-icon-192.png',
          badge: '/pwa-icon-32.png',
          ...options,
        });
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }
  }, []);

  const syncNotificationsToServiceWorker = useCallback((eventsList: ChronicleEvent[]) => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SYNC_EVENTS',
        events: eventsList,
      });
    }
  }, []);

  const registerPeriodicSync = useCallback(async () => {
    if (
      'serviceWorker' in navigator &&
      typeof window !== 'undefined' &&
      'Notification' in window &&
      window.Notification &&
      window.Notification.permission === 'granted'
    ) {
      try {
        interface ServiceWorkerRegistrationWithPeriodicSync extends ServiceWorkerRegistration {
          periodicSync?: {
            register(tag: string, options?: { minInterval?: number }): Promise<void>;
          };
        }
        const registration = await navigator.serviceWorker.ready as ServiceWorkerRegistrationWithPeriodicSync;
        if (registration.periodicSync) {
          await registration.periodicSync.register('check-notifications', {
            minInterval: 15 * 60 * 1000, // 15 minutes
          });
        }
      } catch (error) {
        console.warn('Periodic background sync registration failed:', error);
      }
    }
  }, []);

  const scheduleLocalNotifications = useCallback((eventsList: ChronicleEvent[]) => {
    // Clear existing active timers
    timersRef.current.forEach(timer => window.clearTimeout(timer));
    timersRef.current = [];

    if (
      typeof window === 'undefined' ||
      !('Notification' in window) ||
      !window.Notification ||
      window.Notification.permission !== 'granted'
    ) {
      return;
    }

    const now = Date.now();
    const notifiedKeys = new Set<string>();
    try {
      const stored = localStorage.getItem('chronicle_notified_keys');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          parsed.forEach(k => notifiedKeys.add(k));
        }
      }
    } catch (e) {
      console.error('Failed to parse notified keys', e);
    }

    eventsList.forEach(event => {
      const notifyTime = calculateNotificationTime(event);
      if (!notifyTime) return;

      const notifiedKey = `${event.id}:${event.notifyBefore}:${notifyTime}`;
      if (notifiedKeys.has(notifiedKey)) return;

      const timeDiff = notifyTime - now;

      const fire = () => {
        const { title, body } = buildNotificationContent(event, notifyTime);
        sendNotification(title, { body });
        notifiedKeys.add(notifiedKey);
        localStorage.setItem('chronicle_notified_keys', JSON.stringify([...notifiedKeys]));
      };

      if (timeDiff > 0) {
        // Limit local schedule window to 24 h to avoid integer overflow and excessive timers.
        // The service worker handles larger / longer notification windows.
        if (timeDiff < 24 * 60 * 60 * 1000) {
          const timerId = window.setTimeout(fire, timeDiff);
          timersRef.current.push(timerId);
        }
      } else if (timeDiff >= -5 * 60 * 1000) {
        // If the notification was due in the last 5 minutes, fire immediately
        fire();
      }
    });
  }, [sendNotification]);

  const scheduleNotifications = useCallback((eventsList: ChronicleEvent[]) => {
    scheduleLocalNotifications(eventsList);
    syncNotificationsToServiceWorker(eventsList);
    registerPeriodicSync();
  }, [scheduleLocalNotifications, syncNotificationsToServiceWorker, registerPeriodicSync]);

  return {
    permission,
    requestPermission,
    sendNotification,
    scheduleNotifications,
  };
};

import { useState, useCallback, useRef } from 'react';
import type { ChronicleEvent } from '../types/Event';

// Calculate when a notification should fire
function calculateNotificationTime(event: ChronicleEvent): number | null {
  if (event.notifyBefore === "none" || !event.notifyBefore) return null;

  const eventDate = new Date(event.date);
  const eventTime = eventDate.getTime();

  if (event.type === 'countdown') {
    switch (event.notifyBefore) {
      case 'on-day':
        // 9:00 AM on the day of the event
        return new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate(), 9, 0, 0).getTime();
      case '1-day':
        return eventTime - 24 * 60 * 60 * 1000;
      case '1-hour':
        return eventTime - 60 * 60 * 1000;
      case '15-min':
        return eventTime - 15 * 60 * 1000;
      default:
        return null;
    }
  } else if (event.type === 'countup') {
    if (event.notifyBefore !== 'on-day') return null;
    
    // Memory anniversary: find next anniversary in the future
    const now = new Date();
    let anniversaryYear = now.getFullYear();
    let anniversaryDate = new Date(anniversaryYear, eventDate.getMonth(), eventDate.getDate(), 9, 0, 0);
    
    if (anniversaryDate.getTime() < now.getTime()) {
      anniversaryYear += 1;
      anniversaryDate = new Date(anniversaryYear, eventDate.getMonth(), eventDate.getDate(), 9, 0, 0);
    }
    return anniversaryDate.getTime();
  }
  return null;
}

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
      if (timeDiff > 0) {
        // Limit local schedule window to 24h to avoid integer overflow and excessive timers.
        // The service worker handles larger/longer notification windows.
        if (timeDiff < 24 * 60 * 60 * 1000) {
          const timerId = window.setTimeout(() => {
            let title = event.title;
            let body: string;

            if (event.type === 'countdown') {
              const eventTime = new Date(event.date).getTime();
              const diff = eventTime - notifyTime;
              if (diff <= 0) body = 'Starting now!';
              else if (diff <= 20 * 60 * 1000) body = 'Starting in 15 minutes!';
              else if (diff <= 90 * 60 * 1000) body = 'Starting in 1 hour!';
              else if (diff <= 25 * 60 * 60 * 1000) body = 'Starting tomorrow!';
              else body = 'Starting today!';
            } else {
              const eventDate = new Date(event.date);
              const anniversaryDate = new Date(notifyTime);
              const years = anniversaryDate.getFullYear() - eventDate.getFullYear();
              title = `Anniversary: ${event.title}`;
              body = `Today marks ${years} ${years === 1 ? 'year' : 'years'} since this memory occurred.`;
            }

            sendNotification(title, { body });

            notifiedKeys.add(notifiedKey);
            localStorage.setItem('chronicle_notified_keys', JSON.stringify([...notifiedKeys]));
          }, timeDiff);
          timersRef.current.push(timerId);
        }
      } else if (timeDiff <= 0 && timeDiff > -5 * 60 * 1000) {
        // If event notification was due in the last 5 minutes, trigger it immediately
        let title = event.title;
        let body: string;

        if (event.type === 'countdown') {
          body = 'Starting now!';
        } else {
          const eventDate = new Date(event.date);
          const years = new Date().getFullYear() - eventDate.getFullYear();
          title = `Anniversary: ${event.title}`;
          body = `Today marks ${years} ${years === 1 ? 'year' : 'years'} since this memory occurred.`;
        }

        sendNotification(title, { body });

        notifiedKeys.add(notifiedKey);
        localStorage.setItem('chronicle_notified_keys', JSON.stringify([...notifiedKeys]));
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


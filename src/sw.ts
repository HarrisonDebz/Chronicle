/// <reference lib="webworker" />
import { precacheAndRoute, type PrecacheEntry } from 'workbox-precaching';
import type { ChronicleEvent } from './types/Event';

interface ServiceWorkerGlobalScopeWithTriggers extends ServiceWorkerGlobalScope {
  TimestampTrigger: new (timestamp: number) => unknown;
}

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<string | PrecacheEntry>;
};

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

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

// Show notification helper
async function showNotificationForEvent(event: ChronicleEvent, notifyTime: number) {
  let title = event.title;
  let body: string;

  if (event.type === 'countdown') {
    const eventTime = new Date(event.date).getTime();
    const diff = eventTime - notifyTime;
    
    if (diff <= 0) {
      body = 'Starting now!';
    } else if (diff <= 20 * 60 * 1000) {
      body = 'Starting in 15 minutes!';
    } else if (diff <= 90 * 60 * 1000) {
      body = 'Starting in 1 hour!';
    } else if (diff <= 25 * 60 * 60 * 1000) {
      body = 'Starting tomorrow!';
    } else {
      body = 'Starting today!';
    }
  } else {
    const eventDate = new Date(event.date);
    const anniversaryDate = new Date(notifyTime);
    const years = anniversaryDate.getFullYear() - eventDate.getFullYear();
    title = `Anniversary: ${event.title}`;
    body = `Today marks ${years} ${years === 1 ? 'year' : 'years'} since this memory occurred.`;
  }

  await self.registration.showNotification(title, {
    body,
    icon: '/pwa-icon-192.png',
    badge: '/pwa-icon-32.png',
    vibrate: [100, 50, 100],
    data: { eventId: event.id }
  } as NotificationOptions & { vibrate?: number[] });
}

// Persist notified keys
async function getNotifiedKeys(): Promise<Set<string>> {
  try {
    const cache = await caches.open('chronicle-notifications');
    const response = await cache.match('/notified-keys.json');
    if (response) {
      const keys = await response.json();
      return new Set(keys);
    }
  } catch (e) {
    console.error('Failed to get notified keys from SW cache', e);
  }
  return new Set();
}

async function saveNotifiedKeys(keys: Set<string>) {
  try {
    const cache = await caches.open('chronicle-notifications');
    const response = new Response(JSON.stringify([...keys]));
    await cache.put('/notified-keys.json', response);
  } catch (e) {
    console.error('Failed to save notified keys to SW cache', e);
  }
}

// Scheduled check and trigger
async function checkAndTriggerNotifications() {
  try {
    const cache = await caches.open('chronicle-notifications');
    const response = await cache.match('/scheduled-events.json');
    if (!response) return;
    const events = await response.json();
    const now = Date.now();
    const notifiedKeys = await getNotifiedKeys();

    let updated = false;
    for (const event of events) {
      const notifyTime = calculateNotificationTime(event);
      if (!notifyTime) continue;

      const notifiedKey = `${event.id}:${event.notifyBefore}:${notifyTime}`;
      if (now >= notifyTime && !notifiedKeys.has(notifiedKey)) {
        await showNotificationForEvent(event, notifyTime);
        notifiedKeys.add(notifiedKey);
        updated = true;
      }
    }
    if (updated) {
      await saveNotifiedKeys(notifiedKeys);
    }
  } catch (e) {
    console.error('Error during background checkAndTriggerNotifications', e);
  }
}

// Native Notification Triggers scheduling (when supported)
async function scheduleNotificationTriggers(events: ChronicleEvent[]) {
  if (!('showTrigger' in Notification.prototype)) {
    await checkAndTriggerNotifications();
    return;
  }

  const notifiedKeys = await getNotifiedKeys();
  const activeTriggers = await self.registration.getNotifications();
  const activeIds = new Set(activeTriggers.map((n: Notification) => n.data?.eventId).filter(Boolean));

  for (const event of events) {
    const notifyTime = calculateNotificationTime(event);
    if (!notifyTime) continue;

    const notifiedKey = `${event.id}:${event.notifyBefore}:${notifyTime}`;
    if (notifyTime > Date.now() && !notifiedKeys.has(notifiedKey) && !activeIds.has(event.id)) {
      let title = event.title;
      let body: string;
      
      if (event.type === 'countdown') {
        const eventTime = new Date(event.date).getTime();
        const diff = eventTime - notifyTime;
        if (diff <= 20 * 60 * 1000) body = 'Starting in 15 minutes!';
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

      try {
        await self.registration.showNotification(title, {
          body,
          icon: '/pwa-icon-192.png',
          badge: '/pwa-icon-32.png',
          showTrigger: new (self as unknown as ServiceWorkerGlobalScopeWithTriggers).TimestampTrigger(notifyTime),
          data: { eventId: event.id, key: notifiedKey }
        } as NotificationOptions);
      } catch (err) {
        console.error('Failed to register notification trigger', err);
      }
    }
  }
}

// Message Listener
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SYNC_EVENTS') {
    const events = event.data.events;
    const cacheResponse = new Response(JSON.stringify(events));
    event.waitUntil(
      caches.open('chronicle-notifications')
        .then((cache) => cache.put('/scheduled-events.json', cacheResponse))
        .then(() => scheduleNotificationTriggers(events))
    );
  }
});

// Periodic sync background trigger
self.addEventListener('periodicsync', (event) => {
  const syncEvent = event as unknown as { tag: string; waitUntil(p: Promise<void>): void };
  if (syncEvent.tag === 'check-notifications') {
    syncEvent.waitUntil(checkAndTriggerNotifications());
  }
});

// Notification click behavior
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/') && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});

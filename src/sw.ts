/// <reference lib="webworker" />
import { precacheAndRoute, type PrecacheEntry } from 'workbox-precaching';
import {
    calculateNotificationTime,
    buildNotificationContent,
} from './utils/notifications';

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

// ── Notification persistence helpers ─────────────────────────────────────────

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

// ── Show notification ─────────────────────────────────────────────────────────

async function showNotificationForEvent(
  event: Parameters<typeof buildNotificationContent>[0],
  notifyTime: number
) {
  const { title, body } = buildNotificationContent(event, notifyTime);
  await self.registration.showNotification(title, {
    body,
    icon: '/pwa-icon-192.png',
    badge: '/pwa-icon-32.png',
    vibrate: [100, 50, 100],
    data: { eventId: event.id },
  } as NotificationOptions & { vibrate?: number[] });
}

// ── Scheduled check and trigger ───────────────────────────────────────────────

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

      // Skip countdowns that have already passed
      if (event.type === 'countdown' && new Date(event.date).getTime() < now) {
        continue;
      }

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

// ── Native Notification Triggers (when supported) ────────────────────────────

async function scheduleNotificationTriggers(events: Parameters<typeof calculateNotificationTime>[0][]) {
  if (typeof Notification === 'undefined' || !('showTrigger' in Notification.prototype)) {
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
      const { title, body } = buildNotificationContent(event, notifyTime);
      try {
        await self.registration.showNotification(title, {
          body,
          icon: '/pwa-icon-192.png',
          badge: '/pwa-icon-32.png',
          showTrigger: new (self as unknown as ServiceWorkerGlobalScopeWithTriggers).TimestampTrigger(notifyTime),
          data: { eventId: event.id, key: notifiedKey },
        } as NotificationOptions);
      } catch (err) {
        console.error('Failed to register notification trigger', err);
      }
    }
  }
}

// ── Message Listener ──────────────────────────────────────────────────────────

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

// ── Periodic sync ─────────────────────────────────────────────────────────────

self.addEventListener('periodicsync', (event) => {
  const syncEvent = event as unknown as { tag: string; waitUntil(p: Promise<void>): void };
  if (syncEvent.tag === 'check-notifications') {
    syncEvent.waitUntil(checkAndTriggerNotifications());
  }
});

// ── Notification click ────────────────────────────────────────────────────────

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

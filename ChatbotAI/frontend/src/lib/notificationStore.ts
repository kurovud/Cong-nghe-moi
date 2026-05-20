/* ══════════════════════════════════════════════
   NOTIFICATION STORE — In-memory (globalThis)
   ══════════════════════════════════════════════ */

import type { AppNotification, NotificationType } from "@/types/order.type";

interface NotifStore {
  notifications: Record<string, AppNotification[]>; // userId → notifications
}

const getStore = (): NotifStore => {
  const g = globalThis as unknown as { __notifStore?: NotifStore };
  if (!g.__notifStore) {
    g.__notifStore = { notifications: {} };
  }
  return g.__notifStore;
};

export const getNotifications = (userId: string): AppNotification[] => {
  const store = getStore();
  if (!store.notifications[userId]) store.notifications[userId] = [];
  return store.notifications[userId];
};

export const addNotification = (
  userId: string,
  data: { type: NotificationType; title: string; message: string; link?: string }
): AppNotification => {
  const store = getStore();
  if (!store.notifications[userId]) store.notifications[userId] = [];
  const notif: AppNotification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    type: data.type,
    title: data.title,
    message: data.message,
    read: false,
    link: data.link,
    createdAt: new Date().toISOString(),
  };
  store.notifications[userId].unshift(notif);
  return notif;
};

export const markAsRead = (userId: string, notifId: string): void => {
  const list = getNotifications(userId);
  const n = list.find((x) => x.id === notifId);
  if (n) n.read = true;
};

export const markAllRead = (userId: string): void => {
  getNotifications(userId).forEach((n) => (n.read = true));
};

export const getUnreadCount = (userId: string): number =>
  getNotifications(userId).filter((n) => !n.read).length;

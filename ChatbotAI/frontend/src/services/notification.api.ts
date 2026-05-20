/**
 * Notification API service — calls backend notification-service via API gateway
 */
import { http } from './http';

export const notificationApi = {
  getNotifications: () => http.get<any>('/api/notifications'),

  markAsRead: (id: string) =>
    http.put<any>(`/api/notifications/${id}/read`, {}),

  markAllAsRead: () =>
    http.put<any>('/api/notifications/read-all', {}),

  getUnreadCount: () =>
    http.get<any>('/api/notifications/unread-count'),

  clearAll: () =>
    http.delete<any>('/api/notifications'),
};

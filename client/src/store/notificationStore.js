import { create } from 'zustand'
import api from '../lib/axios'

const initialState = {
  notifications: [],
  loadingNotifications: false,
  notificationSuccess: null,
  notificationError: null
}
const ENDPOINT = 'notifications'
export const useNotificationStore = create((set, get) => ({
  ...initialState,


  getUserNotifications: async (userId) => {
    set({ loadingNotifications: true, notificationError: null });
    try {
      const response = await api.get(`${ENDPOINT}/get-user-notification/${userId}`);
      if (response.data.success) {
        set({
          notifications: response.data.notifications,
          notificationSuccess: response.data.message,
          loadingNotifications: false,
        });
      }
    } catch (error) {
      set({
        notificationError: error.response?.data?.message || 'Failed to fetch notifications',
        loadingNotifications: false,
      });
    }
  },
  markNotificationAsRead: async (notificationId) => {
    set({ loadingNotifications: true, notificationError: null });
    try {
      const response = await api.patch(`${ENDPOINT}/mark-as-read/${notificationId}`);
      if (response.data.success) {
        const { notifications } = get();
        const updated = notifications.map((notif) =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        );
        set({
          notifications: updated,
          notificationSuccess: response.data.message,
          loadingNotifications: false,
        });
      }
    } catch (error) {
      set({
        notificationError: error.response?.data?.message || 'Failed to mark notification as read',
        loadingNotifications: false,
      });
    }
  },
  markAllNotificationsAsRead: async (notificationIds) => {
    set({ loadingNotifications: true, notificationError: null });
    try {
      const response = await api.patch(`${ENDPOINT}/mark-all-as-read`, {
        notification_ids: notificationIds,
      });
      if (response.data.success) {
        const { notifications } = get();
        const updated = notifications.map((notif) => ({
          ...notif,
          is_read: true,
        }));
        set({
          notifications: updated,
          notificationSuccess: response.data.message,
          loadingNotifications: false,
        });
      }
    } catch (error) {
      set({
        notificationError: error.response?.data?.message || 'Failed to mark all notifications as read',
        loadingNotifications: false,
      });
    }
  },
  deleteNotification: async (notificationId) => {
    set({ loadingNotifications: true, notificationError: null });
    try {
      const response = await api.delete(`${ENDPOINT}/delete/${notificationId}`);
      if (response.data.success) {
        const { notifications } = get();
        const updated = notifications.filter((notif) => notif.id !== notificationId);
        set({
          notifications: updated,
          notificationSuccess: response.data.message,
          loadingNotifications: false,
        });
      }
    } catch (error) {
      set({
        notificationError: error.response?.data?.message || 'Failed to delete notification',
        loadingNotifications: false,
      });
    }
  },
  clearNotifications: () => {
    set({ notifications: [] });
  },
  clearSuccess: () => {
    set({ notificationSuccess: null });
  },
  clearError: () => {
    set({ notificationError: null });
  },
  reset: () => {
    set(initialState);
  },
}))
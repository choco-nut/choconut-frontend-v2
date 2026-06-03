import { create } from 'zustand';
import api from '../../../shared/api/apiClient';
import { toast } from 'react-toastify';

export const useNotificationStore = create((set, get) => ({
  // State
  notifications: [],
  unreadCount: 0,
  socket: null,

  // Actions
  fetchNotifications: async (isAdmin) => {
    try {
      const endpoint = isAdmin ? '/notifications/admin/' : '/notifications/';
      const res = await api.get(endpoint);
      set({
        notifications: res.data.notifications,
        unreadCount: res.data.unread_count,
      });
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  },

  connectWebSocket: (token, navigate, isAdmin = false) => {
    if (get().socket) return;

    // Extract WebSocket URL from API URL
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
    const wsHost = apiUrl.replace('http://', '').replace('https://', '').replace('/api', '');
    const protocol = apiUrl.startsWith('https://') ? 'wss' : 'ws';
    const wsUrl = `${protocol}://${wsHost}/ws/notifications/?token=${token}`;

    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      set((state) => ({
        notifications: [data, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      }));

      // Show toast notification (using string message instead of JSX)
      toast.dismiss();
      const message = `${data.title}: ${data.message}`;
      toast.info(message, {
        autoClose: 4000,
        onClick: () => navigate('/notifications'),
      });
    };

    socket.onclose = () => {
      // console.log('WebSocket closed. Attempting reconnect...');
      // Reconnect after 3 seconds
      setTimeout(() => {
        const currentSocket = get().socket;
        if (!currentSocket || currentSocket.readyState === WebSocket.CLOSED) {
          get().connectWebSocket(token, navigate, isAdmin);
        }
      }, 3000);
    };

    socket.onerror = (err) => {
      console.error('WebSocket error:', err);
      socket.close();
    };

    set({ socket });
  },

  disconnectWebSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.onclose = null; // Prevent reconnection
      socket.close();
      set({ socket: null });
    }
  },

  markOneAsRead: async (id) => {
    try {
      await api.post(`/notifications/${id}/read/`);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        ),
        unreadCount: Math.max(state.unreadCount - 1, 0),
      }));
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  },

  setUnreadCount: (count) => set({ unreadCount: count }),
}));
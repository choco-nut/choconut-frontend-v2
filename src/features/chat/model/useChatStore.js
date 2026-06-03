import { create } from 'zustand';
import api from '../../../shared/api/apiClient';

export const useChatStore = create((set, get) => ({
  // State
  isOpen: false,
  messages: [{ role: 'model', text: 'Greetings. How may I sweeten your day?' }],
  loading: false,

  // Actions
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),

  setIsOpen: (isOpen) => set({ isOpen }),

  sendMessage: async (text) => {
    if (!text.trim()) return;

    // Add user message to UI
    const userMsg = { role: 'user', text };
    set((state) => ({
      messages: [...state.messages, userMsg],
      loading: true,
    }));

    try {
      const res = await api.post('/chat/', { message: text });
      set((state) => ({
        messages: [...state.messages, { role: 'model', text: res.data.reply }],
        loading: false,
      }));
    } catch (err) {
      set((state) => ({
        messages: [
          ...state.messages,
          { role: 'model', text: 'Our chocolatiers are briefly unavailable.' },
        ],
        loading: false,
      }));
    }
  },

  startNewChat: async () => {
    try {
      await api.post('/chat/clear/');
      set({
        messages: [{ role: 'model', text: 'A fresh start! How can I help you?' }],
      });
    } catch (err) {
      console.error('Failed to clear chat');
    }
  },
}));

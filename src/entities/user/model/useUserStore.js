import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../../../shared/api/apiClient';
import { toast } from 'react-toastify';

export const useUserStore = create(
  persist(
    (set, get) => ({
      // State
      currentUser: null,
      cart: {
        items: [],
        total_price: 0,
        total_items: 0,
      },
      wishlist: [],
      notifyMeList: [],
      loadingAuth: true,
      isAuthBootstrapped: false,

      // Auth Actions
      setCurrentUser: (user) => set({ currentUser: user }),

      login: (user) => set({ currentUser: user, isAuthBootstrapped: true }),

      logout: async () => {
        try {
          await api.post('/logout/');
        } catch (err) {
          console.error('Logout failed', err);
        }

        // Clear all user-related state
        set({
          currentUser: null,
          cart: { items: [], total_price: 0, total_items: 0 },
          wishlist: [],
          notifyMeList: [],
          isAuthBootstrapped: true,
        });
      },

      setLoadingAuth: (loading) => set({ loadingAuth: loading }),

      setAuthBootstrapped: (bootstrapped) =>
        set({ isAuthBootstrapped: bootstrapped }),

      // Cart Actions
      fetchCart: async () => {
        const { currentUser } = get();
        if (!currentUser) return;

        try {
          const res = await api.get('/cart/');
          set({
            cart: {
              items: res.data.items || [],
              total_price: res.data.cart_total || 0,
              total_items: res.data.items?.length || 0,
            },
          });
        } catch (err) {
          console.error('Fetch cart failed', err);
          set({
            cart: { items: [], total_price: 0, total_items: 0 },
          });
        }
      },

      addToCart: async (product) => {
        const { cart } = get();
        const previousCart = JSON.parse(JSON.stringify(cart));

        // Optimistic Update
        const optimisticItem = {
          id: `temp-${Date.now()}`, // Temp ID until server responds
          product: product,
          quantity: 1,
          total_price: product.price,
        };

        set({
          cart: {
            items: [...cart.items, optimisticItem],
            total_price: Number(cart.total_price) + Number(product.price),
            total_items: cart.total_items + 1,
          },
        });
        toast.success('Added to cart');

        try {
          // Background Sync
          const res = await api.post('/cart/add/', {
            product_id: product.id,
            quantity: 1,
          });

          // Reconcile with server data
          set({
            cart: {
              items: res.data.items || [],
              total_price: res.data.cart_total || 0,
              total_items: res.data.items?.length || 0,
            },
          });
        } catch (err) {
          // Revert on failure
          set({ cart: previousCart });
          toast.error('Failed to add to cart');
          throw err;
        }
      },

      removeFromCart: async (productId) => {
        const { cart } = get();
        const previousCart = JSON.parse(JSON.stringify(cart));
        const itemToRemove = cart.items.find((i) => i.product.id === productId);

        if (!itemToRemove) return;

        // Optimistic Update
        set({
          cart: {
            items: cart.items.filter((i) => i.product.id !== productId),
            total_price: Number(cart.total_price) - Number(itemToRemove.product.price * itemToRemove.quantity),
            total_items: cart.total_items - 1,
          },
        });
        toast.info('Removed from cart');

        try {
          const res = await api.delete('/cart/remove/', {
            data: { product_id: productId },
          });

          set({
            cart: {
              items: res.data.items || [],
              total_price: res.data.cart_total || 0,
              total_items: res.data.items?.length || 0,
            },
          });
        } catch (err) {
          set({ cart: previousCart });
          toast.error('Failed to remove from cart');
          throw err;
        }
      },

      updateCartQty: async (productId, quantity) => {
        const previousCart = { ...get().cart };

        // Optimistic update
        set((state) => ({
          cart: {
            ...state.cart,
            items: state.cart.items.map((item) =>
              item.product.id === productId ? { ...item, quantity } : item
            ),
          },
        }));

        try {
          const res = await api.patch('/cart/update/', {
            product_id: productId,
            quantity,
          });
          set({
            cart: {
              items: res.data.items || [],
              total_price: res.data.cart_total || 0,
              total_items: res.data.items?.length || 0,
            },
          });
        } catch (err) {
          set({ cart: previousCart });
          toast.error('Failed to update quantity');
          throw err;
        }
      },

      // Wishlist Actions
      fetchWishlist: async () => {
        const { currentUser } = get();
        if (!currentUser) return;

        try {
          const res = await api.get('/wishlist/');
          const products = res.data.items.map((item) => item.product);
          set({ wishlist: products });
        } catch (err) {
          console.error('Fetch wishlist failed', err);
          set({ wishlist: [] });
        }
      },

      toggleWishlist: async (product) => {
        const { currentUser, wishlist } = get();
        if (!currentUser) {
          // toast.info('Please login to use wishlist'); // Removed as per request
          return;
        }

        const exists = wishlist.some((p) => p.id === product.id);
        const previousWishlist = [...wishlist];

        // Optimistic update
        if (exists) {
          set({ wishlist: wishlist.filter((p) => p.id !== product.id) });
        } else {
          set({ wishlist: [...wishlist, product] });
        }

        try {
          const res = await api.post('/wishlist/toggle/', {
            product_id: product.id,
          });
          toast.success(res.data.message);
        } catch (err) {
          set({ wishlist: previousWishlist });
          toast.error('Could not update wishlist');
        }
      },

      // Notify Me Actions
      fetchNotifyMeList: async () => {
        const { currentUser } = get();
        if (!currentUser) return;

        try {
          const res = await api.get('/notifications/notify-me/list/');
          set({ notifyMeList: res.data.product_ids || [] });
        } catch (err) {
          console.error('Fetch notify-me list failed', err);
          set({ notifyMeList: [] });
        }
      },

      addToNotifyMe: async (productId) => {
        const { currentUser, notifyMeList } = get();
        if (!currentUser) return; // Silent return if not logged in

        const prevList = [...notifyMeList];

        // Optimistic update
        if (!prevList.includes(productId)) {
          set({ notifyMeList: [...prevList, productId] });
        }

        try {
          await api.post('/notifications/notify-me/', { product_id: productId });
          toast.success('You will be notified when this product is back in stock!');
        } catch (err) {
          set({ notifyMeList: prevList });
          toast.error('Failed to add. Try again.');
        }
      },

      removeFromNotifyMe: async (productId) => {
        const { currentUser, notifyMeList } = get();
        if (!currentUser) return;

        const prevList = [...notifyMeList];

        // Optimistic update
        set({ notifyMeList: prevList.filter((id) => id !== productId) });

        try {
          await api.delete(`/notifications/notify-me/${productId}/`);
          toast.info('Notify Me removed');
        } catch (err) {
          set({ notifyMeList: prevList });
          // Quiet failure for remove is acceptable or generic message
        }
      },
    }),
    {
      name: 'choconut-user-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
      }),
    }
  )
);
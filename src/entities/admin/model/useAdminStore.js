import { create } from 'zustand';
import api from '../../../shared/api/apiClient';
import { toast } from 'react-toastify';

export const useAdminStore = create((set, get) => ({
  // State
  dashboard: {
    stats: {
      total_revenue: 0,
      total_orders: 0,
      total_products: 0,
      total_users: 0,
    },
    monthly_revenue: [],
    order_status: [],
    top_products: [],
  },
  users: [],
  userPagination: {
    count: 0,
    next: null,
    previous: null,
    page: 1,
  },
  userStats: {
    total: 0,
    active: 0,
    blocked: 0,
    notVerified: 0,
    newThisMonth: 0,
  },
  orders: [],
  orderPagination: {
    count: 0,
    next: null,
    previous: null,
    page: 1,
  },
  orderStats: {},
  products: [],
  productPagination: {
    count: 0,
    next: null,
    previous: null,
    page: 1,
  },
  productStats: {
    total: 0,
    low_stock: 0,
    out_of_stock: 0,
    categories: 0,
  },
  editingOrderId: null,
  updatedStatus: '',
  loadingAdmin: true,

  // Actions
  setLoadingAdmin: (loading) => set({ loadingAdmin: loading }),

  // Dashboard
  fetchDashboard: async () => {
    try {
      const res = await api.get('/admin/dashboard/');
      set({ dashboard: res.data });
    } catch (err) {
      console.error('Failed to fetch dashboard', err);
    }
  },

  // Products
  fetchProducts: async ({
    page = 1,
    search = '',
    category = 'all',
    stock = '',
    premium = '',
  } = {}) => {
    const params = { page };
    if (search) params.search = search;
    if (category !== 'all') params.category = category;
    if (stock) params.stock = stock;
    if (premium !== '') params.premium = premium;

    try {
      const res = await api.get('admin/products/', { params });
      set({
        products: res.data.results.products,
        productStats: res.data.results.stats,
        productPagination: {
          count: res.data.count,
          next: res.data.next,
          previous: res.data.previous,
          page,
        },
      });
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  },

  addProduct: async (newProduct) => {
    try {
      await api.post('admin/products/', newProduct);
      await get().fetchProducts();
      toast.success('Product added successfully');
    } catch (err) {
      console.error('Add product error:', err);
      toast.error('Failed to add product');
      throw err;
    }
  },

  deleteProduct: async (id) => {
    try {
      await api.delete(`admin/products/${id}/`);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      }));
      toast.success('Product deleted');
    } catch (err) {
      console.error('Delete product error:', err);
      toast.error('Failed to delete product');
    }
  },

  getProductById: async (id) => {
    const res = await api.get(`/admin/products/${id}/`);
    return res.data;
  },

  updateProduct: async (id, updatedData) => {
    try {
      await api.patch(`admin/products/${id}/`, updatedData);
      await get().fetchProducts();
      toast.success('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
      throw error;
    }
  },

  // Users
  fetchUsers: async ({ page = 1, search = '', status = 'all' } = {}) => {
    const params = {
      page,
      include_orders: true,
    };
    if (search) params.search = search;
    if (status !== 'all') params.status = status;

    try {
      const res = await api.get('admin/users/', { params });
      set({
        users: res.data.results.results,
        userStats: {
          total: res.data.results.stats.total,
          active: res.data.results.stats.active,
          blocked: res.data.results.stats.blocked,
          notVerified: res.data.results.stats.not_verified,
          newThisMonth: res.data.results.stats.new_this_month,
        },
        userPagination: {
          count: res.data.count,
          next: res.data.next,
          previous: res.data.previous,
          page,
        },
      });
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  },

  userAction: async (userId, action) => {
    try {
      const res = await api.patch(`admin/users/${userId}/action/`, {
        action,
      });

      set((state) => ({
        users: state.users.map((u) =>
          u.id === userId
            ? {
              ...u,
              is_blocked:
                action === 'block'
                  ? true
                  : action === 'unblock'
                    ? false
                    : u.is_blocked,
              isAdmin:
                action === 'make_admin'
                  ? true
                  : action === 'remove_admin'
                    ? false
                    : u.isAdmin,
            }
            : u
        ),
      }));

      // Update stats
      if (action === 'block') {
        set((state) => ({
          userStats: {
            ...state.userStats,
            active: state.userStats.active - 1,
            blocked: state.userStats.blocked + 1,
          },
        }));
      } else if (action === 'unblock') {
        set((state) => ({
          userStats: {
            ...state.userStats,
            active: state.userStats.active + 1,
            blocked: state.userStats.blocked - 1,
          },
        }));
      }

      await get().fetchUsers({
        page: get().userPagination.page,
        search: '',
        status: 'all',
      });

      toast.success(res.data.message || 'Action applied');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Action failed');
    }
  },

  // Orders
  fetchOrders: async ({ page = 1, search = '', status = 'all' } = {}) => {
    try {
      const res = await api.get('admin/orders/', {
        params: { page, search, status },
      });
      set({
        orders: res.data.results.results,
        orderStats: res.data.results.stats,
        orderPagination: {
          count: res.data.count,
          next: res.data.next,
          previous: res.data.previous,
          page,
        },
      });
    } catch (err) {
      console.error('Failed to fetch orders', err);
    }
  },

  setEditingOrderId: (id) => set({ editingOrderId: id }),
  setUpdatedStatus: (status) => set({ updatedStatus: status }),

  handleSaveStatus: async ({ orderId, page, search, status }) => {
    try {
      await api.patch(`admin/orders/${orderId}/`, {
        order_status: get().updatedStatus,
      });

      set((state) => ({
        orders: state.orders.map((o) =>
          o.id === orderId ? { ...o, order_status: state.updatedStatus } : o
        ),
      }));

      await get().fetchOrders({ page, search, status });

      toast.success('Order status updated!');
    } catch (err) {
      toast.error('Failed to update order!');
    } finally {
      set({ editingOrderId: null });
    }
  },
}));
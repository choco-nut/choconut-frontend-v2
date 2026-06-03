import axios from 'axios';
import { useUserStore } from '../../entities/user/model/useUserStore';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

// Request interceptor to add token to requests
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(
          `${api.defaults.baseURL}/auth/refresh/`,
          {},
          { withCredentials: true }
        );

        setAccessToken(data.access);

        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Token management functions
let accessToken = null;

export const getAccessToken = () => accessToken;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const clearAuth = () => {
  accessToken = null;
};

export default api;

import axios from "axios";
import { getAccessToken, isAuthLoggedOut } from "./auth";
import { bootstrapAuth } from "./bootstrapAuth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});
api.interceptors.request.use(
  async (config) => {
    let token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // 🚫 If logged out, never refresh
    if (isAuthLoggedOut()) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url.includes("/auth/refresh")
    ) {
      original._retry = true;

      try {
        await bootstrapAuth();
        original.headers.Authorization = `Bearer ${getAccessToken()}`;
        return api(original);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

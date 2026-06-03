import api from "./axios";
import { setAccessToken, isAuthLoggedOut, clearAuth, isLoginInProgress } from "./auth";

let isAuthBootstrapped = false;

export const bootstrapAuth = async () => {
  if (isAuthBootstrapped || isAuthLoggedOut() || isLoginInProgress()) return null;

  try {
    const res = await api.post("/auth/refresh/");
    setAccessToken(res.data.access);
    isAuthBootstrapped = true;
    return res.data.access;
  } catch (err) {
    clearAuth();
    isAuthBootstrapped = true;
    return null;
  }
};

// Reset bootstrap flag after logout
export const resetBootstrapAuth = () => {
  isAuthBootstrapped = false;
};

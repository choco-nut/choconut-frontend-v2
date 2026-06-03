let accessToken = null;
let isLoggedOut = false;
let loginInProgress = false;

export const setAccessToken = (token) => {
  accessToken = token;
  isLoggedOut = false;
  loginInProgress = false;
  window.dispatchEvent(new Event("auth-changed"));
};

export const getAccessToken = () => accessToken;

export const clearAuth = () => {
  accessToken = null;
  isLoggedOut = true;
  loginInProgress = false;
};

export const isAuthLoggedOut = () => isLoggedOut;

export const setLoginInProgress = (value) => {
  loginInProgress = value;
};

export const isLoginInProgress = () => loginInProgress;

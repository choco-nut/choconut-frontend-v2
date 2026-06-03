// src/helpers/userHelpers.js

// Check if user is logged in, optionally redirect
export const requireLogin = (currentUser, navigate) => {
  if (!currentUser) {
    navigate?.("/login");
    return false;
  }
  return true;
};

// Check if a product is in cart
export const isInCart = (currentUser, productId) => {
  return currentUser?.cart?.some((item) => item.id === productId);
};

// Check if a product is in wishlist
export const isInWishlist = (currentUser, productId) => {
  return currentUser?.wishlist?.some((item) => item.id === productId);
};

// Get current quantity of product in cart
export const getCartQty = (currentUser, productId) => {
  return currentUser?.cart?.find((item) => item.id === productId)?.qty || 0;
};

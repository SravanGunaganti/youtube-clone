// src/utils/authUtils.js
import api from "../api/axios";

const TOKEN_KEY = "auth_token";

// Save token to localStorage
export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Remove token from localStorage
export const logoutUser = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Decode token and get user data (with expiry check)
export const getUserFromToken = async () => {
  try {
    const token = getToken();
    if (!token) {
      logoutUser();
      return null;
    }

    const res = await api.get("/auth/verify");

    if (res.data.success) {
      return res.data.data;
    }
    logoutUser();
    return null;
  } catch (error) {
    console.error("Error decoding token", error);
    return null;
  }
};

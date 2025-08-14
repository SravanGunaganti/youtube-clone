import API from "../services/api";

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
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Decode token and get user data (with expiry check)
export const getUserFromToken = async () => {
  try {
    const token = getToken();
    if (!token) {
      removeToken();
      return null;
    }

    const res = await API.get("/auth/verify");
    if (res.success) {
      return res.data;
    }
    removeToken();
    return null;
  } catch (error) {
    removeToken();
    return null;
  }
};

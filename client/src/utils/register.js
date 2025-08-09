import axios from "axios";
import api from "../api/axios";

export const registerUser = async (formData) => {
  try {
    const response = await api.post("/auth/register", formData);

    // Success handling
    if (response.data.success) {
      const { message, data, accessToken } = response.data;

      // Optional: Store token
      if (accessToken) {
        localStorage.setItem("token", accessToken);
      }

      return { success: true, message, data };
    }

  } catch (err) {
    // Error response from backend
    if (err.response && err.response.data) {
      const { title, message } = err.response.data.error;
      return { success: false, title, message };
    }

    // Fallback error
    return { success: false, title: "Network Error", message: err.message };
  }
};

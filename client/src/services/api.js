import axios from "axios";
import { getToken, removeToken } from "../utils/authUtils";

// Create axios instance with base configuration
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `JWT ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//Response interceptor to handle errors
API.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log(error)
      removeToken();
      // window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

//  CHANNEL APIs

export const channelAPI = {
  // Create a new channel
  createChannel: async (channelData) => {
    return await API.post("/channels", channelData);
  },

  // Get user's own channel
  getMyChannel: async () => {
    return await API.get("/my-channel");
  },

  // Get channel by ID
  getChannel: async (channelId) => {
    return await API.get(`/channels/${channelId}`, {
      validateStatus: () => true,
    });
  },

  // Get all channels with pagination
  getAllChannels: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await API.get(`/channels?${queryString}`);
  },

  // Update channel
  updateChannel: async (channelId, updateData) => {
    return await API.put(`/channels/${channelId}`, updateData);
  },

  // Delete channel
  deleteChannel: async (channelId) => {
    return await API.delete(`/channels/${channelId}`);
  },

  // Check if channel exists
  channelExists: async (channelId) => {
    return await API.get(`/channels/${channelId}/exists`);
  },

  // Toggle subscription to a channel
  toggleSubscribe: async (channelId) => {
    return await API.post(`/channels/${channelId}/subscribe`);
  },

  // Check subscription status for current user
  getSubscriptionStatus: async (channelId) => {
    return await API.get(`/channels/${channelId}/subscription-status`);
  }
};

//  VIDEO APIs

export const videoAPI = {
  // Create a new video
  createVideo: async (videoData) => {
    return await API.post("/videos", videoData);
  },

  // Get video by ID
  getVideo: async (videoId) => {
    return await API.get(`/videos/${videoId}`);
  },

  // Get all videos with pagination and filtering
  getAllVideos: async () => {
    return await API.get(`/videos`);
  },

  // Get videos by channel
  getVideosByChannel: async (channelId) => {
    return await API.get(`/channels/${channelId}/videos`);
  },

  // Update video
  updateVideo: async (videoId, updateData) => {
    return await API.put(`/videos/${videoId}`, updateData);
  },

  // Delete video
  deleteVideo: async (videoId) => {
    return await API.delete(`/videos/${videoId}`);
  },

  // Like/Unlike video
  toggleLikeVideo: async (videoId, action) => {
    return await API.put(`/videos/${videoId}/like`, { action });
  },

  // Get user's like status for a video
  getVideoLikeStatus: async (videoId) => {
    return await API.get(`/videos/${videoId}/like-status`);
  },

  // Check if video exists
  videoExists: async (videoId) => {
    return await API.get(`/videos/${videoId}/exist`);
  },
};

//  COMMENT APIs

export const commentAPI = {
  // Get comments for a video
  getVideoComments: async (videoId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await API.get(`/videos/${videoId}/comments?${queryString}`);
  },

  // Add comment to video
  addComment: async (videoId, commentData) => {
    return await API.post(`/videos/${videoId}/comments`, commentData);
  },

  // Update/Edit comment
  updateComment: async (commentId, commentData) => {
    return await API.put(`/comments/${commentId}`, commentData);
  },

  // Delete comment
  deleteComment: async (commentId) => {
    return await API.delete(`/comments/${commentId}`);
  },

  // Like/Dislike comment
  toggleCommentLike: async (commentId, action) => {
    return await API.put(`/comments/${commentId}/like`, { action });
  },

  // Get user's like status for a comment
  getCommentLikeStatus: async (commentId) => {
    return await API.get(`/comments/${commentId}/like-status`);
  },
};

//  USER APIs FOR AUTH AND PROFILE

export const userAPI = {
  // Update user profile
  updateProfile: async (profileData) => {
    return await API.put("/users/profile", profileData);
  },

  // Get user profile
  getProfile: async () => {
    return await API.get("/users/profile");
  },
  // Register user
  register: async (userData) => {
    return await API.post("/auth/register", userData);
  },

  // Login user
  login: async (credentials) => {
    return await API.post("/auth/login", credentials);
  },
};

// Error handling

export const handleAPIError = (error) => {
  console.error("API Error:", error);

  if (error.response) {
    return {
      title: error.response.data.error.title || "Error",
      message:
        error.response.data.error.message || "An unexpected error occurred",
    };
  } else if (error.request) {
    return {
      title: "Network Error",
      message: "Unable to connect to the server. Please try again.",
    };
  } else if (error.error) {
    return {
      title: error.error.title || "Error",
      message: error.error.message || "An unexpected error occurred",
    };
  }

  return {
    title: "Network Error",
    message: "Unable to connect to the server. Please try again.",
  };
};

// Check if API response is successful
export const isAPISuccess = (response) => {
  return response && response.success === true;
};

export default API;

// Import controller functions to handle video-related routes
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { 
  createVideo, 
  updateVideo, 
  deleteVideo, 
  getVideo, 
  getAllVideos,
  toggleLikeVideo,
  getVideoLikeStatus,
  getVideosByChannel 
} from "../controllers/video.controller.js";

export function videoRoutes(app) {
  // Public routes
  app.get("/api/videos", getAllVideos); // Get all videos
  app.get("/api/videos/:videoId", getVideo); // Get specific video
  app.get("/api/channels/:channelId/videos", getVideosByChannel); // Get videos by channel
  
  // Protected routes (require authentication)
  app.post("/api/videos", authenticateToken, createVideo); // Create video
  app.put("/api/videos/:videoId", authenticateToken, updateVideo); // Update video
  app.delete("/api/videos/:videoId", authenticateToken, deleteVideo); // Delete video
  app.put("/api/videos/:videoId/like", authenticateToken, toggleLikeVideo); // Like/unlike video
  app.get("/api/videos/:videoId/like-status", authenticateToken, getVideoLikeStatus); // Get user's like status
}
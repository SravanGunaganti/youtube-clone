// Import controller functions to handle video-related routes
import { authenticateToken } from "../middlewares/authenticateToken.js";
import {validateObjectId} from "../middlewares/validateObjectId.js"
import { 
  createVideo, 
  updateVideo, 
  deleteVideo, 
  getVideo, 
  getAllVideos,
  toggleLikeVideo,
  getVideoLikeStatus,
  getVideosByChannel,
  videoExists
} from "../controllers/video.controller.js";

export function videoRoutes(app) {
  // Public routes
  app.get("/api/videos", getAllVideos); // Get all videos
  app.get("/api/videos/:videoId",validateObjectId('videoId'), getVideo); // Get specific video
  app.get("/api/channels/:channelId/videos",validateObjectId('channelId'), getVideosByChannel); // Get videos by channel
  app.get("/api/videos/:videoId/exist",validateObjectId('videoId'), videoExists); // Check if video exists
  
  // Protected routes (require authentication)
  app.post("/api/videos", authenticateToken, createVideo); // Create video
  app.put("/api/videos/:videoId", authenticateToken,validateObjectId('videoId'), updateVideo); // Update video
  app.delete("/api/videos/:videoId", authenticateToken,validateObjectId('videoId'), deleteVideo); // Delete video
  app.put("/api/videos/:videoId/like", authenticateToken,validateObjectId('videoId'), toggleLikeVideo); // Like/unlike video
  app.get("/api/videos/:videoId/like-status", authenticateToken,validateObjectId('videoId'), getVideoLikeStatus); // Get user's like status
}
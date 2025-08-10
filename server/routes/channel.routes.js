// Import controller functions to handle channel-related routes
import { 
  createChannel, 
  updateChannel, 
  deleteChannel, 
  getChannel, 
  getMyChannel,
  getAllChannels,
  channelExists
} from "../controllers/channel.controller.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import {validateObjectId} from "../middlewares/validateObjectId.js"

export function channelRoutes(app) {
  // Public routes
  app.get("/api/channels", getAllChannels); // Get all channels
  app.get("/api/channels/:channelId",validateObjectId('channelId'), getChannel); // Get specific channel
  app.get("/api/channels/:channelId/exist",validateObjectId('channelId'), channelExists); // Check if channel exists
  
  // Protected routes (require authentication)
  app.post("/api/channels", authenticateToken, createChannel); // Create channel
  app.get("/api/my-channel", authenticateToken, getMyChannel); // Get user's own channel
  app.put("/api/channels/:channelId", authenticateToken,validateObjectId('channelId'), updateChannel); // Update channel
  app.delete("/api/channels/:channelId", authenticateToken,validateObjectId('channelId'), deleteChannel); // Delete channel
}

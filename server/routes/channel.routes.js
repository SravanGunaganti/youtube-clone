// Import controller functions to handle channel-related routes
import { 
  createChannel, 
  updateChannel, 
  deleteChannel, 
  getChannel, 
  getMyChannel,
  getAllChannels 
} from "../controllers/channel.controller.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";

export function channelRoutes(app) {
  // Public routes
  app.get("/api/channels", getAllChannels); // Get all channels
  app.get("/api/channels/:channelId", getChannel); // Get specific channel
  
  // Protected routes (require authentication)
  app.post("/api/channels", authenticateToken, createChannel); // Create channel
  app.get("/api/my-channel", authenticateToken, getMyChannel); // Get user's own channel
  app.put("/api/channels/:channelId", authenticateToken, updateChannel); // Update channel
  app.delete("/api/channels/:channelId", authenticateToken, deleteChannel); // Delete channel
}

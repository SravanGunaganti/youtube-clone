// Import controller functions to handle user-related routes
import { registerUser, loginUser, verifyUser, updateProfile } from "../controllers/user.controller.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";

export function userRoutes(app) {
  // Public routes
  app.post("/api/auth/register",registerUser); // Register user
  app.post("/api/auth/login", loginUser); // Login user
  
  // Protected routes (require authentication)
  app.get("/api/auth/verify", authenticateToken, verifyUser); // Verify JWT token
  app.put("/api/users/profile", authenticateToken, updateProfile); // Update user profile
}

// Import controller functions to handle comment-related routes
import { 
  addComment, 
  deleteComment, 
  getVideoComments, 
  updateComment, 
  toggleCommentLike 
} from "../controllers/comment.controller.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";

export function commentRoutes(app) {
  // Public routes
  app.get("/api/videos/:videoId/comments", getVideoComments); // Get comments for a specific video
  
  // Protected routes (require authentication)
  app.post("/api/videos/:videoId/comments", authenticateToken, addComment); // Add comment to video
  app.put("/api/comments/:commentId", authenticateToken, updateComment); // Edit comment
  app.delete("/api/comments/:commentId", authenticateToken, deleteComment); // Delete comment
  app.put("/api/comments/:commentId/like", authenticateToken, toggleCommentLike); // Like/dislike comment
}

// Import controller functions to handle comment-related routes
import { 
  addComment, 
  deleteComment, 
  getVideoComments, 
  updateComment, 
  toggleCommentLike 
} from "../controllers/comment.controller.js";
import { authenticateToken } from "../middlewares/authenticateToken.js";
import { validateObjectId } from "../middlewares/validateObjectId.js";

export function commentRoutes(app) {
  // Public routes
  app.get("/api/videos/:videoId/comments", getVideoComments); // Get comments for a specific video
  
  // Protected routes (require authentication)
  app.post("/api/videos/:videoId/comments", authenticateToken,validateObjectId('videoId'), addComment); // Add comment to video
  app.put("/api/comments/:commentId", authenticateToken,validateObjectId('commentId'), updateComment); // Edit comment
  app.delete("/api/comments/:commentId", authenticateToken,validateObjectId('commentId'), deleteComment); // Delete comment
  app.put("/api/comments/:commentId/like", authenticateToken,validateObjectId('commentId'), toggleCommentLike); // Like/dislike comment
}

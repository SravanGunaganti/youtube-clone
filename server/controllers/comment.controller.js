// import models
import Comment from "../models/Comment.model.js";
import Video from "../models/Video.model.js";

// import utility functions
import { sendErrorResponse } from "../utils/sendErrorResponse.js";
import { sendSuccessResponse } from "../utils/sendSuccessResponse.js";

// Add comment to video
export const addComment = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!text || text.trim().length === 0) {
      return sendErrorResponse(
        res,
        400,
        "Missing Comment Text",
        "Comment text is required."
      );
    }

    if (text.trim().length > 1000) {
      return sendErrorResponse(
        res,
        400,
        "Comment Too Long",
        "Comment cannot exceed 1000 characters."
      );
    }

    // Verify video exists
    const video = await Video.findById(videoId);
    if (!video) {
      return sendErrorResponse(
        res,
        404,
        "Video Not Found",
        "The requested video does not exist."
      );
    }

    // Create new comment
    const comment = await Comment.create({
      videoId,
      userId,
      text: text.trim(),
    });

    // Populate user info
    await comment.populate("userId", "username, avatar");


    return sendSuccessResponse(
      res,
      201,
      {
        id: comment._id,
        text: comment.text,
        timestamp: comment.timestamp,
        likes: comment.likes,
        dislikes: comment.dislikes,
        isEdited: comment.isEdited,
        user: {
          id: comment.userId._id,
          username: comment.userId.username,
          avatar: comment.userId.avatar
        },
      },
      "Comment added successfully"
    );
  } catch (error) {
    next(error);
  }
};

// Get comments for a video
export const getVideoComments = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    // Verify video exists
    const video = await Video.findById(videoId);
    if (!video) {
      return sendErrorResponse(
        res,
        404,
        "Video Not Found",
        "The requested video does not exist."
      );
    }

    // Get comments
    const comments = await Comment.find({ videoId })
      .populate("userId", "username avatar")
      .sort({ timestamp: -1 });

    // Return comments
    return sendSuccessResponse(
      res,
      200,
      {
        comments: comments.map((comment) => ({
          id: comment._id,
          text: comment.text,
          timestamp: comment.timestamp,
          likes: comment.likes,
          dislikes: comment.dislikes,
          isEdited: comment.isEdited,
          editedAt: comment.editedAt,
          user: {
            id: comment.userId._id,
            username: comment.userId.username,
            avatar: comment.userId.avatar
          },
        })),
      },
      "Comments retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

// Update/Edit comment
export const updateComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!text || text.trim().length === 0) {
      return sendErrorResponse(
        res,
        400,
        "Missing Comment Text",
        "Comment text is required."
      );
    }

    if (text.trim().length > 1000) {
      return sendErrorResponse(
        res,
        400,
        "Comment Too Long",
        "Comment cannot exceed 1000 characters."
      );
    }

    // Find comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return sendErrorResponse(
        res,
        404,
        "Comment Not Found",
        "The requested comment does not exist."
      );
    }
    // Check if the user owns the comment
    if (comment.userId.toString() !== userId.toString()) {
      return sendErrorResponse(
        res,
        403,
        "Access Denied",
        "You can only edit your own comments."
      );
    }

    // Update comment
    comment.text = text.trim();
    comment.isEdited = true;
    comment.editedAt = new Date();
    await comment.save();

    // Populate user info
    await comment.populate("userId", "username");

    // Return comment
    return sendSuccessResponse(
      res,
      200,
      {
        id: comment._id,
        text: comment.text,
        timestamp: comment.timestamp,
        likes: comment.likes,
        dislikes: comment.dislikes,
        isEdited: comment.isEdited,
        editedAt: comment.editedAt,
        user: {
          id: comment.userId._id,
          username: comment.userId.username,
        },
      },
      "Comment updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

// Delete comment
export const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    // Find comment
    const comment = await Comment.findById(commentId).populate(
      "videoId",
      "uploader"
    );
    if (!comment) {
      return sendErrorResponse(
        res,
        404,
        "Comment Not Found",
        "The requested comment does not exist."
      );
    }

    // Check if user owns the comment or the video
    const isCommentOwner = comment.userId.toString() === userId.toString();
    const isVideoOwner =
      comment.videoId.uploader.toString() === userId.toString();

    if (!isCommentOwner && !isVideoOwner) {
      return sendErrorResponse(
        res,
        403,
        "Access Denied",
        "You can only delete your own comments or comments on your videos."
      );
    }

    // Delete comment
    await Comment.findByIdAndDelete(commentId);
    // Return success
    return sendSuccessResponse(res, 200, null, "Comment deleted successfully");
  } catch (error) {
    next(error);
  }
};

// Toggle like/dislike on comment
export const toggleCommentLike = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const { action } = req.body; // 'like' or 'dislike'
    const userId = req.user._id;

    // Find comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return sendErrorResponse(
        res,
        404,
        "Comment Not Found",
        "The requested comment does not exist."
      );
    }

    // Check if user has already liked/disliked
    const hasLiked = comment.likedBy.includes(userId);
    const hasDisliked = comment.dislikedBy.includes(userId);

    if (action === "like") {
      if (hasLiked) {
        // Remove like
        comment.likedBy.pull(userId);
        comment.likes = Math.max(0, comment.likes - 1);
      } else {
        // Add like
        comment.likedBy.push(userId);
        comment.likes += 1;

        // Remove dislike if exists
        if (hasDisliked) {
          comment.dislikedBy.pull(userId);
          comment.dislikes = Math.max(0, comment.dislikes - 1);
        }
      }
    } else if (action === "dislike") {
      if (hasDisliked) {
        // Remove dislike
        comment.dislikedBy.pull(userId);
        comment.dislikes = Math.max(0, comment.dislikes - 1);
      } else {
        // Add dislike
        comment.dislikedBy.push(userId);
        comment.dislikes += 1;

        // Remove like if exists
        if (hasLiked) {
          comment.likedBy.pull(userId);
          comment.likes = Math.max(0, comment.likes - 1);
        }
      }
    } else {
      // Invalid action
      return sendErrorResponse(
        res,
        400,
        "Invalid Action",
        "Action must be either 'like' or 'dislike'."
      );
    }

    // Save comment
    await comment.save();

    // Return likes and dislikes and whether user has liked/disliked comment
    return sendSuccessResponse(
      res,
      200,
      {
        likes: comment.likes,
        dislikes: comment.dislikes,
        userLiked: comment.likedBy.includes(userId),
        userDisliked: comment.dislikedBy.includes(userId),
      },
      `Comment ${action}d successfully`
    );
  } catch (error) {
    next(error);
  }
};

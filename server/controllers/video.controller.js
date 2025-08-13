import Video from "../models/Video.model.js";
import Channel from "../models/Channel.model.js";
import { sendErrorResponse } from "../utils/sendErrorResponse.js";
import { sendSuccessResponse } from "../utils/sendSuccessResponse.js";

// Create a new video
export const createVideo = async (req, res, next) => {
  try {
    const {
      title,
      description,
      videoUrl,
      thumbnailUrl,
      category = "Other",
    } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!title || !description || !videoUrl) {
      return sendErrorResponse(
        res,
        400,
        "Missing Required Fields",
        "Title, description, and video URL are required."
      );
    }

    // Find user's channel
    const channel = await Channel.findOne({ owner: userId });
    if (!channel) {
      return sendErrorResponse(
        res,
        404,
        "Channel Not Found",
        "You need to create a channel before uploading videos."
      );
    }

    // Create new video
    const video = await Video.create({
      title: title.trim(),
      description: description.trim(),
      videoUrl,
      thumbnailUrl: thumbnailUrl || "https://via.placeholder.com/320x180",
      category,
      channelId: channel._id,
      uploader: userId,
    });

    // Add video to channel's videos array
    await Channel.findByIdAndUpdate(channel._id, {
      $push: { videos: video._id },
    });

    // Populate video with channel and uploader info
    await video.populate([
      { path: "channelId", select: "channelName" },
      { path: "uploader", select: "username" },
    ]);
    // Return video
    return sendSuccessResponse(
      res,
      201,
      {
        id: video._id,
        title: video.title,
        description: video.description,
        videoUrl: video.videoUrl,
        thumbnailUrl: video.thumbnailUrl,
        category: video.category,
        views: video.views,
        likes: video.likes,
        dislikes: video.dislikes,
        channel: {
          id: video.channelId._id,
          name: video.channelId.channelName,
          avatar: video.channelId.avatar,
        },
        uploader: {
          id: video.uploader._id,
          username: video.uploader.username,
          avatar: video.uploader.avatar,
        },
        uploadDate: video.uploadDate,
        createdAt: video.createdAt,
      },
      "Video uploaded successfully"
    );
  } catch (error) {
    next(error);
  }
};

// Get video by ID
export const getVideo = async (req, res, next) => {
  try {
    const { videoId } = req.params;

    const video = await Video.findById(videoId)
      .populate(
        "channelId",
        "channelName channelBanner owner subscribers avatar isVerified"
      )
      .populate("uploader", "username")
      .populate("channelId.owner", "username");

    // Check if video exists
    if (!video) {
      return sendErrorResponse(
        res,
        404,
        "Video Not Found",
        "The requested video does not exist."
      );
    }

    // Increment view count
    await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });
    // Populate video with channel and uploader info
    return sendSuccessResponse(
      res,
      200,
      {
        id: video._id,
        title: video.title,
        description: video.description,
        videoUrl: video.videoUrl,
        thumbnailUrl: video.thumbnailUrl,
        category: video.category,
        views: video.views + 1,
        likes: video.likes,
        dislikes: video.dislikes,

        channel: {
          id: video.channelId._id,
          name: video.channelId.channelName,
          banner: video.channelId.channelBanner,
          avatar: video.channelId.avatar,
          subscribers: video.channelId.subscribers,
          isVerified: video.channelId.isVerified,

          owner: {
            id: video.channelId.owner._id,
            username: video.channelId.owner.username,
            avatar: video.channelId.owner.avatar,
          },
        },
        uploader: {
          id: video.uploader._id,
          username: video.uploader.username,
          avatar: video.uploader.avatar,
        },
        uploadDate: video.uploadDate,
        comments: video.comments,
        createdAt: video.createdAt,
        updatedAt: video.updatedAt,
      },
      "Video retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

// Get all videos
export const getAllVideos = async (req, res, next) => {
  try {
    const videos = await Video.find()
      .populate("channelId", "channelName avatar isVerified")
      .populate("uploader", "username")
      .select(
        "title description thumbnailUrl videoUrl views likes uploadDate category"
      )
      .sort({ uploadDate: -1 });

    // Return videos
    return sendSuccessResponse(
      res,
      200,
      {
        videos: videos.map((video) => ({
          id: video._id,
          title: video.title,
          thumbnailUrl: video.thumbnailUrl,
          views: video.views,
          likes: video.likes,
          category: video.category,

          dislikes: video.dislikes,
          videoUrl: video.videoUrl,
          channel: {
            id: video.channelId._id,
            name: video.channelId.channelName,
            avatar: video.channelId.avatar,
            isVerified: video.channelId.isVerified,
          },
          uploader: {
            id: video.uploader._id,
            username: video.uploader.username,
            avatar: video.uploader.avatar,
          },
          uploadDate: video.uploadDate,
        })),
      },
      "Videos retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

// Update video
export const updateVideo = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const { title, description, thumbnailUrl, category } = req.body;
    const userId = req.user._id;

    // Find video and verify ownership
    const video = await Video.findById(videoId);
    if (!video) {
      return sendErrorResponse(
        res,
        404,
        "Video Not Found",
        "The requested video does not exist."
      );
    }

    if (video.uploader.toString() !== userId.toString()) {
      return sendErrorResponse(
        res,
        403,
        "Access Denied",
        "You can only update your own videos."
      );
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      videoId,
      {
        ...(title && { title: title.trim() }),
        ...(description && { description: description.trim() }),
        ...(thumbnailUrl && { thumbnailUrl }),
        ...(category && { category }),
      },
      { new: true, runValidators: true }
    ).populate([
      { path: "channelId", select: "channelName avatar isVerified" },
      { path: "uploader", select: "username" },
    ]);

    // Return updated video
    return sendSuccessResponse(
      res,
      200,
      {
        id: updatedVideo._id,
        title: updatedVideo.title,
        description: updatedVideo.description,
        thumbnailUrl: updatedVideo.thumbnailUrl,
        videoUrl: updatedVideo.videoUrl,
        category: updatedVideo.category,
        views: updatedVideo.views,
        likes: updatedVideo.likes,
        dislikes: updatedVideo.dislikes,
        channel: {
          id: updatedVideo.channelId._id,
          name: updatedVideo.channelId.channelName,
          avatar: updatedVideo.channelId.avatar,
          isVerified: updatedVideo.channelId.isVerified,
        },
        uploader: {
          id: updatedVideo.uploader._id,
          username: updatedVideo.uploader.username,
          avatar: updatedVideo.uploader.avatar,
        },
        uploadDate: updatedVideo.uploadDate,
        createdAt: updatedVideo.createdAt,
        updatedAt: updatedVideo.updatedAt,
      },
      "Video updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

// Delete video
export const deleteVideo = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const userId = req.user._id;

    // Find video and verify ownership
    const video = await Video.findById(videoId);
    if (!video) {
      return sendErrorResponse(
        res,
        404,
        "Video Not Found",
        "The requested video does not exist."
      );
    }

    if (video.uploader.toString() !== userId.toString()) {
      return sendErrorResponse(
        res,
        403,
        "Access Denied",
        "You can only delete your own videos."
      );
    }

    // Remove video from channel's videos array
    await Channel.findByIdAndUpdate(video.channelId, {
      $pull: { videos: videoId },
    });

    // Delete the video
    await Video.findByIdAndDelete(videoId);

    return sendSuccessResponse(res, 200, null, "Video deleted successfully");
  } catch (error) {
    next(error);
  }
};

// Toggle like/dislike video
export const toggleLikeVideo = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const { action } = req.body; // 'like' or 'dislike'
    const userId = req.user._id;

    const video = await Video.findById(videoId);
    if (!video) {
      return sendErrorResponse(
        res,
        404,
        "Video Not Found",
        "The requested video does not exist."
      );
    }

    const hasLiked = video.likedBy.includes(userId);
    const hasDisliked = video.dislikedBy.includes(userId);

    if (action === "like") {
      if (hasLiked) {
        // Remove like
        video.likedBy.pull(userId);
        video.likes = Math.max(0, video.likes - 1);
      } else {
        // Add like
        video.likedBy.push(userId);
        video.likes += 1;

        // Remove dislike if exists
        if (hasDisliked) {
          video.dislikedBy.pull(userId);
          video.dislikes = Math.max(0, video.dislikes - 1);
        }
      }
    } else if (action === "dislike") {
      if (hasDisliked) {
        // Remove dislike
        video.dislikedBy.pull(userId);
        video.dislikes = Math.max(0, video.dislikes - 1);
      } else {
        // Add dislike
        video.dislikedBy.push(userId);
        video.dislikes += 1;

        // Remove like if exists
        if (hasLiked) {
          video.likedBy.pull(userId);
          video.likes = Math.max(0, video.likes - 1);
        }
      }
    } else {
      return sendErrorResponse(
        res,
        400,
        "Invalid Action",
        "Action must be either 'like' or 'dislike'."
      );
    }

    await video.save();

    return sendSuccessResponse(
      res,
      200,
      {
        likes: video.likes,
        dislikes: video.dislikes,
        userLiked: video.likedBy.includes(userId),
        userDisliked: video.dislikedBy.includes(userId),
      },
      `Video ${action}d successfully`
    );
  } catch (error) {
    next(error);
  }
};

// Get user's like/dislike status for a video
export const getVideoLikeStatus = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const userId = req.user._id;

    const video = await Video.findById(videoId).select(
      "likes dislikes likedBy dislikedBy"
    );
    if (!video) {
      return sendErrorResponse(
        res,
        404,
        "Video Not Found",
        "The requested video does not exist."
      );
    }

    return sendSuccessResponse(
      res,
      200,
      {
        likes: video.likes,
        dislikes: video.dislikes,
        userLiked: video.likedBy.includes(userId),
        userDisliked: video.dislikedBy.includes(userId),
      },
      "Video like status retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

// Get videos by channel
export const getVideosByChannel = async (req, res, next) => {
  try {
    const { channelId } = req.params;

    const videos = await Video.find({ channelId })
      .populate("uploader", "username")
      .select("title thumbnailUrl views likes uploadDate category description")
      .sort({ uploadDate: -1 });

    return sendSuccessResponse(
      res,
      200,
      {
        videos: videos.map((video) => ({
          id: video._id,
          title: video.title,
          description: video.description,
          thumbnailUrl: video.thumbnailUrl,
          views: video.views,
          likes: video.likes,
          category: video.category,
          uploader: {
            id: video.uploader._id,
            username: video.uploader.username,
            avatar: video.uploader.avatar,
          },
          uploadDate: video.uploadDate,
        })),
      },
      "Channel videos retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

// Check if video exists
export const videoExists = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const video = await Video.findById(videoId);
    if (!video) {
      return sendErrorResponse(
        res,
        404,
        "Video Not Found",
        "The requested video does not exist."
      );
    }
    return sendSuccessResponse(res, 200, { exists: true }, "Video exists");
  } catch (error) {
    next(error);
  }
};

// import models
import Channel from "../models/Channel.model.js";
import Video from "../models/Video.model.js";

// import utility functions
import { sendErrorResponse } from "../utils/sendErrorResponse.js";
import { sendSuccessResponse } from "../utils/sendSuccessResponse.js";

// Create a new channel
export const createChannel = async (req, res, next) => {
  try {
    const { channelName, description } = req.body;
    const userId = req.user._id;

    // Check if user already has a channel
    const existingChannel = await Channel.findOne({ owner: userId });
    if (existingChannel) {
      return sendErrorResponse(
        res,
        409,
        "Channel Already Exists",
        "You already have a channel. Each user can only create one channel."
      );
    }

    // Validate required fields
    if (!channelName || !description) {
      return sendErrorResponse(
        res,
        400,
        "Missing Required Fields",
        "Channel name and description are required."
      );
    }

    // Create new channel
    const channel = await Channel.create({
      channelName: channelName.trim(),
      description: description.trim(),
      owner: userId,
      channelBanner: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7piWAeCamJ_yKmGW90xWw3P6y7WlNRo9DVAxDWtakyjZP5cUziCwGk0ktcJBoQNtsBP8&usqp=CAU`,
    });

    // Populate owner information
    await channel.populate("owner", "username email");

    return sendSuccessResponse(
      res,
      201,
      {
        id: channel._id,
        channelName: channel.channelName,
        description: channel.description,
        channelBanner: channel.channelBanner,
        avatar: channel.avatar,
        subscribers: channel.subscribers,
        owner: {
          id: channel.owner._id,
          username: channel.owner.username,
          email: channel.owner.email,
        },
        createdAt: channel.createdAt,
      },
      "Channel created successfully"
    );
  } catch (error) {
    next(error);
  }
};

// Get channel by ID
export const getChannel = async (req, res, next) => {
  try {
    const { channelId } = req.params;

    // Find channel
    const channel = await Channel.findById(channelId)
      .populate("owner", "username email")
      .populate({
        path: "videos",
        select:
          "title thumbnailUrl views uploader likes dislikes uploadDate description",
        options: { sort: { uploadDate: -1 } },
      });

    // Check if channel exists
    if (!channel) {
      return sendErrorResponse(
        res,
        404,
        "Channel Not Found",
        "The requested channel does not exist."
      );
    }

    // Return channel
    return sendSuccessResponse(
      res,
      200,
      {
        id: channel._id,
        channelName: channel.channelName,
        description: channel.description,
        channelBanner: channel.channelBanner,
        avatar: channel.avatar,
        subscribers: channel.subscribers,
        videoCount: channel.videos.length,
        owner: {
          id: channel.owner._id,
          username: channel.owner.username,
          email: channel.owner.email,
        },
        videos: channel.videos,
        createdAt: channel.createdAt,
        updatedAt: channel.updatedAt,
      },
      "Channel retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

// Get user's own channel
export const getMyChannel = async (req, res, next) => {
  try {
    const userId = req.user._id;
    // Find channel
    const channel = await Channel.findOne({ owner: userId })
      .populate("owner", "username email")
      .populate({
        path: "videos",
        select:
          "title thumbnailUrl uploader views likes dislikes uploadDate description",
        options: { sort: { uploadDate: -1 } },
      });

    // Check if channel exists
    if (!channel) {
      return sendErrorResponse(
        res,
        404,
        "Channel Not Found",
        "You haven't created a channel yet. Create one to get started."
      );
    }

    // Return channel
    return sendSuccessResponse(
      res,
      200,
      {
        id: channel._id,
        channelName: channel.channelName,
        description: channel.description,
        channelBanner: channel.channelBanner,
        subscribers: channel.subscribers,
        avatar: channel.avatar,
        videoCount: channel.videos.length,
        owner: {
          id: channel.owner._id,
          username: channel.owner.username,
          email: channel.owner.email,
        },
        videos: channel.videos,
        createdAt: channel.createdAt,
        updatedAt: channel.updatedAt,
      },
      "Your channel retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

// Update channel
export const updateChannel = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const { channelName, description, channelBanner, avatar } = req.body;
    const userId = req.user._id;

    // Find channel and verify ownership
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return sendErrorResponse(
        res,
        404,
        "Channel Not Found",
        "The requested channel does not exist."
      );
    }
    // Check if the user owns the channel
    if (channel.owner.toString() !== userId.toString()) {
      return sendErrorResponse(
        res,
        403,
        "Access Denied",
        "You can only update your own channel."
      );
    }

    // Update channel
    const updatedChannel = await Channel.findByIdAndUpdate(
      channelId,
      {
        ...(channelName && { channelName: channelName.trim() }),
        ...(description && { description: description.trim() }),
        ...(channelBanner && { channelBanner }),
        ...(avatar && { avatar }),
      },
      { new: true, runValidators: true }
    ).populate("owner", "username email");

    // Return updated channel
    return sendSuccessResponse(
      res,
      200,
      {
        id: updatedChannel._id,
        channelName: updatedChannel.channelName,
        description: updatedChannel.description,

        channelBanner: updatedChannel.channelBanner,
        subscribers: updatedChannel.subscribers,
        avatar: updatedChannel.avatar,
        videoCount: updatedChannel.videos.length,
        owner: {
          id: updatedChannel.owner._id,
          username: updatedChannel.owner.username,
          email: updatedChannel.owner.email,
        },
        videos: updatedChannel.videos,
        createdAt: updatedChannel.createdAt,
        updatedAt: updatedChannel.updatedAt,
      },
      "Channel updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

// Delete channel
export const deleteChannel = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const userId = req.user._id;

    // Find channel and verify ownership
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return sendErrorResponse(
        res,
        404,
        "Channel Not Found",
        "The requested channel does not exist."
      );
    }

    // Check if the user owns the channel
    if (channel.owner.toString() !== userId.toString()) {
      return sendErrorResponse(
        res,
        403,
        "Access Denied",
        "You can only delete your own channel."
      );
    }

    // Delete all videos associated with the channel
    await Video.deleteMany({ channelId });

    // Delete the channel
    await Channel.findByIdAndDelete(channelId);

    return sendSuccessResponse(
      res,
      200,
      null,
      "Channel and all associated videos deleted successfully"
    );
  } catch (error) {
    next(error);
  }
};

// Get all channels
export const getAllChannels = async (req, res, next) => {
  try {
    // Find all channels
    const channels = await Channel.find()
      .populate("owner", "username")
      .select("channelName description channelBanner subscribers createdAt")
      .sort({ subscribers: -1, createdAt: -1 });

    // Return channels
    return sendSuccessResponse(
      res,
      200,
      {
        channels: channels.map((channel) => ({
          id: channel._id,
          channelName: channel.channelName,
          description: channel.description,
          channelBanner: channel.channelBanner,
          subscribers: channel.subscribers,
          owner: {
            id: channel.owner._id,
            username: channel.owner.username,
          },
          createdAt: channel.createdAt,
        })),
      },
      "Channels retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

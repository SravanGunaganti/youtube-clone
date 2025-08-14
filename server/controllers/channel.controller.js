// import models
import Channel from "../models/Channel.model.js";
import User from "../models/User.model.js";
import Video from "../models/Video.model.js";

// import utility functions
import { sendErrorResponse } from "../utils/sendErrorResponse.js";
import { sendSuccessResponse } from "../utils/sendSuccessResponse.js";

// Create a new channel
export const createChannel = async (req, res, next) => {
  try {
    const { channelName, description, avatar } = req.body;
    const userId = req.user._id;

    // Check if user already has a channel
    const existingChannel = await Channel.findOne({ owner: userId });
    const existingChannelName = await Channel.findOne({
      channelName: channelName.trim(),
    });

    if (existingChannelName) {
      return sendErrorResponse(
        res,
        409,
        "Channel Name Already Taken",
        "Channel name already exists. Please choose a different channel name."
      );
    }
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
      avatar: avatar?.trim() || null,
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
        isVerified: channel.isVerified,
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
        isVerified: channel.isVerified,
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
      })
      .populate("videos.uploader", "username avatar");

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
        isVerified: channel.isVerified,
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

    // Check if channel name is already taken
    const existingChannel = await Channel.findOne({
      channelName: channelName.trim(),
    });
    if (existingChannel && existingChannel._id.toString() !== channelId) {
      return sendErrorResponse(
        res,
        409,
        "Channel Name Already Taken",
        "Channel name already exists. Please choose a different channel name."
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
        isVerified: updatedChannel.isVerified,
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

// Check if channel exists
export const channelExists = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return sendErrorResponse(
        res,
        404,
        "Channel Not Found",
        "The requested channel does not exist."
      );
    }
    return sendSuccessResponse(res, 200, { exists: true }, "Channel exists");
  } catch (error) {
    next(error);
  }
};
// Toggle subscribe
export const toggleSubscribe = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const userId = req.user._id;

    // 1. Find the channel
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return sendErrorResponse(
        res,
        404,
        "Channel not found",
        "The specified channel does not exist."
      );
    }

    // Check if user is trying to subscribe to their own channel
    if (channel.owner.toString() === userId.toString()) {
      return sendErrorResponse(
        res,
        400,
        "Invalid operation",
        "You cannot subscribe to your own channel."
      );
    }

    // Check if user is already subscribed
    const isSubscribed = channel.subscribedBy.includes(userId);

    if (isSubscribed) {
      // Remove subscription
      channel.subscribedBy.pull(userId);
      channel.subscribers = Math.max(0, channel.subscribers - 1);
    } else {
      // Add subscription
      channel.subscribedBy.push(userId);
      channel.subscribers += 1;
    }
    await channel.save();
    // Return updated subscription status,subscribers
    return sendSuccessResponse(
      res,
      200,
      {
        isSubscribed: !isSubscribed,
        subscribers: channel.subscribers,
      },
      isSubscribed ? "Unsubscribed successfully" : "Subscribed successfully"
    );
  } catch (error) {
    next(error);
  }
};

// Check if the authenticated user is subscribed to a channel
export const checkSubscriptionStatus = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    const userId = req.user._id;

    // Find the channel
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return sendErrorResponse(
        res,
        404,
        "Channel not found",
        "The specified channel does not exist."
      );
    }

    // Check if user is subscribed
    const isSubscribed = channel.subscribedBy.includes(userId);

    // Return subscription status
    return sendSuccessResponse(
      res,
      200,
      {
        isSubscribed,
        subscribers: channel.subscribers,
      },
      "Subscription status retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

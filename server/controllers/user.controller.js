import Channel from "../models/Channel.model.js";
import User from "../models/User.model.js";
// Importing utility functions for generating tokens and sending responses
import generateToken from "../utils/generateToken.js";
import { sendErrorResponse } from "../utils/sendErrorResponse.js";
import { sendSuccessResponse } from "../utils/sendSuccessResponse.js";

// Controller function to handle user registration
export const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, avatar } = req.body;

    // Check if email is existing in the database

    const userExists = await User.findOne({ email });
    if (userExists) {
      return sendErrorResponse(
        res,
        409,
        "Email already registered",
        "A user with this email already exists. Please login instead."
      );
    }
    // Create a new user if email is not registered
    const user = await User.create({
      username,
      email,
      password,
      avatar,
    });

    //Sending a success response with user details
    return sendSuccessResponse(
      res,
      200,
      {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
      "User Registered Successfully"
    );
  } catch (error) {
    next(error);
  }
};

// Controller function to handle user login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists with the provided email
    const user = await User.findOne({ email });

    // If user does not exist, return an error response
    if (!user) {
      return sendErrorResponse(
        res,
        404,
        "Email Not registered",
        "No user exists with the provided email. Please register first."
      );
    }

    // If user exists, compare the provided password with the stored password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendErrorResponse(
        res,
        401,
        "Invalid Credentials",
        "Incorrect password. Please try again.."
      );
    }
    // If user exists and password matches, generate a token
    const token = generateToken({
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    });
    const channel = await Channel.findOne({ owner: user._id });
    const data = {
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    };

    if (channel) {
      data.channelId = channel._id;
    }

    return sendSuccessResponse(
      res,
      200,
      data,
      "User LoggedIn Successfully",
      token
    );
  } catch (error) {
    next(error);
  }
};

export const verifyUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return sendErrorResponse(
        res,
        404,
        "User Not Registered",
        "No user associated with this token. Please re-authenticate."
      );
    }

    const channel = await Channel.findOne({ owner: user._id });
    const data = {
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    };

    if (channel) {
      data.channelId = channel._id;
    }
    return sendSuccessResponse(res, 200, data, "User Verified Successfully");
  } catch (error) {
    next(error);
  }
};

// Controller function to update user profile
export const updateProfile = async (req, res, next) => {
  try {
    const { username, avatar } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!username || username.trim().length < 2) {
      return sendErrorResponse(
        res,
        400,
        "Invalid Input",
        "Username must be at least 2 characters long."
      );
    }

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username: username.trim(),
        avatar: avatar ? avatar.trim() : null,
      },
      { new: true, runValidators: true }
    );

    // If user is not found, return an error response
    if (!updatedUser) {
      return sendErrorResponse(res, 404, "User Not Found", "User not found.");
    }

    // Get channel info if exists
    const channel = await Channel.findOne({ owner: updatedUser._id });
    const data = {
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
    };

    if (channel) {
      data.channelId = channel._id;
    }
    // Return success response
    return sendSuccessResponse(res, 200, data, "Profile updated successfully");
  } catch (error) {
    next(error);
  }
};

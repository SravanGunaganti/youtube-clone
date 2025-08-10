import mongoose from "mongoose";
import { sendErrorResponse } from "../utils/sendErrorResponse.js";

const fieldTexts = {
    videoId: "Video ID",
    channelId: "Channel ID",
    userId: "User ID",
    commentId: "Comment ID",

}


// Middleware to validate ObjectId in request parameters
export const validateObjectId = (field) => {
  return (req, res, next) => {
    const value = req.params?.[field];
    console.log(value);
    
    // Check if the value is provided
    if (!value) {
      return sendErrorResponse(
        res,
        400,
        `Missing ${fieldTexts[field]}`,
        `The field ${fieldTexts[field]} is required in request`
      );
    }
    // Validate the ObjectId format
    if (!mongoose.Types.ObjectId.isValid(value)) {
      console.log("Invalid ObjectId");
      return sendErrorResponse(
        res,
        400,
        `Invalid ${fieldTexts[field]}`,
        `The provided ${fieldTexts[field]} '${value}' is not a valid MongoDB ObjectId.`
      );
    }

    next();
  };
};

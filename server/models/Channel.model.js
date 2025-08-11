import mongoose from "mongoose";
// Defining the schema for the Channel model
const channelSchema = new mongoose.Schema({
  channelName: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  channelBanner: {
    type: String,
    default: null
  },
  avatar: {
    type: String,
    default: null
  },
  subscribers: {
    type: Number,
    default: 0
  },
  subscribedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video"
  }],
  totalViews: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Exporting the Channel model
const Channel = mongoose.model("Channel", channelSchema);
export default Channel;
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
    default: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=300&fit=crop"
  },
  avatar: {
    type: String,
    default: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face"
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
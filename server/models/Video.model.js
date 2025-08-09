import mongoose from "mongoose";

// Available video categories
const VIDEO_CATEGORIES = [
  'Gaming',
  'Music',
  'Sports',
  'News',
  'Entertainment',
  'Education',
  'Technology',
  'Comedy',
  'Travel',
  'Food',
  'Fashion',
  'Health',
  'Science',
  'Documentary',
  'Animation',
  'Movies',
  'TV Shows',
  'Vlogs',
  'Tutorials',
  'Reviews',
  'Other'
];

// Defining the schema for the Video model
const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Channel"
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },
  // Track users who liked/disliked to prevent duplicate actions
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  dislikedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  category: {
    type: String,
    required: true,
    enum: VIDEO_CATEGORIES,
    default: 'Other'
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Export categories for use in other files
export { VIDEO_CATEGORIES };
// Export the Video model
const Video = mongoose.model("Video", videoSchema);
export default Video;
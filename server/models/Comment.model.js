import mongoose from "mongoose";
// Defining the schema for the Comment model
const commentSchema = new mongoose.Schema({
  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Video"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  dislikedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});
// Exporting the Comment model
const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
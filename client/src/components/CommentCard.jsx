import React, { use, useEffect, useState } from "react";
import { getTimeAgo } from "../utils/utilityFunctions";
import { FaEdit, FaRegThumbsDown, FaRegThumbsUp, FaThumbsDown, FaThumbsUp, FaTrash } from "react-icons/fa";
import { BiDislike, BiLike } from "react-icons/bi";
import { commentAPI } from "../services/api";
import { set } from "mongoose";
function CommentCard({
  comment,
  editCommentText,
  setEditCommentText,
  editingComment,
  handleDeleteComment,
  handleEditComment,
  handleSaveEdit,
  handleCommentLike,
  isLoggedIn,
  authUser,
  handleCancelEdit,
}) {
  const [avatarError, setAvatarError] = useState(
    authUser?.avatar ? false : true
  );
  const [likesData, setLikesData] = useState({
    likes: comment?.likes || 0,
    dislikes: comment?.dislikes || 0,
    userLiked: false,
    userDisliked: false,
  });

  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      setAvatarError(false);
    };
    image.onerror = () => {
      setAvatarError(true);
    };
    image.src = comment?.user?.avatar;
  }, [comment?.user?.avatar]);

  const getCommentLikeStatus = async (commentId) => {
    try {
      const response = await commentAPI.getCommentLikeStatus(commentId);
      const data = response.data;
      setLikesData(data)
    } catch (error) {
      console.error("Error fetching comment like status:", error);
    }
  };
  useEffect(() => {
    if (comment) {
      getCommentLikeStatus(comment.id);
    }
  }, [comment]);
  return (
    <div className="flex gap-3">
      {comment?.user?.avatar && !avatarError ? (
        <img
          src={comment?.user.avatar}
          alt={comment?.user.username}
          className="w-10 h-10 object-cover rounded-full cursor-pointer"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-black">
          {comment?.user.username.charAt(0)?.toUpperCase()}
        </div>
      )}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-xs md:text-sm text-gray-900">
            {comment.user.username}
          </span>
          <span>•</span>
          <span className="text-gray-500 text-xs">
            {getTimeAgo(comment?.timestamp)}
          </span>
          {comment?.isEdited && (
            <span className="text-gray-400 text-xs">(edited)</span>
          )}
        </div>

        {/* Comment Text or Edit Form */}
        {editingComment === comment.id ? (
          <div className="mb-2">
            <textarea
              value={editCommentText}
              onChange={(e) => setEditCommentText(e.target.value)}
              className="text-xs md:text-sm w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-blue-500"
              rows={2}
              maxLength={1000}
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={handleCancelEdit}
                className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors">
                Cancel
              </button>
              <button
                onClick={() => handleSaveEdit(comment.id)}
                disabled={!editCommentText.trim()}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs md:text-sm text-gray-900 mb-2 leading-relaxed">
            {comment?.text}
          </p>
        )}

        {/* Comment Actions */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleCommentLike(comment.id, "like")}
              className={`flex items-center gap-1 transition-colors group `}>
              {
                likesData.userLiked
                  
                  ? <FaThumbsUp size={12} className="group-hover:scale-110 transition-transform" />
                  :<FaRegThumbsUp size={12} className="group-hover:scale-110 transition-transform" />
                  
              }
              {likesData.likes > 0 && (
                <span className="text-xs font-medium">{likesData.likes}</span>
              )}
            </button>
            <button
              onClick={() => handleCommentLike(comment.id, "dislike")}
              className={`transition-colors group`}>

                 {
                likesData.userDisliked
                ? <FaThumbsDown size={12} className="group-hover:scale-110 transition-transform" />
                  : <FaRegThumbsDown size={12} className="group-hover:scale-110 transition-transform" />
                  
                  
              }
              
            </button>
          </div>
          <button className="text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-1 rounded-full hover:bg-gray-100">
            Reply
          </button>
        </div>
      </div>

      {/* More options - Show edit/delete for comment owner */}
      {isLoggedIn && authUser?.id === comment?.user?.id && (
        <div className="relative">
          <div className="flex flex-col justify-start items-center gap-1">
            <button
              onClick={() => handleEditComment(comment)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Edit comment">
              <FaEdit size={16} />
            </button>
            <button
              onClick={() => handleDeleteComment(comment.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Delete comment">
              <FaTrash size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CommentCard;

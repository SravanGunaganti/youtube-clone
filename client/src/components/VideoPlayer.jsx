import React, { useState, useRef, useEffect, use } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getTimeAgo,
  formatNumber,
  getInitial,
} from "../utils/utilityFunctions";
import {
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaCompress,
  FaThumbsUp,
  FaThumbsDown,
  FaBell,
  FaFlag,
  FaEllipsisH,
  FaRegThumbsUp,
  FaRegThumbsDown,
} from "react-icons/fa";
import {
  MdMoreVert,
  MdOutlineSort,
  MdPause,
  MdPlayArrow,
  MdPlaylistAdd,
  MdReply,
  MdVerified,
} from "react-icons/md";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { BiLike, BiDislike, BiShare, BiPause } from "react-icons/bi";
import { RiDownloadLine, RiScissorsLine } from "react-icons/ri";
import {
  videoAPI,
  commentAPI,
  channelAPI,
  handleAPIError,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import { BsPlayFill } from "react-icons/bs";
import { toast } from "react-toastify";

import CommentCard from "./CommentCard";

import ConfirmModal from "./ConfirmModal";

const VideoPlayer = () => {
  const { videoId } = useParams();
  const { authUser, isLoggedIn } = useAuth();
  const videoRef = useRef(null);
  const progressRef = useRef(null);

  // Video player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [suggestedVideos, setSuggestedVideos] = useState([]);
  const [avatarError, setAvatarError] = useState(false);
  const [authAvatarError, setAuthAvatarError] = useState(false);

  // Video data states
  const [videoData, setVideoData] = useState({});
  const [videoLikeStatus, setVideoLikeStatus] = useState({
    likes: 0,
    dislikes: 0,
    userLiked: false,
    userDisliked: false,
  });

  // Subscription state
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);

  // Comment states
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [channelData, setChannelData] = useState({});
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState(null);
  const [poster, setPoster] = useState(
    "https://i.ytimg.com/vi/ScMzIvxBSi4/hqdefault.jpg"
  );
  useEffect(() => {
    const img = new Image();
    img.src = videoData.thumbnailUrl;
    img.onload = () => setPoster(img.src);
    img.onerror = () =>
      setPoster("https://i.ytimg.com/vi/ScMzIvxBSi4/hqdefault.jpg");
  }, [videoData.thumbnailUrl]);
  // Check subscription status
  const checkSubscriptionStatus = async (channelId) => {
    if (!isLoggedIn || authUser.channelId === channelId) return;

    try {
      setIsCheckingSubscription(true);
      const response = await channelAPI.getSubscriptionStatus(channelId);
      if (response.success) {
        setIsSubscribed(response.data.isSubscribed);
        // setSubscriberCount(response.data.subscribers);
      }
    } catch (error) {
      console.error("Error checking subscription status:", error);
      toast.error("Failed to check subscription status");
    } finally {
      setIsCheckingSubscription(false);
    }
  };

  // Toggle subscription
  const handleSubscribe = async (channelId) => {
    if (!isLoggedIn) {
      toast.error("Please sign in to subscribe to channels");
      return;
    }
    if (isCheckingSubscription) return;
    if (authUser.id === videoData.uploader.id) {
      toast.error("You cannot subscribe to your own channel");
      return;
    }

    try {
      const response = await channelAPI.toggleSubscribe(channelId);
      if (response.success) {
        setIsSubscribed(response.data.isSubscribed);
        setSubscriberCount(response.data.subscribers);
        toast.success(
          response.data.isSubscribed
            ? "Subscribed successfully!"
            : "Unsubscribed successfully"
        );
      }
    } catch (error) {
      console.error("Error toggling subscription:", error);
    }
  };

  // Fetch video data
  const fetchVideoData = async () => {
    try {
      const response = await videoAPI.getVideo(videoId);
      const channelResponse = await channelAPI.getChannel(
        response.data.channel.id
      );
      const comments = await commentAPI.getVideoComments(videoId);
      setSubscriberCount(response.data.channel.subscribers);

      // Check subscription status if user is logged in
      if (
        isLoggedIn &&
        response.data?.channel?.id &&
        response.data.uploader.id !== authUser.id
      ) {
        await checkSubscriptionStatus(response.data.channel.id);
      }

      setComments(comments.data.comments || []);

      if (response.success) {
        setVideoData(response.data);
        setVideoLikeStatus({
          likes: response.data.likes || 0,
          dislikes: response.data.dislikes || 0,
          userLiked: false,
          userDisliked: false,
        });

        const data = channelResponse.data;
        const image = new Image();
        image.src = data.avatar;
        image.onload = () => {
          setAvatarError(false);
          setChannelData({
            id: data._id,
            name: data.channelName,
            subscribers: data.subscribers,
            avatar: data.avatar,
            isVerified: data.isVerified,
          });
        };
        image.onerror = () => {
          setAvatarError(true);
          setChannelData({
            id: data._id,
            name: data.channelName,
            avatar: "",
            subscribers: data.subscribers,
            isVerified: data.isVerified,
          });
        };

        setChannelData({
          id: data._id,
          name: data.channelName,
          avatar: data.avatar,
          subscribers: data.subscribers,
          isVerified: data.isVerified,
        });

        // Fetch user's like status if logged in
        if (isLoggedIn) {
          fetchVideoLikeStatus();
        }
      }
    } catch (error) {
      console.error("Error fetching video data:", handleAPIError(error));
    }
  };

  // Fetch videos
  const fetchVideos = async () => {
    try {
      const response = await videoAPI.getAllVideos();
      if (response.success) {
        const filteredVideos = response.data.videos.filter(
          (video) => video.id !== videoId
        );
        // random suggested videos
        const randomVideos = filteredVideos
          .sort(() => 0.5 - Math.random())
          .slice(0, 5);
        setSuggestedVideos(randomVideos);
      }
    } catch (error) {
      console.error("Error fetching videos:", handleAPIError(error));
    }
  };

  // Handle video controls
  useEffect(() => {
    let timeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener("mousemove", handleMouseMove);
      return () => {
        videoElement.removeEventListener("mousemove", handleMouseMove);
        clearTimeout(timeout);
      };
    }
  }, []);

  useEffect(() => {
    if (videoId) {
      fetchVideoData();
      fetchVideos();
    }
  }, [videoId]);

  useEffect(() => {
    const image = new Image();
    image.src = authUser?.avatar;
    image.onload = () => {
      setAuthAvatarError(false);
    };
    image.onerror = () => {
      setAuthAvatarError(true);
    };
  }, [authUser?.avatar]);

  // Fetch video like status
  const fetchVideoLikeStatus = async () => {
    try {
      const response = await videoAPI.getVideoLikeStatus(videoId);
      if (response.success) {
        setVideoLikeStatus(response.data);
      }
    } catch (error) {
      console.error("Error fetching video like status:", handleAPIError(error));
    }
  };

  // Handle comments
  const handleEditComment = (comment) => {
    setEditingComment(comment.id);
    setEditCommentText(comment.text);
  };

  // Handle comment actions
  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditCommentText("");
  };

  // Save edited comment
  const handleSaveEdit = async (commentId) => {
    if (!editCommentText.trim()) return;

    try {
      const response = await commentAPI.updateComment(commentId, {
        text: editCommentText.trim(),
      });

      if (response.success) {
        // Update the comment in the comments array
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId
              ? { ...comment, text: response.data.text }
              : comment
          )
        );
        setEditingComment(null);
        setEditCommentText("");
      }
    } catch (error) {
      console.error("Error updating comment:", handleAPIError(error));
    }
  };

  // Delete comment
  const handleDeleteComment = (commentId) => {
    setShowDeleteCommentModal(true);
    setDeleteCommentId(commentId);
  };

  const onConfirmDeleteComment = async () => {
    try {
      const response = await commentAPI.deleteComment(deleteCommentId);

      if (response.success) {
        // Remove the comment from the comments array
        setComments((prev) =>
          prev.filter((comment) => comment.id !== deleteCommentId)
        );
      }
    } catch (error) {
      console.error("Error deleting comment:", handleAPIError(error));
    }
    setShowDeleteCommentModal(false);
    setDeleteCommentId(null);
  };

  const handleClose = () => {
    setShowDeleteCommentModal(false);
    setDeleteCommentId(null);
  };

  // Like/dislike comment
  const handleCommentLike = async (commentId, action) => {
    if (!isLoggedIn) {
      toast.error("Please sign in to like comments");
      return;
    }

    try {
      const response = await commentAPI.toggleCommentLike(commentId, action);

      if (response.success) {
        // Update the comment's like status in the comments array
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  likes: response.data.likes,
                  dislikes: response.data.dislikes,
                  userLiked: response.data.userLiked,
                  userDisliked: response.data.userDisliked,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.error("Error liking comment:", handleAPIError(error));
    }
  };
  // Handle video controls
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Handle video loaded metadata
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Handle progress click
  const handleProgressClick = (e) => {
    if (progressRef.current && videoRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };
  // Handle mute
  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Format time
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  //  Handle like
  const handleLike = async () => {
    if (!isLoggedIn) {
      toast.error("Please sign in to like videos");
      return;
    }

    try {
      const response = await videoAPI.toggleLikeVideo(videoId, "like");
      if (response.success) {
        setVideoLikeStatus(response.data);
      }
    } catch (error) {
      console.error("Error liking video:", handleAPIError(error));
    }
  };

  // Handle dislike
  const handleDislike = async () => {
    if (!isLoggedIn) {
      toast.error("Please sign in to dislike videos");
      return;
    }

    try {
      const response = await videoAPI.toggleLikeVideo(videoId, "dislike");
      if (response.success) {
        setVideoLikeStatus(response.data);
      }
    } catch (error) {
      console.error("Error disliking video:", handleAPIError(error));
    }
  };

  // Handle comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return toast.error("Please sign in to comment");
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        text: newComment,
        userId: authUser.id,
        timeAgo: "Just now",
        replies: [],
      };
      try {
        const response = await commentAPI.addComment(videoId, comment);

        if (response.success) {
          setComments([response.data, ...comments]);
        }
      } catch (error) {
        console.error("Error adding comment:", handleAPIError(error));
      }
      setNewComment("");
    }
  };

  return (
    <div className="max-w-full mx-auto bg-white min-h-screen">
      <div className="flex flex-col xl:flex-row gap-6 xl:px-6 md:py-4">
        {/* Main Video Section */}
        <div className="flex-1 max-w-5xl">
          {/* Video Player */}
          <div className="relative w-full bg-black md:rounded-xl overflow-hidden mb-3">
            <video
              ref={videoRef}
              className="w-full aspect-video"
              controls={false}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onClick={togglePlay}
              poster={poster}
              onError={(e) =>
                (e.target.src = `https://filesamples.com/samples/video/mp4/sample_640x360.mp4`)
              }
              preload="metadata"
              src={`${videoData.videoUrl}`}>
              <source src={`${videoData.videoUrl}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Video Controls */}
            <div
              className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
                showControls ? "opacity-100" : "opacity-0"
              }`}>
              {/* Progress Bar */}
              <div
                ref={progressRef}
                className="w-full h-1.5 bg-white/30 rounded-full cursor-pointer mb-4"
                onClick={handleProgressClick}>
                <div
                  className="h-full bg-red-600 rounded-full"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-4">
                  <button
                    onClick={togglePlay}
                    className="hover:text-red-500 transition-colors">
                    {isPlaying ? (
                      <MdPause size={30} />
                    ) : (
                      <BsPlayFill size={30} />
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleMute}
                      className="hover:text-red-500 transition-colors">
                      {isMuted ? (
                        <FaVolumeMute size={20} />
                      ) : (
                        <FaVolumeUp size={20} />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-20 accent-blue-500"
                    />
                  </div>

                  <span className="text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <button
                  onClick={toggleFullscreen}
                  className="hover:text-red-500 transition-colors">
                  {isFullscreen ? (
                    <FaCompress size={20} />
                  ) : (
                    <FaExpand size={20} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Video Info */}
          <div className="px-4">
            <h1 className="text-xl font-semibold mb-3 leading-tight">
              {videoData.title}
            </h1>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center justify-between pt-4 ">
                <div className="flex items-center gap-3">
                  <Link to={`/channel/${videoData?.channel?.id}`}>
                    {channelData?.avatar || !avatarError ? (
                      <img
                        src={channelData.avatar}
                        alt={channelData.name}
                        className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-black">
                        {getInitial(channelData.name)}
                      </div>
                    )}
                  </Link>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/channel/${videoData?.channel?.id}`}
                        className="flex items-center gap-1">
                        <h3 className="font-medium text-base text-gray-900 cursor-pointer hover:text-gray-700 transition-colors">
                          {videoData?.channel?.name}
                        </h3>
                        {videoData?.channel?.isVerified && (
                          <IoCheckmarkCircleSharp
                            size={16}
                            className="text-gray-500"
                          />
                        )}
                      </Link>
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {formatNumber(subscriberCount)} subscribers
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleSubscribe(videoData?.channel?.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isSubscribed
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                        : "bg-black text-white hover:bg-gray-800"
                    }`}>
                    {isSubscribed ? (
                      <div className="flex items-center gap-1">
                        <FaBell size={14} />
                        <span>Subscribed</span>
                      </div>
                    ) : (
                      "Subscribe"
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="relative flex text-xs md:text-sm scrollbar-hide items-center gap-2">
                {showMoreActions && (
                  <div className="absolute right-0 top-12 bg-gray-50 shadow-lg rounded-lg border  border-gray-200 py-2 w-48 z-10">
                    <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 w-full text-left ">
                      <MdPlaylistAdd size={20} />
                      <span>Save to playlist</span>
                    </button>
                    <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 w-full text-left ">
                      <RiScissorsLine size={20} />
                      <span>Clip</span>
                    </button>
                    <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 w-full text-left ">
                      <FaFlag size={16} />
                      <span>Report</span>
                    </button>
                  </div>
                )}
                <div className="flex flex-1 items-center gap-2 overflow-x-auto">
                  {/* Like/Dislike Combined Button */}
                  <div className="flex items-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-2 px-4 py-2 rounded-l-full transition-colors ${
                        videoLikeStatus.userLiked
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-700 hover:bg-gray-200"
                      }`}>
                      {videoLikeStatus.userLiked ? (
                        <FaThumbsUp size={20} />
                      ) : (
                        <FaRegThumbsUp size={20} />
                      )}
                      <span className="text-xs md:text-sm whitespace-nowrap font-medium">
                        {formatNumber(videoLikeStatus.likes)}
                      </span>
                    </button>
                    {/* <div className="w-px h-6 bg-red-300"></div> */}
                    <button
                      onClick={handleDislike}
                      className={`px-3 py-2 rounded-r-full transition-colors ${
                        videoLikeStatus.userDisliked
                          ? "text-red-600 bg-red-50"
                          : "text-gray-700 hover:bg-gray-200"
                      }`}>
                      {videoLikeStatus.userDisliked ? (
                        <FaThumbsDown size={20} />
                      ) : (
                        <FaRegThumbsDown size={20} />
                      )}
                    </button>
                  </div>

                  {/* Share Button */}
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                    <BiShare size={20} />
                    <span className="font-medium">Share</span>
                  </button>

                  {/* Download Button */}
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                    <RiDownloadLine size={20} />
                    <span className="font-medium">Download</span>
                  </button>

                  {/* More Actions Button */}
                  <div className="relative">
                    <button
                      onClick={() => setShowMoreActions(!showMoreActions)}
                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                      <FaEllipsisH size={16} />
                    </button>

                    {/* More Actions Dropdown */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Channel Info */}
          <div className="flex bg-gray-100 items-start justify-between p-4 m-4 rounded-lg border-b border-gray-200">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">
                    {formatNumber(videoData?.views)} views
                  </span>
                  <span>•</span>
                  <span>{getTimeAgo(videoData?.uploadDate)}</span>
                </div>
                {/* Description Preview */}
                <div className="mt-3">
                  <p className="text-sm text-gray-800 leading-relaxed">
                    {showDescription
                      ? videoData.description
                      : `${videoData.description?.substring(0, 100)}...`}
                  </p>
                  <button
                    onClick={() => setShowDescription(!showDescription)}
                    className="text-sm font-medium text-gray-900 mt-1 hover:text-gray-700">
                    {showDescription ? "Show less" : "Show more"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mx-4">
            <div className="flex justify-between items-center gap-8 mb-6">
              <h3 className="text-xl font-medium">
                {comments.length} Comments
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <MdOutlineSort size={20} />
                <span>Sort by</span>
              </div>
            </div>

            {/* Add Comment */}
            <div className="mb-8">
              <div className="flex gap-3">
                {authUser?.avatar && !authAvatarError ? (
                  <img
                    src={authUser?.avatar}
                    alt="Your avatar"
                    className="w-10 h-10 object-cover rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-black">
                    {getInitial(authUser?.username)}
                  </div>
                )}
                <div className="flex-1">
                  <form onSubmit={handleCommentSubmit}>
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full pb-1 border-b border-gray-300 focus:border-b-2 focus:border-gray-900 outline-none text-sm bg-transparent"
                    />
                    {newComment && (
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => setNewComment("")}
                          className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={!newComment.trim()}
                          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
                          Comment
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {Array.isArray(comments) &&
                comments?.map((comment) => (
                  <CommentCard
                    comment={comment}
                    key={comment.id}
                    editCommentText={editCommentText}
                    setEditCommentText={setEditCommentText}
                    editingComment={editingComment}
                    handleEditComment={handleEditComment}
                    handleCancelEdit={handleCancelEdit}
                    handleSaveEdit={handleSaveEdit}
                    handleDeleteComment={handleDeleteComment}
                    handleCommentLike={handleCommentLike}
                    isLoggedIn={isLoggedIn}
                    authUser={authUser}
                  />
                ))}
            </div>
          </div>
        </div>
        {/* Suggested Videos Sidebar */}
        <div className="w-full xl:w-96 xl:min-w-96 px-4">
          <div className="sticky top-4">
            <div className="mb-4">
              <h3 className="text-base font-medium mb-3">Up next</h3>
              <div className="space-y-2">
                {suggestedVideos.map((video) => (
                  <div
                    key={video.id}
                    className="flex gap-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors group">
                    <Link to={`/watch/${video.id}`}>
                      <div className="relative flex-shrink-0">
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-40 h-24 object-cover rounded-lg"
                        />

                        <span className="absolute bottom-1 right-1 bg-black/90 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                          {video?.duration}
                        </span>
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/watch/${video.id}`}>
                        <h4 className="font-medium text-sm leading-tight mb-1 line-clamp-2 group-hover:text-gray-900 transition-colors">
                          {video?.title}
                        </h4>
                      </Link>
                      <Link to={`/channel/${video?.channel?.id}`}>
                        <p className="text-gray-600 text-xs mb-1 hover:text-gray-900 cursor-pointer transition-colors">
                          {video?.channel?.name}
                        </p>
                      </Link>
                      <div className="text-gray-500 text-xs">
                        <span>{formatNumber(video.views)} Views</span>
                        <span className="mx-1">•</span>
                        <span>{getTimeAgo(video.uploadDate)}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                        <MdMoreVert size={16} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Show More Button */}
            <button className="w-full py-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
              Show more
            </button>
          </div>
        </div>
        {showDeleteCommentModal && (
          <ConfirmModal
            message="Are you sure you want to delete?"
            onConfirm={onConfirmDeleteComment}
            onCancel={handleClose}
          />
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;

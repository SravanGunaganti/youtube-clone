import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";

import { channelAPI, videoAPI, handleAPIError } from "../services/api.js";
import TabsContent from "./channel/TabsContent.jsx";
import SignInPrompt from "./channel/SignInPrompt.jsx";
import NoChannelPrompt from "./channel/NoChannelPrompt.jsx";
import UploadVideoModal from "./channel/UploadVideoModal.jsx";
import CreateChannelModal from "./channel/CreateChannelModal.jsx";
import UpdateChannelModal from "./channel/UpdateChannelModal.jsx";
import UpdateVideoModal from "./channel/UpdateVideoModal.jsx";
import ChannelInfo from "./channel/ChannelInfo.jsx";

const ChannelPage = () => {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const { authUser, isLoggedIn } = useAuth();

  const [channelData, setChannelData] = useState({});
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("videos");
  const [isOwner, setIsOwner] = useState(false);
  const [channelExists, setChannelExists] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showEditChannelModal, setShowEditChannelModal] = useState(false);

  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    category: "",
  });

  const [editingVideo, setEditingVideo] = useState(null);
  const [editChannelData, setEditChannelData] = useState({
    channelName: "",
    description: "",
    avatar: "",
    channelBanner: "",
  });

  const startEditChannel = () => {
    setEditChannelData({
      channelName: channelData.channelName,
      description: channelData.description,
      avatar: channelData.avatar || "",
      channelBanner: channelData.channelBanner || "",
    });
    setShowEditChannelModal(true);
  };

  const handleUpdateChannel = async (e) => {
    e.preventDefault();
    try {
      const response = await channelAPI.updateChannel(
        channelData.id,
        editChannelData
      );
      if (!response.success) {
        toast.error("Failed to update channel");
        return;
      }
      setChannelData((prev) => ({ ...prev, ...editChannelData }));
      setShowEditChannelModal(false);
      toast.success("Channel updated successfully");
    } catch (error) {
      toast.error(handleAPIError(error).message);
    }
  };

  const handleSubscribe = () => {
    setChannelData((prev) => ({
      ...prev,
      isSubscribed: !prev.isSubscribed,
    }));
  };

  const handleUploadVideo = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return navigate("/signin");
    if (!isOwner)
      return toast.error("You can only upload videosto your own channel.");

    if (
      newVideo.title &&
      newVideo.description &&
      newVideo.videoUrl &&
      newVideo.category
    ) {
      try {
        const response = await videoAPI.createVideo({
          ...newVideo,
          thumbnailUrl:
            newVideo.thumbnailUrl || "https://via.placeholder.com/320x180",
        });
        if (response.success) {
          const { _id, ...data } = response.data;
          setVideos((prev) => [...prev, { id: _id, ...data }]);
          setNewVideo({
            title: "",
            description: "",
            videoUrl: "",
            thumbnailUrl: "",
            category: "",
          });
          setShowUploadModal(false);
          toast.success("Video uploaded successfully!");
        }
      } catch (error) {
        toast.error(handleAPIError(error).message);
      }
    } else {
      toast.error("Please fill in all required fields.");
    }
  };

  const handleUpdateVideo = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return navigate("/signin");
    const videoToEdit = videos.find((v) => v.id === editingVideo.id);
    if (!videoToEdit || videoToEdit.uploader !== authUser.id)
      return toast.error("Unauthorized");

    try {
      const response = await videoAPI.updateVideo(
        editingVideo._id,
        editingVideo
      );
      if (response.success) {
        setVideos((prev) =>
          prev.map((v) =>
            v._id === editingVideo._id ? { ...v, ...editingVideo } : v
          )
        );
        setEditingVideo(null);
        setShowEditModal(false);
        toast.success("Video updated successfully!");
      }
    } catch (error) {
      toast.error(handleAPIError(error).message);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    const video = videos.find((v) => v._id === videoId);
    if (!isLoggedIn || (!isOwner && video?.uploader !== authUser.id))
      return toast.error("Unauthorized");

    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        const response = await videoAPI.deleteVideo(videoId);
        if (response.success) {
          setVideos(videos.filter((v) => v._id !== videoId));
          toast.success("Video deleted successfully!");
        }
      } catch (error) {
        toast.error(handleAPIError(error).message);
      }
    }
  };

  const startEditVideo = (video) => {
    if (!isLoggedIn || (!isOwner && video?.uploader !== authUser.id))
      return toast.error("Unauthorized");
    setEditingVideo(video);
    setShowEditModal(true);
  };

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return navigate("/signin");

    const formData = new FormData(e.target);
    const name =
      formData.get("channelName") || authUser?.username || "My Channel";
    const description =
      formData.get("channelDescription") || `Welcome to ${name}!`;

    try {
      const response = await channelAPI.createChannel({
        channelName: name,
        description,
      });
      if (response.success) {
        setChannelData(response.data);
        setChannelExists(true);
        setShowCreateChannelModal(false);
        navigate(`/channel/${response.data.id}`, { replace: true });
        toast.success("Channel created successfully!");
      }
    } catch (error) {
      toast.error(handleAPIError(error).message);
    }
  };

  const loadChannelData = async () => {
    try {
      if (
        isLoggedIn &&
        authUser &&
        (channelId === String(authUser.id) || channelId === authUser.id)
      ) {
        try {
          const response = await channelAPI.getMyChannel();
          if (response.success) {
            setChannelData(response.data);
            setVideos(response.data.videos);
            setChannelExists(true);
          }
        } catch {
          setChannelExists(false);
        }
      } else {
        const response = await channelAPI.getChannel(channelId);
        if (response.success) {
          setChannelData(response.data);
          setVideos(response.data.videos);
          setChannelExists(true);
          setIsOwner(response.data.owner.id === authUser?.id);
        }
      }
    } catch (error) {
      setChannelExists(false);
    }
  };

  useEffect(() => {
    if (channelId) {
      loadChannelData();
      setIsOwner(
        isLoggedIn &&
          authUser &&
          (authUser.id === channelId || authUser.channelId === channelId)
      );
    }
  }, [channelId, isLoggedIn, authUser]);

  if (!isLoggedIn && !channelId) return <SignInPrompt />;

  if (
    isLoggedIn &&
    channelId === authUser?.id &&
    !channelExists &&
    !showCreateChannelModal
  )
    return (
      <NoChannelPrompt
        username={authUser.username}
        onCreate={() => setShowCreateChannelModal(true)}
      />
    );

  if (
    isLoggedIn &&
    channelId === authUser?.id &&
    !channelExists &&
    showCreateChannelModal
  )
    return (
      <CreateChannelModal
        authUser={authUser}
        onClose={() => setShowCreateChannelModal(false)}
        onSubmit={handleCreateChannel}
      />
    );

  return (
    <div className="w-full bg-white ">
      {/* Banner Inline */}
      <div className="w-full rounded-xl h-32 sm:h-48 lg:h-60 p-4">
        <img
          src={
            channelData?.channelBanner ||
            "https://cdn.pixabay.com/photo/2022/05/26/23/18/fractal-7223968_1280.jpg"
          }
          alt="Channel banner"
          className="w-full rounded-xl h-full object-cover"
        />
      </div>

      <ChannelInfo
        channelData={channelData}
        videos={videos}
        isOwner={isOwner}
        isLoggedIn={isLoggedIn}
        handleSubscribe={handleSubscribe}
        startEditChannel={startEditChannel}
        setShowUploadModal={setShowUploadModal}
      />

      <TabsContent
        videos={videos}
        isOwner={isOwner}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        startEditVideo={startEditVideo}
        handleDeleteVideo={handleDeleteVideo}
        channelData={channelData}
      />

      {showUploadModal && (
        <UploadVideoModal
          newVideo={newVideo}
          setNewVideo={setNewVideo}
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUploadVideo}
        />
      )}

      {showEditModal && editingVideo && (
        <UpdateVideoModal
          editingVideo={editingVideo}
          setEditingVideo={setEditingVideo}
          onClose={() => {
            setShowEditModal(false);
            setEditingVideo(null);
          }}
          onUpdate={handleUpdateVideo}
        />
      )}

      {showEditChannelModal && (
        <UpdateChannelModal
          editChannelData={editChannelData}
          setChannelData={setChannelData}
          setEditChannelData={setEditChannelData}
          onClose={() => setShowEditChannelModal(false)}
          onSubmit={handleUpdateChannel}
        />
      )}
    </div>
  );
};

export default ChannelPage;

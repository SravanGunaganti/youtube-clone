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
import ConfirmModal from "./ConfirmModal.jsx";

const ChannelPage = () => {
  const { channelId } = useParams();

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
  const [editingVideo, setEditingVideo] = useState(null);

  const [showDeleteVideoModal, setShowDeleteVideoModal] = useState(false);
  const [videoDeleteId, setVideoDeleteId] = useState(null);
  const [bannerError, setBannerError] = useState(true);
  const navigate = useNavigate();

  const startEditChannel = () => {
    setShowEditChannelModal(true);
  };
  const handleUpdateChannel = async (editChannelData) => {
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
      console.error("Error updating channel:", handleAPIError(error));
    }
  };

  useEffect(()=>{
    if (channelData?.channelBanner) {
      const image = new Image();
      image.onload = () => {
        setBannerError(false);
      };
      image.onerror = () => {
        setBannerError(true);
      };
      image.src = channelData?.channelBanner;
    }else{
      setBannerError(true);
    }

  },[channelData?.bannerUrl])

  const handleSubscribe = () => {
    setChannelData((prev) => ({
      ...prev,
      isSubscribed: !prev.isSubscribed,
    }));
  };

  const handleUploadVideo = async (newVideo) => {
    if (!isLoggedIn) return navigate("/signin");
    if (!isOwner)
      return toast.error("You can only upload videos to your own channel.");

    if (
      newVideo.title &&
      newVideo.description &&
      newVideo.videoUrl &&
      newVideo.category
    ) {
      try {
        const response = await videoAPI.createVideo({
          ...newVideo,
          thumbnailUrl: newVideo.thumbnailUrl,
        });
        if (response.success) {
          const data = response.data;
          const { id, ...rest } = data;
          setVideos((prev) => [{ _id: id, ...rest }, ...prev]);
          setShowUploadModal(false);
          toast.success("Video uploaded successfully!");
        }
      } catch (error) {
        toast.error("Failed to upload video");
        console.error("Error uploading video:", handleAPIError(error));
      }
    } else {
      toast.error("Please fill in all required fields.");
    }
  };

  const handleUpdateVideo = async (editedVideo) => {
    if (!isLoggedIn) return navigate("/signin");
    const videoToEdit = videos.find((v) => v.id === editingVideo.id);
    if (!videoToEdit || videoToEdit.uploader !== authUser.id)
      return toast.error("Unauthorized");

    try {
      const response = await videoAPI.updateVideo(
        editingVideo._id,
        editedVideo
      );
      if (response.success) {
        setVideos((prev) =>
          prev.map((v) =>
            v._id === editingVideo._id ? { ...v, ...editedVideo } : v
          )
        );
        setEditingVideo(null);
        setShowEditModal(false);
        toast.success("Video updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update video");
      console.error("Error updating video:", handleAPIError(error));
    }
  };

  const handleDeleteVideo = async (videoId) => {
    const video = videos.find((v) => v._id === videoId);
    if (!isLoggedIn || (!isOwner && video?.uploader !== authUser.id))
      return toast.error("Unauthorized");

    setShowDeleteVideoModal(true);
    setVideoDeleteId(videoId);
  };

  const onConfirmnDeleteVideo = async () => {
    try {
        const response = await videoAPI.deleteVideo(videoDeleteId);
        if (response.success) {
          setVideos(videos.filter((v) => v._id !== videoDeleteId));
          toast.success("Video deleted successfully!");
        }
      } catch (error) {
        toast.error("Failed to delete video");
        console.error("Error deleting video:", handleAPIError(error));
      }

    setShowDeleteVideoModal(false);
    setVideoDeleteId(null);
  };

  const startEditVideo = (video) => {
    if (!isLoggedIn || (!isOwner && video?.uploader !== authUser.id))
      return toast.error("Unauthorized");
    setEditingVideo(video);
    setShowEditModal(true);
  };

  const handleCreateChannel = async (formData) => {
    if (!isLoggedIn) return navigate("/signin");

    const name = formData.name || authUser?.username || "My Channel";
    const description = formData.description || `Welcome to ${name}!`;
    const avatar = formData.avatar || authUser?.avatar || "https://via.placeholder.com/150";

    try {
      const response = await channelAPI.createChannel({
        channelName: name,
        description,
        avatar,
      });
      if (response.success) {
        setChannelData(response.data);
        setChannelExists(true);
        setShowCreateChannelModal(false);
        navigate(`/channel/${response.data.id}`, { replace: true });
        toast.success("Channel created successfully!");
      }
    } catch (error) {
      toast.error("Failed to create channel");
      console.error("Error creating channel:", handleAPIError(error));
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
          } else {
            setChannelExists(false);
          }
          return;
        } catch {
          setChannelExists(false);
          return;
        }
      } else {
        const response = await channelAPI.getChannel(channelId);
        if (response.success) {
          setChannelData(response.data);
          setVideos(response.data.videos);
          setChannelExists(true);
          setIsOwner(response.data.owner.id === authUser?.id);
        } else {
          setChannelExists(false);
        }
        return;
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
    <div className="w-full max-w-[1360px] bg-white mx-auto ">
      {/* Banner */}
      {channelData?.channelBanner&& <div className={`${bannerError && 'hidden'}  w-full flex items-center justify-center rounded-lg h-32 sm:h-48 lg:h-60  p-4`}>
          <img
            src={channelData?.channelBanner}
            onError={()=>setBannerError(true)}
            onLoad={()=>setBannerError(false)}
            alt="Channel banner"
            className="w-full rounded-xl h-full object-cover"
          />  
      </div>}
       {(isLoggedIn && isOwner &&  bannerError) && <div className={`w-full  flex items-center justify-center rounded-xl h-32 sm:h-48 lg:h-60 p-4`}><div onClick={startEditChannel} className={`w-full border cursor-pointer border-gray-300 bg-gray-100 rounded-xl h-full text-lg md:text-3xl  font-semibold md:font-bold flex items-center justify-center`}>
          Add a banner to your channel
        </div>
        </div>}

      <ChannelInfo
        channelData={channelData}
        videos={videos}
        isOwner={isOwner}
        isLoggedIn={isLoggedIn}
        setActiveTab={setActiveTab}
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
          onClose={() => setShowUploadModal(false)}
          onUpload={handleUploadVideo}
        />
      )}

      {showEditModal && editingVideo && (
        <UpdateVideoModal
          video={editingVideo}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateVideo}
        />
      )}

      {showEditChannelModal && (
        <UpdateChannelModal
          channelData={channelData}
          onClose={() => setShowEditChannelModal(false)}
          onSubmit={handleUpdateChannel}
        />
      )}

       {showDeleteVideoModal && (
        <ConfirmModal
          message="Are you sure you want to delete?"
          onConfirm={onConfirmnDeleteVideo}
          onCancel={() => {setShowDeleteVideoModal(false);setVideoDeleteId(null)}}
        />
      )}
    </div>
  );
};

export default ChannelPage;

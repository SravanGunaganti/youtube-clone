import { use, useEffect, useState } from "react";
import { getInitial } from "../../utils/utilityFunctions";
import { AiOutlineCamera } from "react-icons/ai";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";

// Update ChannelModal component
const UpdateChannelModal = ({ channelData, onClose, onSubmit }) => {
  const [editChannelData, setEditChannelData] = useState({
    channelName: channelData.channelName || "",
    description: channelData.description || "",
    avatar: channelData.avatar || "",
    channelBanner: channelData.channelBanner || "",
  });

  const [avatarError, setAvatarError] = useState(false);
  const [bannerError, setBannerError] = useState(false);

  const reset = () => {
    setEditChannelData({
      channelName: channelData.channelName || "",
      description: channelData.description || "",
      avatar: channelData.avatar || "",
      channelBanner: channelData.channelBanner || "",
    });
    setAvatarError(true);
  };
  const handleClose = () => {
    onClose();
    reset();
  };

  const handleInputChange = (e) => {
    setEditChannelData({ ...editChannelData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setAvatarError(false);
    };
    img.onerror = () => {
      setAvatarError(true);
    };
    img.src = editChannelData.avatar;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [editChannelData.avatar]);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setBannerError(false);
    };
    img.onerror = () => {
      setBannerError(true);
    };
    img.src = editChannelData.channelBanner;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [editChannelData.channelBanner]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editChannelData.channelName.trim().length < 2) {
      return toast.error("Channel name must be at least 2 characters long");
    }
    if (editChannelData.description.trim().length < 10) {
      return toast.error("Description must be at least 10 characters long");
    }

    if (editChannelData.avatar && avatarError) {
      return toast.error("Please provide a valid channel avatar url");
    }
    if (editChannelData.channelBanner && bannerError) {
      return toast.error("Please provide a valid channel banner url");
    }

    onSubmit(editChannelData, reset);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // const isDisabled = !editChannelData.channelName || editChannelData.channelName.trim().length< 2 || !editChannelData.description || editChannelData.description.trim().length<10 || (editChannelData.avatar && avatarError) || (editChannelData.channelBanner && bannerError);
  const isDisabled =
    channelData.channelName === editChannelData.channelName &&
    channelData.description === editChannelData.description &&
    editChannelData.avatar === channelData.avatar &&
    editChannelData.channelBanner === channelData.channelBanner;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="w-full max-w-md mx-auto my-8">
        <div className="bg-white rounded-xl shadow-2xl">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">
                Update Channel
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <MdClose size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Channel Edit Form */}
            <form onSubmit={handleSubmit}>
              {/* Channel Name */}

              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4 flex justify-center items-center">
                  {editChannelData?.avatar && (
                    <img
                      src={editChannelData?.avatar}
                      alt="Profile preview"
                      className={`${
                        avatarError ? "hidden" : ""
                      } w-24 h-24 rounded-full object-cover border-4 border-gray-200`}
                      onError={() => setAvatarError(true)}
                      onLoad={() => setAvatarError(false)}
                    />
                  )}{" "}
                  <div
                    className={`${
                      !editChannelData.avatar || avatarError ? "" : "hidden"
                    } w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center font-bold text-white text-2xl border-4 border-gray-200`}>
                    {getInitial(editChannelData.channelName)}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg">
                    <AiOutlineCamera size={16} />
                  </div>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Channel Profile picture will be displayed across YouTube
                </p>
              </div>

              {/* Avatar URL Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avatar URL
                </label>
                <input
                  type="url"
                  name="avatar"
                  value={editChannelData.avatar}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="https://example.com/avatar.jpg"
                />
                {editChannelData.avatar && avatarError && (
                  <span className="text-red-500 text-xs">
                    Please provide a valid avatar URL or Leave blank
                  </span>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Channel Name
                </label>
                <input
                  type="text"
                  name="channelName"
                  value={editChannelData.channelName}
                  minLength={2}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter channel name..."
                  required
                />
                {editChannelData.channelName.trim().length < 2 && (
                  <span className="text-red-500 text-xs">
                    Channel name must be at least 2 characters long
                  </span>
                )}
              </div>
              {/* Channel Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editChannelData.description}
                  name="description"
                  onChange={handleInputChange}
                  minLength={10}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 h-24 resize-none"
                  placeholder="Enter channel description..."
                  required
                />
                {editChannelData.description.trim().length < 10 && (
                  <span className="text-red-500 text-xs">
                    Channel description must be at least 10 characters long
                  </span>
                )}
              </div>

              {/* Banner URL */}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner URL
                </label>
                <div className="w-full text-xl mb-2 flex justify-center items-center font-bold border border-gray-300 rounded-xl h-25">
                  {editChannelData?.channelBanner && (
                    <img
                      src={editChannelData?.channelBanner}
                      onError={() => setBannerError(true)}
                      key="ChannelBanner"
                      onLoad={() => setBannerError(false)}
                      alt="Channel banner"
                      className={`${
                        bannerError ? "hidden" : ""
                      } w-full rounded-xl h-full object-cover`}
                    />
                  )}
                  <p
                    className={`${
                      !editChannelData?.channelBanner || bannerError
                        ? ""
                        : "hidden"
                    } text-sm text-gray-600 text-center`}>
                    Add a banner image for your channel
                  </p>
                </div>
                <input
                  type="url"
                  name="channelBanner"
                  value={editChannelData.channelBanner}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="https://example.com/banner.jpg"
                />
                {editChannelData.channelBanner && bannerError && (
                  <span className="text-red-500 text-xs">
                    Please provide a valid banner URL or Leave blank
                  </span>
                )}
              </div>
              {/* Buttons  for cancel and update */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className=" px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDisabled}
                  className={`disabled:opacity-50 disabled:cursor-not-allowed flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors`}>
                  Save Chanages
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateChannelModal;

import React, { useState } from "react";
import { getInitial } from "../../utils/utilityFunctions";
import { AiOutlineCamera } from "react-icons/ai";
import { MdWifiChannel } from "react-icons/md";

const CreateChannelModal = ({ authUser, onClose, onSubmit }) => {
  const [channelData, setChannelData] = useState({
    name: authUser?.username || "My Channel",
    description: `Welcome to ${authUser?.username || "My"}'s channel!`,
    avatar: authUser?.avatar || "",
  });
  const [avatarError, setAvatarError] = useState(
    authUser?.avatar ? false : true
  );

  const handleInputChange = (e) => {
    setChannelData({ ...channelData, [e.target.name]: e.target.value });
    if (e.target.name === "avatar") {
      setAvatarError(false);
    }
  };

  const reset = () => {
    setChannelData({
      name: authUser?.username,
      description: `Welcome to ${authUser?.username}'s channel!`,
      avatar: authUser?.avatar || "",
    });
    setAvatarError(authUser?.avatar ? false : true);
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  const handleSubmit = (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (avatarError) {
      return toast.error("Please provide a valid profile picture url");
    }
    onSubmit(channelData);
    reset();
  };

  const handleAvatarError = () => {
    setAvatarError(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="relative overflow-hidden w-full max-h-full overflow-y-auto rounded-2xl p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-auto ">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Create a channel
            </h2>
          </div>

          {/* Modal Content */}
          <div className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Channel Name */}

              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  {!avatarError ? (
                    <img
                      src={channelData.avatar}
                      alt="Profile preview"
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                      onError={handleAvatarError}
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center font-bold text-white text-2xl border-4 border-gray-200">
                      {getInitial(channelData.name)}
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg">
                    <AiOutlineCamera size={16} />
                  </div>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Profile picture will be displayed across YouTube
                </p>
              </div>

              {/* Avatar URL Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MdWifiChannel className="inline mr-1" size={16} />
                  Avatar URL
                </label>
                <input
                  type="url"
                  name="avatar"
                  value={channelData.avatar}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="https://example.com/avatar.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a URL for your profile picture
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Channel name
                </label>
                <div className="flex items-center space-x-2 p-2 border border-gray-300 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {getInitial(channelData.name)}
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={channelData.name}
                    onChange={handleInputChange}
                    className="flex-1 text-sm font-medium text-gray-900 bg-transparent border-none outline-none"
                    placeholder="Enter channel name"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  name="description"
                  rows={2}
                  onChange={handleInputChange}
                  value={channelData.description}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Describe your channel..."
                />
              </div>

              {/* Terms and Privacy */}
              <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600 leading-relaxed">
                By creating a channel, you agree to YouTube's{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
                .
              </div>

              {/* Buttons - Create and Cancel */}
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CreateChannelModal);

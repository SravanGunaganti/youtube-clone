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

  const [isLoaded, setIsLoaded] = useState(false);

  const [avatarError, setAvatarError] = useState(
    channelData?.avatar ? false : true
  );
  const [bannerError, setBannerError] = useState(
    channelData?.channelBanner ? false : true
    );

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
    if (e.target.name === "avatar") {
      setAvatarError(true);
    }
    if (e.target.name === "channelBanner") {
      setBannerError(true);
    }

  };

  useEffect(() => {
    const img = new Image();
     img.onload = () => {
       setIsLoaded(true);
     };
     img.onerror = () => {
       setIsLoaded(false);
     };
     img.src = editChannelData.avatar;
     img.src = editChannelData.channelBanner;
    
  }, [editChannelData.avatar, editChannelData.channelBanner]);

  const handleSubmit = (e) => {
    e.preventDefault();

     if (avatarError || !isLoaded) {
      return toast.error("Please provide a valid channel avatar url");
    }
     if (bannerError || !isLoaded) {
      return toast.error("Please provide a valid channel banner url");
    }
    console.log(editChannelData,avatarError,bannerError);
    onSubmit(editChannelData);
    reset();
  };


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="relative overflow-hidden w-full min-h-full max-h-full overflow-y-auto rounded-2xl p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto ">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4 border-gray-100">
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
                      className={`${avatarError ? "hidden" : ""} w-24 h-24 rounded-full object-cover border-4 border-gray-200`}
                      onError={() => setAvatarError(true)}
                      onLoad={() => setAvatarError(false)}
                    />
                  )} <div className={`${avatarError ? "" : "hidden"} w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center font-bold text-white text-2xl border-4 border-gray-200`}>
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
                {/* <p className="text-xs text-gray-500 mt-1">
                              Enter a URL for your channel picture
                            </p> */}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Channel Name
                </label>
                <input
                  type="text"
                  name="channelName"
                  value={editChannelData.channelName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter channel name..."
                  required
                />
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
                    onError={() =>
                      setBannerError(true)}
                    key="ChannelBanner"
                    onLoad={() => setBannerError(false)}
                    alt="Channel banner"
                    className={`${bannerError ? "hidden" : ""} w-full rounded-xl h-full object-cover`}
                  />
                )}
                <p className={`${bannerError ? "" : "hidden"} text-sm text-gray-600 text-center`}>
                  Add a banner image for your channel
                  </p>
              </div>
                <input
                  type="url"
                  name="channelBanner"
                  value={editChannelData.channelBanner}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="https://example.com/banner.jpg"
                />
              </div>
              {/* Buttons  for cancel and update */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bannerError || avatarError}
                  className={`${bannerError || avatarError? "opacity-50 cursor-not-allowed" : ""} flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors`}>
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

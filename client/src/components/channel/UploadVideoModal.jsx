import { useEffect, useState } from "react";
import { categories } from "../../constants/categories";
import { toast } from "react-toastify";

// UploadVideoModal component
const UploadVideoModal = ({ onClose, onUpload }) => {
  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    category: "",
  });

  const [thumbnailError, setThumbnailError] = useState(true);
  const [videoError, setVideoError] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVideo({ ...newVideo, [name]: value });

    // Update thumbnail preview
    if (name === "thumbnailUrl") {
      setThumbnailError(true);
    }
    if (name === "videoUrl") {
      setVideoError(true);
    }

    if (name === "thumbnailUrl") {
      const image = new Image(value);
      image.onload = () => {
        setIsLoaded(true);
      };
      image.onerror = () => {
        setIsLoaded(true);
      };
      image.src = value;
    }
  };

  const handleSubmit = (e) => {
    if (thumbnailError || !isLoaded) {
      return toast.error("Please provide a valid thumbnail url");
    }
    if (videoError || !isLoaded) {
      return toast.error("Please provide a valid video url");
    }
    e.preventDefault();
    onUpload(newVideo);
  };

  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      setIsLoaded(true);
    };
    image.onerror = () => {
      setIsLoaded(true);
    };
    image.src = newVideo.thumbnailUrl;
  }, [newVideo.thumbnailUrl]);
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="relative overflow-hidden w-full min-h-full max-h-full overflow-y-auto rounded-2xl p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto ">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Upload New Video</h2>
          {/* Video Upload Form */}
          <form onSubmit={handleSubmit}>
            {/* Video Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Title
              </label>
              <input
                type="text"
                value={newVideo.title}
                onChange={handleInputChange}
                name="title"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter video title..."
                required
              />
            </div>
            {/* Video Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={newVideo.description}
                onChange={handleInputChange}
                name="description"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 h-24 resize-none"
                placeholder="Enter video description..."
                required
              />
            </div>
            {/* Video Category */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={newVideo.category}
                name="category"
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                required>
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            {/* Video URL */}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video URL *
              </label>
              <div className="mb-2 w-full aspect-video rounded-lg flex justify-center items-center border border-gray-300">
                {newVideo.videoUrl && (
                  <video
                    src={newVideo.videoUrl}
                    controls
                    muted
                    onLoadedData={() => {
                      setIsLoaded(true);
                      setVideoError(false);
                    }}
                    onError={() => setVideoError(true)}
                    onCanPlay={() => setIsLoaded(true)}
                    className={` ${videoError ? "hidden" : ""} w-full aspect-video object-cover rounded-lg`}></video>
                )}
                {videoError && (
                  <p className="text-red-500 text-sm font-bold">
                    Please provide a valid video url
                  </p>
                )}
              </div>
              <input
                type="url"
                value={newVideo.videoUrl}
                name="videoUrl"
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="https://example.com/video.mp4"
                required
              />
            </div>
            {/* Thumbnail URL */}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail URL
              </label>
              <div className="w-full text-xl flex mb-2 justify-center items-center font-bold border border-gray-300 rounded-xl aspect-video">
                {newVideo?.thumbnailUrl && (
                  <img
                    src={newVideo?.thumbnailUrl}
                    onError={() => setThumbnailError(true)}
                    key="thumbnailUrl"
                    onLoad={() => setThumbnailError(false)}
                    alt="Thumbnail"
                    className={`${
                      thumbnailError ? "hidden" : ""
                    } w-full rounded-xl h-full object-cover`}
                  />
                )}
                <p
                  className={`${
                    thumbnailError ? "" : "hidden"
                  } text-sm text-red-500 text-center`}>
                  Please provide a valid thumbnail url
                </p>
              </div>
              <input
                type="url"
                value={newVideo.thumbnailUrl}
                onChange={handleInputChange}
                name="thumbnailUrl"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="https://example.com/thumbnail.jpg"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                disabled={thumbnailError || videoError || !isLoaded}
                className={`${thumbnailError || videoError || !isLoaded ? "opacity-50 cursor-not-allowed" : ""} flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors`}>
                Upload
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
};

export default UploadVideoModal;

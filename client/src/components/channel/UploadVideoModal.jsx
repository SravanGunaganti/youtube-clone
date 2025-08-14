import { useEffect, useRef, useState } from "react";
import { categories } from "../../constants/categories";
import { toast } from "react-toastify";
import { MdClose } from "react-icons/md";

// UploadVideoModal component
const UploadVideoModal = ({ onClose, onUpload }) => {
  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    category: "",
    otherCategory: "",
  });

  const [thumbnailError, setThumbnailError] = useState(true);
  const [videoError, setVideoError] = useState(true);

  const videoRef = useRef(null);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVideo({ ...newVideo, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (newVideo.title.trim().length < 5) {
      return toast.error("Video title must be at least 5 characters long");
    }

    if (newVideo.description.trim().length < 10) {
      return toast.error("Description must be at least 10 characters long");
    }

    if (!newVideo.thumbnailUrl.trim() || thumbnailError) {
      return toast.error("Please provide a valid thumbnail url");
    }

    if (!newVideo.videoUrl.trim() || videoError) {
      return toast.error("Please provide a valid video url");
    }

    if (newVideo.category === "") {
      return toast.error("Please select a category");
    }
    if (newVideo.category === "Other" && newVideo.otherCategory.trim() < 2) {
      return toast.error(
        "Please provide a valid category name for 'Other' category"
      );
    }

    const finalCategory =
      newVideo.category === "Other"
        ? newVideo.otherCategory
        : newVideo.category;
    const { otherCategory, ...rest } = newVideo;
    const newVideoData = { ...rest, category: finalCategory };
    onUpload(newVideoData);
    reset();
  };

  const reset = () => {
    setNewVideo({
      title: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
      category: "",
      otherCategory: "",
    });
    setThumbnailError(true);
    setVideoError(true);
  };

  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      setThumbnailError(false);
    };
    image.onerror = () => {
      setThumbnailError(true);
    };
    image.src = newVideo.thumbnailUrl;
  }, [newVideo.thumbnailUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.src = newVideo.videoUrl;
    video.onloadeddata = () => {
      setVideoError(false);
    };
    video.onerror = () => {
      setVideoError(true);
    };

    video.load();
  }, [newVideo.videoUrl]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="w-full max-w-md mx-auto my-8">
        <div className="bg-white rounded-xl shadow-2xl">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">
                Add New Video
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                // disabled={!isLoaded}
              >
                <MdClose size={20} className="text-gray-500" />
              </button>
            </div>
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
                  minLength={5}
                  maxLength={50}
                  onChange={handleInputChange}
                  name="title"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Enter video title..."
                  required
                />
                <span className="text-xs text-gray-500">
                  {newVideo.title.length} / 50 characters
                </span>

                {newVideo.title && newVideo.title.length < 5 && (
                  <span className="text-xs block text-red-500">
                    Title must be at least 5 characters long
                  </span>
                )}
                {newVideo.title && newVideo.title.length > 50 && (
                  <span className="text-xs block text-red-500">
                    Title must be less than 50 characters long
                  </span>
                )}
              </div>
              {/* Video Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newVideo.description}
                  onChange={handleInputChange}
                  minLength={10}
                  name="description"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 h-24 resize-none"
                  placeholder="Enter video description..."
                  required
                />
                {newVideo.description && newVideo.description.length < 10 && (
                  <span className="text-xs text-red-500">
                    Description must be at least 10 characters long
                  </span>
                )}
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
                {newVideo.category === "Other" && (
                  <input
                    type="text"
                    name="otherCategory"
                    value={newVideo.otherCategory}
                    placeholder="Enter other category"
                    onChange={handleInputChange}
                    reqired={newVideo.category === "Other"}
                    className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                )}
                {newVideo.otherCategory &&
                  newVideo.otherCategory.length < 2 && (
                    <p className="text-red-500 text-xs">
                      category must be at least 2 characters long
                    </p>
                  )}
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
                      ref={videoRef}
                      controls
                      muted
                      onLoadedData={() => {
                        setVideoError(false);
                      }}
                      onError={() => {
                        setVideoError(true);
                      }}
                      onCanPlay={() => {
                        setVideoError(false);
                      }}
                      className={` ${
                        videoError ? "hidden" : ""
                      } w-full aspect-video object-cover rounded-lg`}>
                      <source src={newVideo.videoUrl} type="video/mp4" />
                    </video>
                  )}
                  {videoError && (
                    <p className="text-gray-500 text-sm font-bold">
                      Add a video URL to preview
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
                {videoError && newVideo.videoUrl && (
                  <span className="text-red-500 text-xs">
                    Please enter a valid video URL
                  </span>
                )}
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
                    } text-sm text-gray-500 text-center`}>
                    Add a thumbnail URL to preview
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
                {newVideo.thumbnailUrl && thumbnailError && (
                  <span className="text-red-500 text-xs">
                    Please enter a valid thumbnail URL
                  </span>
                )}
              </div>

              <div className="flex gap-3 items-center">
                <button
                  type="button"
                  onClick={handleClose}
                  className=" px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  Add Video
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

import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";

const UpdateVideoModal = ({ video, onClose, onUpdate }) => {
  const [editingVideo, setEditingVideo] = useState({
    title: video.title || "",
    description: video.description || "",
    thumbnailUrl: video.thumbnailUrl || "",
  });
  const [thumbnailError, setThumbnailError] = useState(true);

  useEffect(() => {
    const image = new Image();
    image.src = editingVideo.thumbnailUrl;
    image.onload = () => {
      setThumbnailError(false);
    };
    image.onerror = () => {
      setThumbnailError(true);
    };
  }, [editingVideo.thumbnailUrl]);
  // If no video is being edited, return null
  if (!video) return null;

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingVideo({ ...editingVideo, [name]: value });
  };

  // Handle form reset
  const reset = () => {
    setEditingVideo({
      title: video.title || "",
      description: video.description || "",
      videoUrl: video.videoUrl || "",
      thumbnailUrl: video.thumbnailUrl || "",
      category: video.category || "",
    });
    setThumbnailError(true);
  };

  // Handle modal close
  const handleClose = () => {
    onClose();
    reset();
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingVideo.title.trim().length < 5) {
      return toast.error("Video title must be at least 5 characters long");
    }
    if (editingVideo.description.trim().length < 10) {
      return toast.error("Description must be at least 10 characters long");
    }

    if (!editingVideo.thumbnailUrl.trim() || thumbnailError) {
      return toast.error("Please provide a valid thumbnail url");
    }
    onUpdate(editingVideo);
    reset();
  };

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const isDisabled =
    video.title === editingVideo.title &&
    video.description === editingVideo.description &&
    video.thumbnailUrl === editingVideo.thumbnailUrl;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="w-full max-w-md mx-auto my-8">
        <div className="bg-white rounded-xl shadow-2xl">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">
                Update Video
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <MdClose size={20} className="text-gray-500" />
              </button>
            </div>
            {/* Video Edit Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                {/* Video Title */}
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={editingVideo.title}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
                {editingVideo.title.length < 5 && (
                  <span className="text-xs text-red-500 mt-2">
                    Title must be at least 5 characters
                  </span>
                )}
              </div>
              {/* Video Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={editingVideo.description}
                  name="description"
                  onChange={handleInputChange}
                  placeholder="Description"
                  minLength={10}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 h-24 resize-none"
                  required
                />
                {editingVideo.description.length < 10 && (
                  <span className="text-xs text-red-500 mt-2">
                    Description must be at least 10 characters
                  </span>
                )}
              </div>
              {/* Thumbnail URL */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thumbnail URL
                </label>
                <div className="w-full text-xl flex mb-2 justify-center items-center font-bold border border-gray-300 rounded-xl aspect-video">
                  {editingVideo?.thumbnailUrl && (
                    <img
                      src={editingVideo?.thumbnailUrl}
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
                    Add a Thumbnail URL to preview
                  </p>
                </div>
                <input
                  type="url"
                  value={editingVideo.thumbnailUrl}
                  onChange={handleInputChange}
                  required
                  name="thumbnailUrl"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="https://example.com/thumbnail.jpg"
                />

                {thumbnailError && editingVideo.thumbnailUrl && (
                  <span className="text-xs text-red-500 mt-2">
                    Please provide a valid thumbnail URL
                  </span>
                )}
              </div>
              {/* Save and Cancel Buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isDisabled}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  {" "}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateVideoModal;

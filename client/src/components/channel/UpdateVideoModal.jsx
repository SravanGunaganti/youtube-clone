import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";

const UpdateVideoModal = ({ video, onClose, onUpdate }) => {
  const [editingVideo, setEditingVideo] = useState({
    title: video.title || "",
    description: video.description || "",
    videoUrl: video.videoUrl || "",
    thumbnailUrl: video.thumbnailUrl || "",
    category: video.category || "",
  });
  const [thumbnailError, setThumbnailError] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      setIsLoaded(true);
    };
    image.onerror = () => {
      setIsLoaded(true);
    };
    image.src = editingVideo.thumbnailUrl;
  }, [editingVideo.thumbnailUrl]);
  // If no video is being edited, return null
  if (!video) return null;

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingVideo({ ...editingVideo, [name]: value });

    // Update thumbnail preview error handling
    if (name === "thumbnailUrl") {
      setThumbnailError(true);
      const image = new Image();
      image.onload = () => {
        setIsLoaded(true);
      };
      image.onerror = () => {
        setIsLoaded(true);
      };
      image.src = value;
    }
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
    if (thumbnailError || !isLoaded) {
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 h-24 resize-none"
                  required
                />
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
                    } text-sm text-red-500 text-center`}>
                    Please provide a valid thumbnail url
                  </p>
                </div>
                <input
                  type="url"
                  value={editingVideo.thumbnailUrl}
                  onChange={handleInputChange}
                  name="thumbnailUrl"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="https://example.com/thumbnail.jpg"
                />
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
                  disabled={
                    thumbnailError ||
                    !isLoaded ||
                    !editingVideo.title ||
                    !editingVideo.description ||
                    !editingVideo.thumbnailUrl
                  }
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

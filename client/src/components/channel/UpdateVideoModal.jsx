import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const UpdateVideoModal = ({
  // editingVideo,
  // setEditingVideo,
  video,
  onClose,
  onUpdate,
}) => {
  const [editingVideo, setEditingVideo] = useState({
    title: video.title ||"",
    description: video.description ||"",
    videoUrl: video.videoUrl ||"",
    thumbnailUrl: video.thumbnailUrl ||"",
    category: video.category ||"",
  });
  const [thumbnailError, setThumbnailError] = useState(true);
  // const [videoError, setVideoError] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
      const image = new Image();
      image.onload = () => {
        setIsLoaded(true);
      };
      image.onerror = () => {
        setIsLoaded(true);
      };
      image.src = video.thumbnailUrl;
    }, [video.thumbnailUrl]);
  // If no video is being edited, return null
  if (!video) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingVideo({ ...editingVideo, [name]: value });

    // Update thumbnail preview
    if (name === "thumbnailUrl") {
      setThumbnailError(true);
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

  const reset = () => {
    setEditingVideo({
      title: video.title ||"",
      description: video.description ||"",
      videoUrl: video.videoUrl ||"",
      thumbnailUrl: video.thumbnailUrl ||"",
      category: video.category ||"",
    });
    setThumbnailError(true);
    // setVideoError(true);
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (thumbnailError || !isLoaded) {
      return toast.error("Please provide a valid thumbnail url");
    }
    // if (videoError) {
    //   return toast.error("Please provide a valid video url");
    // }
    onUpdate(editingVideo);
    reset();
  };


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="relative overflow-hidden w-full max-h-full overflow-y-auto rounded-2xl p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm mx-auto ">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Update Video</h2>
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
                  onChange={handleInputChange
                  }
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
                  onChange={handleInputChange
                  }
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
                  name = "thumbnailUrl"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="https://example.com/thumbnail.jpg"
                />
              </div>
              {/* Save and Cancel Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${!isLoaded || thumbnailError ? "opacity-50 cursor-not-allowed" : ""} flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors`}>
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

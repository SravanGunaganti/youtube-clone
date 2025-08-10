import { categories } from "../../constants/categories";

// UploadVideoModal component
const UploadVideoModal = ({ newVideo, setNewVideo, onClose, onUpload }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-full overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Upload New Video</h2>
          {/* Video Upload Form */}
          <form onSubmit={onUpload}>
            {/* Video Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Title
              </label>
              <input
                type="text"
                value={newVideo.title}
                onChange={(e) =>
                  setNewVideo({ ...newVideo, title: e.target.value })
                }
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
                onChange={(e) =>
                  setNewVideo({ ...newVideo, description: e.target.value })
                }
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
                onChange={(e) =>
                  setNewVideo({ ...newVideo, category: e.target.value })
                }
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
              <input
                type="url"
                value={newVideo.videoUrl}
                onChange={(e) =>
                  setNewVideo({ ...newVideo, videoUrl: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="https://example.com/video.mp4"
                required
              />
            </div>
            {/* Thumbnail URL */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thumbnail URL (Optional)
              </label>
              <input
                type="url"
                value={newVideo.thumbnailUrl}
                onChange={(e) =>
                  setNewVideo({ ...newVideo, thumbnailUrl: e.target.value })
                }
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
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Upload
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadVideoModal;

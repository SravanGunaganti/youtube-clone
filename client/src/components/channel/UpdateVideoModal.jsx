const UpdateVideoModal = ({
  editingVideo,
  setEditingVideo,
  onClose,
  onUpdate,
}) => {
  // If no video is being edited, return null
  if (!editingVideo) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-full overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Update Video</h2>
          {/* Video Edit Form */}
          <form onSubmit={onUpdate}>
            <div className="mb-4">
              {/* Video Title */}
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Title
              </label>
              <input
                type="text"
                value={editingVideo.title}
                onChange={(e) =>
                  setEditingVideo({ ...editingVideo, title: e.target.value })
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
                onChange={(e) =>
                  setEditingVideo({
                    ...editingVideo,
                    description: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 h-24 resize-none"
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
                value={editingVideo.thumbnailUrl}
                onChange={(e) =>
                  setEditingVideo({
                    ...editingVideo,
                    thumbnailUrl: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="https://example.com/thumbnail.jpg"
              />
            </div>
            {/* Save and Cancel Buttons */}
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
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateVideoModal;

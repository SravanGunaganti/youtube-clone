// Update ChannelModal component
const UpdateChannelModal = ({
  editChannelData,
  setEditChannelData,
  onClose,
  onSubmit,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-full overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Update Channel</h2>
          {/* Channel Edit Form */}
          <form onSubmit={onSubmit}>
            {/* Channel Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Channel Name
              </label>
              <input
                type="text"
                value={editChannelData.channelName}
                onChange={(e) =>
                  setEditChannelData({
                    ...editChannelData,
                    channelName: e.target.value,
                  })
                }
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
                onChange={(e) =>
                  setEditChannelData({
                    ...editChannelData,
                    description: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 h-24 resize-none"
                placeholder="Enter channel description..."
                required
              />
            </div>
            {/* Avatar URL */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avatar URL
              </label>
              <input
                type="url"
                value={editChannelData.avatar}
                onChange={(e) =>
                  setEditChannelData({
                    ...editChannelData,
                    avatar: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="https://example.com/avatar.jpg"
                required
              />
            </div>
            {/* Banner URL */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banner URL (Optional)
              </label>
              <input
                type="url"
                value={editChannelData.channelBanner}
                onChange={(e) =>
                  setEditChannelData({
                    ...editChannelData,
                    channelBanner: e.target.value,
                  })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="https://example.com/banner.jpg"
              />
            </div>
            {/* Buttons  for cancel and update */}
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
                Save Chanages
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateChannelModal;

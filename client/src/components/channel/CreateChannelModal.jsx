import React from "react";

const CreateChannelModal = ({ authUser, onClose, onSubmit }) => {
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
            <form onSubmit={onSubmit} className="space-y-4">
              {/* Channel Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Channel name
                </label>
                <div className="flex items-center space-x-2 p-2 border border-gray-300 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {authUser?.username?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <input
                    type="text"
                    name="channelName"
                    defaultValue={authUser?.username || ""}
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
                  name="channelDescription"
                  rows={2}
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
                  onClick={onClose}
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

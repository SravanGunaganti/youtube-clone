import { useNavigate } from "react-router-dom";

// NoChannelPrompt component
const NoChannelPrompt = ({ username, onCreate }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="currentColor"
              viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Create a channel
          </h2>
          <p className="text-gray-600 mb-6">
            Create a channel to upload videos, comment, and more.
          </p>

          <button
            onClick={onCreate}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors mb-3">
            Create channel
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full px-6 py-3 text-blue-600 hover:bg-blue-50 rounded-full font-medium transition-colors">
            Go back to home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoChannelPrompt;

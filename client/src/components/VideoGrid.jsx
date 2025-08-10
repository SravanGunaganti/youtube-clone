import React from "react";
import VideoCard from "./VideoCard";

const VideoGrid = ({ searchQuery, videos, loading, error, fetchVideos }) => {
  // Render loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-300 h-48 rounded-lg mb-3"></div>
            <div className="flex space-x-3">
              <div className="bg-gray-300 w-9 h-9 rounded-full"></div>
              <div className="flex-1">
                <div className="bg-gray-300 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 h-3 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="text-red-500 text-lg mb-4">{error}</div>
        <button
          onClick={fetchVideos}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Try Again
        </button>
      </div>
    );
  }
  // videos not found
  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="text-gray-500 text-lg mb-4">
          {searchQuery
            ? `No videos found for "${searchQuery}"`
            : "No videos available"}
        </div>
        {searchQuery && (
          <p className="text-gray-400 text-sm">
            Try searching for something else or check your spelling
          </p>
        )}
      </div>
    );
  }

  // Render video grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 5xl:grid-cols-4 gap-4 md:p-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
};

// memoize the component
export default React.memo(VideoGrid);

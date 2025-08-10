import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  formatNumber,
  getInitial,
  getTimeAgo,
} from "../utils/utilityFunctions";

const VideoCard = ({ video }) => {
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [avatarError, setAvatarError] = useState(false);

  // Handle video loaded metadata
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Play video on hover
  const handleMouseOver = () => {
    if (!videoRef.current) return;
    videoRef.current.play();
  };

  // Pause video on mouse out
  const handleMouseOut = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    videoRef.current.load();
  };

  // Format duration
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="w-full mx-auto bg-white  overflow-hidden  transition-shadow duration-300">
      {/* Video inside link to watch page  */}
      <Link to={`/watch/${video.id}`} className="block">
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full aspect-video md:rounded-xl object-cover hover:md:rounded-none transistion-all duration-300"
            controls={false}
            muted
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onLoadedMetadata={handleLoadedMetadata}
            poster={video.thumbnailUrl}
            preload="metadata"
            src={video.videoUrl}>
            <source src={video.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute bottom-2 right-2 bg-black bg-opacity/80 text-white text-xs px-1 py-0.5 rounded">
            {duration ? formatDuration(duration) : "Loading..."}
          </div>
        </div>
      </Link>
      {/* Video details */}
      <div className="p-3 flex space-x-3">
        <div className="flex-shrink-0">
          {video.channel.avatar && !avatarError ? (
            <img
              src={video.channel.avatar}
              onError={() => setAvatarError(true)}
              alt="Channel"
              className="w-9 h-9 rounded-full"
            />
          ) : (
            <div className="w-9 h-9 bg-blue-100 text-black font-bold flex items-center justify-center rounded-full">
              {getInitial(video?.channel?.name)}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Title with link to watch */}
          <Link to={`/watch/${video.id}`}>
            <h3 className="text-base font-semibold  leading-[22px] text-gray-900 line-clamp-2 mb-1">
              {video.title}
            </h3>
          </Link>

          {/* Channel name with link */}
          <div className="flex md:flex-col gap-1 md:items-start items-center text-xs text-gray-600">
            <Link to={`/channel/${video.channel.id}`}>
              <p className="text-sm text-gray-600 font-medium hover:text-gray-900 cursor-pointer">
                {video.channel.name || "Unknown Channel"}
              </p>
            </Link>
            <span className="text-sm">
              <span className="mx-1 md:hidden">•</span>
              <span>{formatNumber(video.views)} views</span>
              <span className="mx-1">•</span>
              <span>{getTimeAgo(video.uploadDate)}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
// memoize the component
export default React.memo(VideoCard);

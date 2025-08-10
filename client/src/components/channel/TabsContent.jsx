// components/ChannelPage/TabsContent.jsx
import {
  MdVideoLibrary,
  MdPlaylistPlay,
  MdInfo,
  MdVerified,
} from "react-icons/md";
import {
  FaSearch,
  FaEye,
  FaThumbsUp,
  FaThumbsDown,
  FaCalendarAlt,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { formatNumber, getTimeAgo } from "../../utils/utilityFunctions";

// TabsContent component
const TabsContent = ({
  videos,
  isOwner,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  startEditVideo,
  handleDeleteVideo,
  channelData,
}) => {
  // Tabs
  const tabs = [
    { id: "videos", label: "Videos", icon: MdVideoLibrary },
    { id: "playlists", label: "Playlists", icon: MdPlaylistPlay },
    { id: "about", label: "About", icon: MdInfo },
  ];

  // Filter videos
  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 px-4 lg:px-6">
        <nav className="flex space-x-8">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === id
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}>
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="px-4 lg:px-6 py-6">
        {activeTab === "videos" && (
          <div>
            {/* Search and Filter */}
            <div className="flex items-center justify-between mb-6">
              <div className="relative">
                <FaSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="search"
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-gray-600 w-64"
                />
              </div>
              <div className="text-sm text-gray-600">
                {filteredVideos.length} video
                {filteredVideos.length !== 1 ? "s" : ""}
              </div>
            </div>

            {/* Videos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVideos.map((video) => (
                <div key={video._id} className="group">
                  <div className="relative">
                    <Link to={`/watch/${video._id}`}>
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full aspect-video object-cover rounded-lg hover:rounded-none transition-all duration-200"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/90 text-white text-xs px-1.5 py-0.5 rounded">
                        {video.duration}
                      </div>
                    </Link>
                    {isOwner && (
                      <div className="absolute top-2 right-2">
                        <div className="flex gap-1">
                          <button
                            onClick={() => startEditVideo(video)}
                            className="p-2 bg-blue-600/70 text-white rounded-full hover:bg-black/90 transition-colors"
                            title="Edit video">
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteVideo(video._id)}
                            className="p-2 bg-red-600/70 text-white rounded-full hover:bg-red-600/90 transition-colors"
                            title="Delete video">
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <Link to={`/watch/${video._id}`}>
                      <h3 className="font-medium text-base line-clamp-2 text-gray-900 hover:text-blue-600 transition-colors">
                        {video.title}
                      </h3>
                    </Link>
                    <div className="flex justify-between items-center gap-4 mt-1 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1">
                          <FaEye size={10} />
                          <span>{formatNumber(video.views)} views</span>
                        </div>
                        <span>•</span>
                        <span>{getTimeAgo(video.uploadDate)}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <FaThumbsUp size={12} className="text-blue-500" />
                          <span>{formatNumber(video.likes)}</span>
                        </div>
                        {isOwner && (
                          <div className="flex items-center gap-1">
                            <FaThumbsDown size={12} className="text-red-500" />
                            <span>{formatNumber(video.dislikes)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Playlists */}
        {activeTab === "playlists" && (
          <div className="text-center py-12">
            <MdPlaylistPlay size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No playlists yet
            </h3>
            <p className="text-gray-600">
              Create playlists to organize your videos
            </p>
          </div>
        )}

        {activeTab === "about" && (
          <div className="max-w-4xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-3">Description</h3>
                <p className="text-sm md:text-base text-gray-700 ">
                  {channelData.description}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FaCalendarAlt className="text-gray-500" />
                    <span className="text-sm text-gray-700">
                      Joined:{" "}
                      {new Date(channelData.createdAt)
                        .toDateString()
                        .split(" ")
                        .slice(1)
                        .join(" ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaEye className="text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {formatNumber(
                        videos.reduce((acc, video) => acc + video.views, 0)
                      )}{" "}
                      total views
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MdVideoLibrary className="text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {videos.length} videos
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TabsContent;

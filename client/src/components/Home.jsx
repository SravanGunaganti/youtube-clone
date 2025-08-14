import React, { useState, useContext, useEffect } from "react";
import FilterButtons from "./FilterButtons";
import VideoGrid from "./VideoGrid";
import { NavContext } from "../context/NavContext";
import { useAuth } from "../context/AuthContext";
import { videoAPI , handleAPIError} from "../services/api";
import useActivePath from "../helpers/useActivePath.js";
import { BiRefresh } from "react-icons/bi";
import { toast } from "react-toastify";

// Home component
export default function Home() {
  const [videos, setVideos] = useState([]);
  const [allVideos, setAllVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { isSidebarOpen, searchQuery, handleSearch } = useContext(NavContext);
  const [categories, setCategories] = useState([]);
  const isActivePath = useActivePath();
  const { authUser } = useAuth();

  // Function to handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  // Function to fetch videos
  async function fetchVideos() {
    try {
      setLoading(true);
      const res = await videoAPI.getAllVideos();
      if (res.success) {
        const categories = [
          ...new Set(res.data.videos.map((video) => video.category)),
        ];
        setCategories(["All", ...categories]);

        setVideos(res.data.videos);
        setAllVideos(res.data.videos);
      } else {
        setError("Failed to load videos");
        setLoading(false);
        return;
      }
      setLoading(false);
      setError(null);
    } catch (error) {
      toast.error(handleAPIError(error).message);
      setError("Failed to load videos");
      setLoading(false);
      console.error("Error fetching videos:", handleAPIError(error));
    }
  }

  // Fetch videos
  useEffect(() => {
    fetchVideos();
  }, []);

  // Filter videos
  useEffect(() => {
    const filteredVideos = allVideos.filter((video) => {
      const title = String(video?.title || "").toLowerCase();
      const description = String(video?.description || "").toLowerCase();
      const search = String(searchQuery || "").toLowerCase();

      const matchesSearch =
        !search || title.includes(search) || description.includes(search);

      const matchesCategory =
        !selectedCategory ||
        selectedCategory === "All" ||
        video.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    setVideos(filteredVideos);
  }, [searchQuery, selectedCategory, allVideos]);

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setVideos(allVideos);
    handleSearch("");
  };

  return (
    <>
      {!authUser ? (
        <div className="pt-4">
          <div className="max-w-3xl mx-auto space-y-3 shadow-[0_8px_23px_rgba(0,0,0,0.1)] text-center p-5">
            <p className="font-bold text-2xl">Try searching to get started</p>

            <p className="text-sm">
              Start watching videos to help us build a feed of videos you'll
              love.
            </p>
          </div>
        </div>
      ) : (
        <div className="relative w-full pt-14">
         

          <div
            className={`${
              !isActivePath("/watch/") && isSidebarOpen
                ? "md:left-18 xl:left-60"
                : "md:left-18"
            } top-14 fixed z-30 max-w-full right-0 bg-white py-2`}>
            <FilterButtons
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          </div>

          {/* Search Results Header */}
          {searchQuery && (
            <div className="flex justify-between gap-2 items-center px-4 py-3 bg-gray-100 border-b">
              <p className="text-sm text-gray-600">
                Search results for:{" "}
                <span className="font-medium">"{searchQuery}"</span>
              </p>
              <button
                onClick={handleResetFilters}
                className="flex whitespace-nowrap items-center text-sm gap-2 px-4 py-2 bg-white  border text-gray-600 border-gray-600 rounded-lg shadow-lg hover:bg-gray-50 transition">
                <BiRefresh size={20} />
                Reset Filters
              </button>
            </div>
          )}

          {/* Video Grid */}
          <VideoGrid
            videos={videos}
            searchQuery={searchQuery}
            fetchVideos={fetchVideos}
            loading={loading}
            error={error}
          />
        </div>
      )}
    </>
  );
}

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import UserProfileDropdown from "./UserProfileDropdown";
import EditProfileModal from "./EditProfileModal";
import { NavContext } from "../context/NavContext";
import { useContext } from "react";
import Overlay from "./Overlay";
import { AiOutlineBell } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineBars3 } from "react-icons/hi2";
import { MdKeyboardVoice } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { IoMdArrowRoundBack } from "react-icons/io";

const Header = ({ onMenuToggle, onSearch }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const { showProfile, setShowProfile } = useContext(NavContext);
  const [avatarError, setAvatarError] = useState(true);
  const { authUser,logout } = useAuth();

  // useNavigate hook to navigate
  const navigate = useNavigate();

  // function to handle search
  const handleSearch = (e) => {
    setShowSearch(false);
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery);
    }
    setSearchQuery("");
  };

  // function to handle sign out
  const handleSignOut = () => {
    logout();
    navigate("/signin");
  };

  // function to handle edit profile
  const handleEditProfile = () => {
    if (showSearch) {
      setShowSearch(false);
    }
    setShowEditProfileModal(true);
    setShowProfile(false);
  };

  // function to handle show search
  const handleShowSearch = (value) => {
    if (showProfile) {
      setShowProfile(false);
    }
    setShowSearch(value);
  };

  useEffect(() => {
    const image = new Image();
    image.onload = () => {
      setAvatarError(false);
    };
    image.onerror = () => {
      setAvatarError(true);
    };
    image.src = authUser?.avatar;
  }, [authUser?.avatar]);
  return (
    // header
    <header className="fixed w-screen top-0 z-50 flex justify-between items-center px-4 h-14 bg-white gap-2">
      <div className="flex items-center">
        {/* menu button */}
        <button
          onClick={() => onMenuToggle && onMenuToggle()}
          className="p-2 flex items-center border-none justify-center rounded-full hover:bg-gray-200">
          <HiOutlineBars3 size={24} />
        </button>
        {/* logo */}
        <div className="flex-none relative">
          <Link to="/">
          <img
            src="https://www.gstatic.com/youtube/img/branding/youtubelogo/svg/youtubelogo.svg"
            alt="YouTube"
            className="w-[93px] mx-[16px] my-[18px]"
          />
          <span className="text-[10px] absolute top-3 text-gray-500 right-1">
            IN
          </span>
          </Link>
        </div>
      </div>
      {/* search bar */}
      <div className="hidden md:flex rounded-3xl justify-between items-center w-fit flex-1 max-w-xl">
        <form onSubmit={handleSearch} className="flex w-full">
          <div className="h-full flex justify-between items-center border overflow-hidden border-gray-300 rounded-3xl flex-grow pl-2">
            <input
              type="search"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
              className="outline-0 rounded-l-3xl w-full px-4"
            />
            <div className="bg-gray-100 hover:bg-gray-200 h-full flex p-2 justify-center items-center rounded-r-3xl">
              <button
                onClick={handleSearch}
                className="h-full w-[40px] flex justify-center items-center">
                <CiSearch fontSize={24} />
              </button>
            </div>
          </div>
        </form>
        <div className="rounded-full bg-gray-100 hover:bg-gray-200 ml-4 p-2 cursor-pointer">
          <MdKeyboardVoice fontSize={24} />
        </div>
      </div>
      {/* search button */}
      <div className="md:hidden hover:bg-gray-200 h-full flex p-2 justify-center items-center rounded-full">
        <button
          onClick={() => handleShowSearch(true)}
          className="h-full flex justify-center items-center">
          <CiSearch fontSize={24} />
        </button>
      </div>
      {/* mobile search bar */}
      {showSearch && (
        <div className="h-14 md:hidden fixed z-60 top-0 left-0 right-0 px-2 bg-white w-full flex justify-between gap-2 items-center">
          <button
            onClick={() => handleShowSearch(false)}
            className="h-full flex justify-center items-center">
            <IoMdArrowRoundBack fontSize={24} />
          </button>
          <div className="flex rounded-3xl justify-between items-center w-fit flex-1 max-w-xl">
            <div className="h-full flex justify-between items-center border overflow-hidden border-gray-300 rounded-3xl flex-grow pl-2">
              <input
                type="search"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
                className="outline-0 rounded-l-3xl w-full px-4"
              />
              <div className="bg-gray-100 hover:bg-gray-200 h-full flex p-2 justify-center items-center rounded-r-3xl">
                <button
                  onClick={handleSearch}
                  className="h-full w-[40px] flex justify-center items-center">
                  <CiSearch fontSize={24} />
                </button>
              </div>
            </div>
            <div className="rounded-full bg-gray-100 hover:bg-gray-200 ml-4 p-2 cursor-pointer">
              <MdKeyboardVoice fontSize={24} />
            </div>
          </div>
        </div>
      )}

      {/* overlay */}
      {showSearch && <Overlay />}

      {/* right side  profile and notification*/}
      <div className="flex items-center">
        {authUser ? (
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className=" hover:bg-gray-100 rounded-full transition-colors">
              <AiOutlineBell size={24} />
            </button>

            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex mx-2 items-center gap-2 cursor-pointer">
              {authUser?.avatar && !avatarError ? (
                <img
                  src={authUser.avatar}
                  onError={() => setAvatarError(true)}
                  onLoad={() => setAvatarError(false)}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 flex justify-center items-center rounded-full bg-blue-100 font-semibold">
                  {authUser?.username.charAt(0)?.toUpperCase()}
                </div>
              )}
            </button>
            {/*Profile dropdown */}
            {showProfile && (
              <UserProfileDropdown
                user={authUser}
                onLogout={handleSignOut}
                onEditProfile={handleEditProfile}
                avatarError={avatarError}
              />
            )}
          </div>
        ) : (
          <Link
            to="/signin"
            className="flex items-center px-2 gap-2 py-1 text-blue-700 bg-none border-2 font-semibold text-sm border-gray-200 rounded-3xl hover:bg-blue-50">
            <CgProfile fontSize={24} /> Sign in
          </Link>
        )}
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
        user={authUser}
        
      />
    </header>
  );
};

export default Header;

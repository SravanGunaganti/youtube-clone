import React from "react";
import { Link } from "react-router-dom";
import { PiSignOutBold } from "react-icons/pi";
import { MdEdit, MdSettings } from "react-icons/md";
import { BsCameraVideo } from "react-icons/bs";
import { getInitial } from "../utils/utilityFunctions";
const UserProfileDropdown = ({ user, onLogout, onEditProfile }) => {
  if (!user) return null;
  return (
    <div className="absolute right-4 top-16 w-72 bg-white shadow-lg rounded-xl border border-gray-200 z-50 overflow-hidden">
      {/* Header Section - YouTube Style */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center font-bold text-white text-sm">
              {getInitial(user?.username)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {user?.username}
            </h3>
            <p className="text-xs text-gray-600 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      <hr className="border-gray-200" />

      {/* Dropdown Menu */}
      <div className="py-2">
        <button
          onClick={onEditProfile}
          className="w-full flex items-center gap-4 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors text-sm">
          <MdEdit size={20} className="text-gray-600" />
          <span>Edit Profile</span>
        </button>

        <Link
          to={`/channel/${user.channelId ? user.channelId : user.id}`}
          className="w-full flex items-center gap-4 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors text-sm">
          <BsCameraVideo size={20} className="text-gray-600" />
          <span>View your channel</span>
        </Link>

        <button className="w-full flex items-center gap-4 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors text-sm">
          <MdSettings size={20} className="text-gray-600" />
          <span>Settings</span>
        </button>

        <hr className="my-2 border-gray-200" />

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors text-sm">
          <PiSignOutBold size={20} className="text-gray-600" />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  );
};

export default UserProfileDropdown;

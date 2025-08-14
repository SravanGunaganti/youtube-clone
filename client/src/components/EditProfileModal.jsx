import React, { useState, useEffect } from "react";
import { MdClose, MdEdit, MdPerson, MdEmail } from "react-icons/md";
import { AiOutlineCamera } from "react-icons/ai";
import { toast } from "react-toastify";
import { handleAPIError, userAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { getInitial } from "../utils/utilityFunctions";

const EditProfileModal = ({ isOpen, onClose, user }) => {
  const { updateAuthUser } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    avatar: user?.avatar || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  // Update form data when user or isOpen changes
  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        username: user.username || "",
        avatar: user.avatar || "",
      });
      setAvatarError(user.avatar ? false : true);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [user, isOpen]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    if (!formData.username.trim().length > 2) {
      setIsLoading(false);
      return toast.error("Username cannot be empty");
    }

    if (avatarError && !formData?.avatar.trim()) {
      setIsLoading(false);
      return toast.error("Please provide a valid avatar url");
    }

    try {
      const response = await userAPI.updateProfile({
        username: formData.username.trim(),
        avatar: formData?.avatar.trim(),
      });

      if (response.success) {
        // Update auth context with new user data
        updateAuthUser(response.data);
        toast.success("Profile updated successfully!");
        onClose();
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", handleAPIError(error));
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const image = new Image();
    image.src = formData?.avatar;
    image.onload = () => {
      setAvatarError(false);
    };
    image.onerror = () => {
      setAvatarError(true);
    };
  }, [formData?.avatar]);

  if (!isOpen) return null;

  const isDisabled =
    isLoading ||
    (user.username === formData.username && user.avatar === formData.avatar);

  return (
    <div className="fixed inset-0  bg-black/50 flex items-center justify-center z-50">
      <div className="relative overflow-hidden w-full max-h-full overflow-y-auto rounded-2xl p-4">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl mx-auto ">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">
              Edit Profile
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              disabled={isLoading}>
              <MdClose size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                {formData?.avatar && !avatarError ? (
                  <img
                    src={formData.avatar}
                    alt="Profile preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                    onError={() => setAvatarError(true)}
                    onLoad={() => setAvatarError(false)}
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center font-bold text-white text-2xl border-4 border-gray-200">
                    {getInitial(formData.username)}
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg">
                  <AiOutlineCamera size={16} />
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                Profile picture will be displayed across YouTube
              </p>
            </div>

            {/* Avatar URL Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MdPerson className="inline mr-1" size={16} />
                Avatar URL
              </label>
              <input
                type="url"
                name="avatar"
                value={formData.avatar}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="https://example.com/avatar.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                {avatarError && formData.avatar ? (
                  <span className="text-red-500">Please provide a valid URL</span>
                ) : (
                  "Enter a URL for your profile picture (optional)"
                )}
              </p>
            </div>

            {/* Username Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MdEdit className="inline mr-1" size={16} />
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                placeholder="Enter your username"
                required
                minLength={3}
                maxLength={30}
              />
              <p className="text-xs text-gray-500 mt-1">
                Choose a username that represents you
              </p>
            </div>

            {/* Email Display (Read-only) */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MdEmail className="inline mr-1" size={16} />
                Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={isLoading}>
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isDisabled}>
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </div>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default React.memo(EditProfileModal);

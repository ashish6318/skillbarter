import React, { useState } from "react";
import { XMarkIcon, PhotoIcon, MapPinIcon } from "@heroicons/react/24/outline";

const ProfileEditModal = ({ user, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    title: user?.title || "",
    bio: user?.bio || "",
    country: user?.country || "",
    languages: user?.languages || [],
    timezone: user?.timezone || "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      setErrors({ general: error.message || "Failed to update profile" });
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      title: user?.title || "",
      bio: user?.bio || "",
      country: user?.country || "",
      languages: user?.languages || [],
      timezone: user?.timezone || "",
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-600">
          <h2 className="text-2xl font-mono font-bold text-dark-50">
            Edit Profile
          </h2>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-dark-300" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.general && (
            <div className="p-4 bg-error-500 bg-opacity-10 border border-error-500 rounded-lg">
              <p className="text-error-500 font-mono text-sm">
                {errors.general}
              </p>
            </div>
          )}
          {/* Profile Picture Upload */}
          <div>
            <label className="block text-sm font-mono font-medium text-dark-200 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center">
                <PhotoIcon className="w-8 h-8 text-dark-400" />
              </div>
              <button
                type="button"
                className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-dark-100 rounded-lg transition-colors border border-dark-600 hover:border-accent-400 font-mono text-sm"
              >
                Change Photo
              </button>
            </div>
          </div>{" "}
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-mono font-medium text-dark-200 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className={`w-full px-3 py-2 bg-dark-700 border rounded-lg font-mono text-sm text-dark-50 ${
                  errors.firstName ? "border-error-500" : "border-dark-600"
                }`}
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <p className="text-error-500 font-mono text-xs mt-1">
                  {errors.firstName}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-mono font-medium text-dark-200 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className={`w-full px-3 py-2 bg-dark-700 border rounded-lg font-mono text-sm text-dark-50 ${
                  errors.lastName ? "border-error-500" : "border-dark-600"
                }`}
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <p className="text-error-500 font-mono text-xs mt-1">
                  {errors.lastName}
                </p>
              )}
            </div>{" "}
          </div>{" "}
          {/* Professional Title */}
          <div>
            <label className="block text-sm font-mono font-medium text-dark-200 mb-2">
              Professional Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg font-mono text-sm text-dark-50"
              placeholder="e.g., Full Stack Developer, UI/UX Designer"
            />
          </div>
          {/* Bio */}
          <div>
            <label className="block text-sm font-mono font-medium text-dark-200 mb-2">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg font-mono text-sm text-dark-50 resize-none"
              placeholder="Tell others about yourself, your experience, and what you're passionate about..."
            />
          </div>
          {/* Country and Timezone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-mono font-medium text-dark-200 mb-2">
                Country
              </label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-dark-700 border border-dark-600 rounded-lg font-mono text-sm text-dark-50"
                  placeholder="Your country"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-mono font-medium text-dark-200 mb-2">
                Timezone
              </label>
              <input
                type="text"
                value={formData.timezone}
                onChange={(e) => handleInputChange("timezone", e.target.value)}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg font-mono text-sm text-dark-50"
                placeholder="e.g., UTC+2, EST, PST"
              />
            </div>
          </div>{" "}
          {/* Languages */}
          <div>
            <label className="block text-sm font-mono font-medium text-dark-200 mb-2">
              Languages
            </label>
            <input
              type="text"
              value={
                Array.isArray(formData.languages)
                  ? formData.languages.join(", ")
                  : ""
              }
              onChange={(e) => {
                const languagesString = e.target.value;
                const languagesArray = languagesString
                  .split(",")
                  .map((lang) => lang.trim())
                  .filter((lang) => lang.length > 0);
                handleInputChange("languages", languagesArray);
              }}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg font-mono text-sm text-dark-50"
              placeholder="English, Spanish, French (comma-separated)"
            />
            <p className="text-dark-400 font-mono text-xs mt-1">
              Separate multiple languages with commas
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-dark-600">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-dark-300 hover:text-dark-100 transition-colors font-mono text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-400 hover:to-accent-500 text-white rounded-lg transition-all font-mono text-sm disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;

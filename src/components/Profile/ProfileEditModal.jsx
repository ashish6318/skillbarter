import React, { useState } from "react";
import { XMarkIcon, PhotoIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import {
  themeClasses,
  componentPatterns,
  cn,
  buttonVariants,
} from "../../utils/theme";

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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={cn(
            "fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4",
            "bg-black/50"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className={cn(
              componentPatterns.modal,
              "w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            )}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div
              className={cn(
                "flex items-center justify-between p-6 border-b",
                themeClasses.borderSecondary
              )}
            >
              <h2
                className={cn(
                  "text-2xl font-mono font-bold",
                  themeClasses.textPrimary
                )}
              >
                Edit Profile
              </h2>
              <button
                onClick={handleCancel}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  themeClasses.hover
                )}
              >
                <XMarkIcon className={cn("w-5 h-5", themeClasses.textMuted)} />
              </button>
            </div>{" "}
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {errors.general && (
                <div
                  className={cn(
                    "p-4 border rounded-lg",
                    themeClasses.errorLight,
                    "border-theme-error"
                  )}
                >
                  <p className={cn("font-mono text-sm", themeClasses.error)}>
                    {errors.general}
                  </p>
                </div>
              )}
              {/* Profile Picture Upload */}
              <div>
                <label
                  className={cn(
                    "block text-sm font-medium mb-2",
                    themeClasses.textSecondary
                  )}
                >
                  Profile Picture
                </label>
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center",
                      themeClasses.bgTertiary
                    )}
                  >
                    <PhotoIcon
                      className={cn("w-8 h-8", themeClasses.textMuted)}
                    />
                  </div>
                  <motion.button
                    type="button"
                    className={cn(
                      "px-4 py-2 rounded-lg transition-colors border text-sm",
                      themeClasses.bgSecondary,
                      themeClasses.textPrimary,
                      themeClasses.borderPrimary,
                      themeClasses.hover
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Change Photo
                  </motion.button>
                </div>
              </div>
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={cn(
                      "block text-sm font-medium mb-2",
                      themeClasses.textSecondary
                    )}
                  >
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className={cn(
                      "w-full px-3 py-2 border rounded-lg text-sm transition-colors",
                      themeClasses.bgSecondary,
                      themeClasses.textPrimary,
                      errors.firstName
                        ? "border-red-500 dark:border-red-400"
                        : themeClasses.borderPrimary,
                      "focus:outline-none focus:ring-2 focus:ring-gray-500/30"
                    )}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className={cn(
                      "block text-sm font-medium mb-2",
                      themeClasses.textSecondary
                    )}
                  >
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className={cn(
                      "w-full px-3 py-2 border rounded-lg text-sm transition-colors",
                      themeClasses.bgSecondary,
                      themeClasses.textPrimary,
                      errors.lastName
                        ? "border-red-500 dark:border-red-400"
                        : themeClasses.borderPrimary,
                      "focus:outline-none focus:ring-2 focus:ring-gray-500/30"
                    )}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
              {/* Professional Title */}
              <div>
                <label
                  className={cn(
                    "block text-sm font-medium mb-2",
                    themeClasses.textSecondary
                  )}
                >
                  Professional Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg text-sm transition-colors",
                    themeClasses.bgSecondary,
                    themeClasses.textPrimary,
                    themeClasses.borderPrimary,
                    "focus:outline-none focus:ring-2 focus:ring-gray-500/30"
                  )}
                  placeholder="e.g., Full Stack Developer, UI/UX Designer"
                />
              </div>
              {/* Bio */}
              <div>
                <label
                  className={cn(
                    "block text-sm font-medium mb-2",
                    themeClasses.textSecondary
                  )}
                >
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={4}
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg text-sm resize-none transition-colors",
                    themeClasses.bgSecondary,
                    themeClasses.textPrimary,
                    themeClasses.borderPrimary,
                    "focus:outline-none focus:ring-2 focus:ring-gray-500/30"
                  )}
                  placeholder="Tell others about yourself, your experience, and what you're passionate about..."
                />
              </div>
              {/* Country and Timezone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={cn(
                      "block text-sm font-medium mb-2",
                      themeClasses.textSecondary
                    )}
                  >
                    Country
                  </label>
                  <div className="relative">
                    <MapPinIcon
                      className={cn(
                        "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4",
                        themeClasses.textMuted
                      )}
                    />
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) =>
                        handleInputChange("country", e.target.value)
                      }
                      className={cn(
                        "w-full pl-10 pr-3 py-2 border rounded-lg text-sm transition-colors",
                        themeClasses.bgSecondary,
                        themeClasses.textPrimary,
                        themeClasses.borderPrimary,
                        "focus:outline-none focus:ring-2 focus:ring-gray-500/30"
                      )}
                      placeholder="Your country"
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={cn(
                      "block text-sm font-medium mb-2",
                      themeClasses.textSecondary
                    )}
                  >
                    Timezone
                  </label>
                  <input
                    type="text"
                    value={formData.timezone}
                    onChange={(e) =>
                      handleInputChange("timezone", e.target.value)
                    }
                    className={cn(
                      "w-full px-3 py-2 border rounded-lg text-sm transition-colors",
                      themeClasses.bgSecondary,
                      themeClasses.textPrimary,
                      themeClasses.borderPrimary,
                      "focus:outline-none focus:ring-2 focus:ring-gray-500/30"
                    )}
                    placeholder="e.g., UTC+2, EST, PST"
                  />
                </div>
              </div>
              {/* Languages */}
              <div>
                <label
                  className={cn(
                    "block text-sm font-medium mb-2",
                    themeClasses.textSecondary
                  )}
                >
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
                  className={cn(
                    "w-full px-3 py-2 border rounded-lg text-sm transition-colors",
                    themeClasses.bgSecondary,
                    themeClasses.textPrimary,
                    themeClasses.borderPrimary,
                    "focus:outline-none focus:ring-2 focus:ring-gray-500/30"
                  )}
                  placeholder="English, Spanish, French (comma-separated)"
                />
                <p className={cn("text-xs mt-1", themeClasses.textMuted)}>
                  Separate multiple languages with commas
                </p>
              </div>
            </form>
            {/* Footer */}
            <div
              className={cn(
                "flex justify-end gap-3 p-6 border-t",
                themeClasses.borderSecondary
              )}
            >
              <motion.button
                type="button"
                onClick={handleCancel}
                className={cn(
                  "px-4 py-2 transition-colors text-sm",
                  themeClasses.textMuted,
                  "hover:text-gray-900 dark:hover:text-gray-100"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleSubmit}
                disabled={loading}
                className={cn(
                  buttonVariants.primary,
                  "px-6 py-2 text-sm disabled:opacity-50"
                )}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? "Saving..." : "Save Changes"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileEditModal;

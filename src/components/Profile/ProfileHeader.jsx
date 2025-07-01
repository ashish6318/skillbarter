import React, { useState } from "react";
import {
  PencilIcon,
  CameraIcon,
  MapPinIcon,
  CalendarDaysIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import {
  themeClasses,
  componentPatterns,
  cn,
  buttonVariants,
} from "../../utils/theme";

const ProfileHeader = ({ user, onEdit, isOwnProfile = true }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };
  const getInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };

  const getFullName = (firstName, lastName) => {
    return [firstName, lastName].filter(Boolean).join(" ") || "User Name";
  };
  return (
    <motion.div
      className={cn(componentPatterns.card, "mb-6")}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Profile Picture */}
        <div className="relative">
          <div
            className={cn(
              "w-32 h-32 rounded-full overflow-hidden border-4",
              themeClasses.bgTertiary,
              themeClasses.borderSecondary
            )}
          >
            {user?.profilePicture && !imageError ? (
              <img
                src={user.profilePicture}
                alt={getFullName(user.firstName, user.lastName)}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            ) : (
              <div
                className={cn(
                  "w-full h-full flex items-center justify-center text-2xl font-mono font-bold",
                  themeClasses.textMuted
                )}
              >
                {getInitials(user?.firstName, user?.lastName)}
              </div>
            )}
          </div>
          {isOwnProfile && (
            <motion.button
              className={cn(
                "absolute bottom-0 right-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900",
                themeClasses.shadowMd
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <CameraIcon className="w-5 h-5" />
            </motion.button>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            {" "}
            <div>
              <h1
                className={cn(
                  "text-3xl font-bold mb-2",
                  themeClasses.textPrimary
                )}
              >
                {getFullName(user?.firstName, user?.lastName)}
              </h1>
              <p className={cn("text-lg mb-2", themeClasses.textSecondary)}>
                {user?.title || "No title set"}
              </p>
              {user?.country && (
                <div
                  className={cn(
                    "flex items-center mb-2",
                    themeClasses.textSecondary
                  )}
                >
                  <MapPinIcon className="w-4 h-4 mr-2" />
                  <span className="text-sm">{user.country}</span>
                </div>
              )}
              {user?.joinedDate && (
                <div
                  className={cn(
                    "flex items-center",
                    themeClasses.textSecondary
                  )}
                >
                  <CalendarDaysIcon className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    Joined {new Date(user.joinedDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
            {isOwnProfile && (
              <motion.button
                onClick={onEdit}
                className={cn(
                  buttonVariants.secondary,
                  "flex items-center gap-2"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <PencilIcon className="w-4 h-4" />
                <span className="text-sm">Edit Profile</span>
              </motion.button>
            )}
          </div>
          {/* Bio */}
          {user?.bio && (
            <p
              className={cn("leading-relaxed mb-4", themeClasses.textSecondary)}
            >
              {user.bio}
            </p>
          )}{" "}
          {/* Stats */}
          <div className="flex gap-6">
            <div className="text-center">
              <div
                className={cn("text-2xl font-bold", themeClasses.textAccent)}
              >
                {user?.stats?.totalSessions || 0}
              </div>
              <div className={cn("text-xs", themeClasses.textMuted)}>
                Sessions
              </div>
            </div>
            <div className="text-center">
              <div
                className={cn("text-2xl font-bold", themeClasses.textAccent)}
              >
                {user?.stats?.skillsOffered || 0}
              </div>
              <div className={cn("text-xs", themeClasses.textMuted)}>
                Skills Offered
              </div>
            </div>
            <div className="text-center">
              <div
                className={cn("text-2xl font-bold", themeClasses.textAccent)}
              >
                {user?.stats?.rating ? user.stats.rating.toFixed(1) : "0.0"}
              </div>
              <div
                className={cn(
                  "text-xs flex items-center gap-1",
                  themeClasses.textMuted
                )}
              >
                <StarIcon className="w-3 h-3" />
                Rating
              </div>
            </div>
            <div className="text-center">
              <div
                className={cn("text-2xl font-bold", themeClasses.textAccent)}
              >
                {user?.credits || 0}
              </div>
              <div className={cn("text-xs", themeClasses.textMuted)}>
                Credits
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;

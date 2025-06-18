import React, { useState } from "react";
import {
  PencilIcon,
  CameraIcon,
  MapPinIcon,
  CalendarDaysIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

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
    <div className="bg-card rounded-xl p-6 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Profile Picture */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-dark-700 border-4 border-dark-600">
            {" "}
            {user?.profilePicture && !imageError ? (
              <img
                src={user.profilePicture}
                alt={getFullName(user.firstName, user.lastName)}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-mono font-bold text-dark-300">
                {getInitials(user?.firstName, user?.lastName)}
              </div>
            )}
          </div>
          {isOwnProfile && (
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-accent-500 hover:bg-accent-600 rounded-full flex items-center justify-center transition-colors shadow-glow">
              <CameraIcon className="w-5 h-5 text-white" />
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            {" "}
            <div>
              <h1 className="text-3xl font-mono font-bold text-dark-50 mb-2">
                {getFullName(user?.firstName, user?.lastName)}
              </h1>
              <p className="text-lg text-dark-200 font-mono mb-2">
                {user?.title || "No title set"}
              </p>
              {user?.country && (
                <div className="flex items-center text-dark-300 mb-2">
                  <MapPinIcon className="w-4 h-4 mr-2" />
                  <span className="font-mono text-sm">{user.country}</span>
                </div>
              )}
              {user?.joinedDate && (
                <div className="flex items-center text-dark-300">
                  <CalendarDaysIcon className="w-4 h-4 mr-2" />
                  <span className="font-mono text-sm">
                    Joined {new Date(user.joinedDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
            {isOwnProfile && (
              <button
                onClick={onEdit}
                className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-dark-100 rounded-lg transition-colors border border-dark-600 hover:border-accent-400"
              >
                <PencilIcon className="w-4 h-4" />
                <span className="font-mono text-sm">Edit Profile</span>
              </button>
            )}
          </div>

          {/* Bio */}
          {user?.bio && (
            <p className="text-dark-200 font-mono leading-relaxed mb-4">
              {user.bio}
            </p>
          )}

          {/* Stats */}
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-accent-400">
                {user?.stats?.totalSessions || 0}
              </div>
              <div className="text-xs font-mono text-dark-300">Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-accent-400">
                {user?.stats?.skillsOffered || 0}
              </div>
              <div className="text-xs font-mono text-dark-300">
                Skills Offered
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-accent-400">
                {user?.stats?.rating ? user.stats.rating.toFixed(1) : "0.0"}
              </div>
              <div className="text-xs font-mono text-dark-300 flex items-center gap-1">
                <StarIcon className="w-3 h-3" />
                Rating
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-mono font-bold text-accent-400">
                {user?.credits || 0}
              </div>
              <div className="text-xs font-mono text-dark-300">Credits</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;

import React from "react";
import { MapPinIcon, StarIcon, ClockIcon } from "@heroicons/react/24/outline";

const UserCard = ({ user, onClick }) => {
  const getInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };

  const getFullName = (firstName, lastName) => {
    return [firstName, lastName].filter(Boolean).join(" ") || "Anonymous";
  };

  return (
    <div
      onClick={() => onClick?.(user)}
      className="bg-card rounded-lg p-6 hover:shadow-glow transition-all duration-200 cursor-pointer border border-dark-600 hover:border-accent-400"
    >
      {/* Profile Section */}
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-dark-700 flex items-center justify-center mr-4">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={getFullName(user.firstName, user.lastName)}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-lg font-mono font-bold text-dark-300">
              {getInitials(user.firstName, user.lastName)}
            </span>
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-mono font-semibold text-dark-50 text-lg">
            {getFullName(user.firstName, user.lastName)}
          </h3>
          {user.country && (
            <div className="flex items-center text-dark-400 text-sm">
              <MapPinIcon className="w-3 h-3 mr-1" />
              {user.country}
            </div>
          )}
        </div>
        {user.isOnline && (
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
        )}
      </div>

      {/* Bio */}
      {user.bio && (
        <p className="text-dark-300 font-mono text-sm mb-4 line-clamp-2">
          {user.bio}
        </p>
      )}

      {/* Skills */}
      <div className="mb-4">
        <h4 className="text-dark-200 font-mono font-medium text-sm mb-2">
          Skills Offered:
        </h4>
        <div className="flex flex-wrap gap-2">
          {user.skillsOffered?.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-accent-500 bg-opacity-20 text-accent-400 rounded-md text-xs font-mono"
            >
              {skill.skill}
            </span>
          ))}
          {user.skillsOffered?.length > 3 && (
            <span className="px-2 py-1 bg-dark-600 text-dark-300 rounded-md text-xs font-mono">
              +{user.skillsOffered.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center text-dark-400">
          <StarIcon className="w-4 h-4 mr-1" />
          <span className="font-mono">
            {user.rating ? user.rating.toFixed(1) : "New"}
          </span>
          {user.totalReviews > 0 && (
            <span className="font-mono ml-1">({user.totalReviews})</span>
          )}
        </div>
        <div className="flex items-center text-dark-400">
          <ClockIcon className="w-4 h-4 mr-1" />
          <span className="font-mono">
            {user.totalHoursTaught || 0}h taught
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserCard;

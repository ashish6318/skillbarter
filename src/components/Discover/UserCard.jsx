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
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 group hover:-translate-y-1"
    >
      {/* Profile Section */}
      <div className="flex items-center mb-5">
        <div className="relative">
          {" "}
          <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-4 ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-gray-400 dark:group-hover:ring-gray-500 transition-all duration-300">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={getFullName(user.firstName, user.lastName)}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {getInitials(user.firstName, user.lastName)}
              </span>
            )}
          </div>
          {user.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          {" "}
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg leading-tight mb-1">
            {getFullName(user.firstName, user.lastName)}
          </h3>
          {user.country && (
            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
              <MapPinIcon className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{user.country}</span>
            </div>
          )}
        </div>
      </div>{" "}
      {/* Bio */}
      {user.bio && (
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-5 line-clamp-2 leading-relaxed">
          {user.bio}
        </p>
      )}
      {/* Skills */}
      <div className="mb-5">
        <h4 className="text-gray-900 dark:text-gray-100 font-medium text-sm mb-3">
          Skills Offered
        </h4>{" "}
        <div className="flex flex-wrap gap-2">
          {user.skillsOffered?.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-700 group-hover:bg-gray-900 dark:group-hover:bg-gray-100 group-hover:text-gray-100 dark:group-hover:text-gray-900 transition-all duration-300"
            >
              {skill.skill}
            </span>
          ))}
          {user.skillsOffered?.length > 3 && (
            <span className="inline-flex items-center px-3 py-1.5 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-all duration-300">
              +{user.skillsOffered.length - 3} more
            </span>
          )}
        </div>
      </div>
      {/* Stats */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
          <StarIcon className="w-4 h-4 mr-1.5 text-yellow-500 fill-current" />
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {user.rating ? user.rating.toFixed(1) : "New"}
          </span>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
          <ClockIcon className="w-4 h-4 mr-1.5" />
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {user.totalHoursTaught || 0}h taught
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserCard;

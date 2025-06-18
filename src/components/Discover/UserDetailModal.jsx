import React from "react";
import {
  XMarkIcon,
  MapPinIcon,
  StarIcon,
  ClockIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";

const UserDetailModal = ({ user, isOpen, onClose, onMessage }) => {
  if (!isOpen || !user) return null;

  const getInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };

  const getFullName = (firstName, lastName) => {
    return [firstName, lastName].filter(Boolean).join(" ") || "Anonymous";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-600">
          <h2 className="text-2xl font-mono font-bold text-dark-50">
            User Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-dark-300" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Profile Header */}
          <div className="flex items-center mb-6">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-dark-700 flex items-center justify-center mr-6">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={getFullName(user.firstName, user.lastName)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-mono font-bold text-dark-300">
                  {getInitials(user.firstName, user.lastName)}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-mono font-bold text-dark-50 mb-2">
                {getFullName(user.firstName, user.lastName)}
              </h3>
              <div className="flex items-center gap-4 text-dark-300">
                {user.country && (
                  <div className="flex items-center">
                    <MapPinIcon className="w-4 h-4 mr-1" />
                    <span className="font-mono text-sm">{user.country}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <StarIcon className="w-4 h-4 mr-1" />
                  <span className="font-mono text-sm">
                    {user.rating ? user.rating.toFixed(1) : "New"}
                    {user.totalReviews > 0 && ` (${user.totalReviews})`}
                  </span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  <span className="font-mono text-sm">
                    {user.totalHoursTaught || 0}h taught
                  </span>
                </div>
              </div>
            </div>
            {user.isOnline && (
              <div className="flex items-center text-green-400">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                <span className="font-mono text-sm">Online</span>
              </div>
            )}
          </div>

          {/* Bio */}
          {user.bio && (
            <div className="mb-6">
              <h4 className="text-lg font-mono font-semibold text-dark-50 mb-3">
                About
              </h4>
              <p className="text-dark-300 font-mono leading-relaxed">
                {user.bio}
              </p>
            </div>
          )}

          {/* Skills Offered */}
          {user.skillsOffered?.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-mono font-semibold text-dark-50 mb-3">
                Skills Offered
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {user.skillsOffered.map((skill, index) => (
                  <div
                    key={index}
                    className="bg-dark-700 rounded-lg p-4 border border-dark-600"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-mono font-medium text-accent-400">
                        {skill.skill}
                      </h5>
                      <span className="px-2 py-1 bg-accent-500 bg-opacity-20 text-accent-400 rounded-md text-xs font-mono">
                        {skill.experience || "Intermediate"}
                      </span>
                    </div>
                    {skill.category && (
                      <p className="text-dark-400 font-mono text-xs mb-2">
                        {skill.category}
                      </p>
                    )}
                    {skill.description && (
                      <p className="text-dark-300 font-mono text-sm">
                        {skill.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {user.languages?.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-mono font-semibold text-dark-50 mb-3">
                Languages
              </h4>
              <div className="flex flex-wrap gap-2">
                {user.languages.map((language, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-dark-700 text-dark-200 rounded-full text-sm font-mono border border-dark-600"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-dark-600">
          <button
            onClick={onClose}
            className="px-4 py-2 text-dark-300 hover:text-dark-100 transition-colors font-mono text-sm"
          >
            Close
          </button>
          <button
            onClick={() => onMessage(user)}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-400 hover:to-accent-500 text-white rounded-lg transition-all font-mono text-sm"
          >
            <ChatBubbleLeftIcon className="w-4 h-4" />
            Send Message
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;

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
      className="bg-bg-secondary border border-border-primary rounded-xl p-6 hover:shadow-[var(--shadow-lg)] transition-all duration-300 cursor-pointer hover:border-border-accent group hover:-translate-y-1"
    >
      {/* Profile Section */}
      <div className="flex items-center mb-5">
        <div className="relative">
          {" "}
          <div className="w-14 h-14 rounded-full overflow-hidden bg-bg-tertiary flex items-center justify-center mr-4 ring-2 ring-border-secondary group-hover:ring-border-accent transition-all duration-300">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={getFullName(user.firstName, user.lastName)}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-semibold text-accent-primary">
                {getInitials(user.firstName, user.lastName)}
              </span>
            )}
          </div>
          {user.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-theme-success border-2 border-bg-primary rounded-full"></div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          {" "}
          <h3 className="font-semibold text-text-primary text-lg leading-tight mb-1">
            {getFullName(user.firstName, user.lastName)}
          </h3>
          {user.country && (
            <div className="flex items-center text-text-muted text-sm">
              <MapPinIcon className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{user.country}</span>
            </div>
          )}
        </div>
      </div>{" "}
      {/* Bio */}
      {user.bio && (
        <p className="text-text-secondary text-sm mb-5 line-clamp-2 leading-relaxed">
          {user.bio}
        </p>
      )}
      {/* Skills */}
      <div className="mb-5">
        <h4 className="text-text-primary font-medium text-sm mb-3">
          Skills Offered
        </h4>{" "}
        <div className="flex flex-wrap gap-2">
          {user.skillsOffered?.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1.5 bg-accent-light text-accent-primary rounded-full text-xs font-medium border border-border-accent group-hover:bg-accent-primary group-hover:text-text-inverse transition-all duration-300"
            >
              {skill.skill}
            </span>
          ))}
          {user.skillsOffered?.length > 3 && (
            <span className="inline-flex items-center px-3 py-1.5 bg-bg-tertiary text-text-secondary rounded-full text-xs font-medium group-hover:bg-bg-elevated transition-all duration-300">
              +{user.skillsOffered.length - 3} more
            </span>
          )}
        </div>
      </div>
      {/* Stats */}
      <div className="flex justify-between items-center pt-4 border-t border-border-secondary">
        <div className="flex items-center text-text-muted text-sm">
          <StarIcon className="w-4 h-4 mr-1.5 text-theme-warning fill-current" />
          <span className="font-medium text-text-primary">
            {user.rating ? user.rating.toFixed(1) : "New"}
          </span>
        </div>
        <div className="flex items-center text-text-muted text-sm">
          <ClockIcon className="w-4 h-4 mr-1.5" />
          <span className="font-medium text-text-primary">
            {user.totalHoursTaught || 0}h taught
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserCard;

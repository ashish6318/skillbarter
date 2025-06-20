import React, { useState } from "react";
import {
  XMarkIcon,
  MapPinIcon,
  StarIcon,
  ClockIcon,
  ChatBubbleLeftIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import ScheduleSession from "../Sessions/ScheduleSession";
import { themeClasses, componentPatterns, cn } from "../../utils/theme";

const UserDetailModal = ({ user, isOpen, onClose, onMessage }) => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState("");
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
    <div
      className={cn(
        "fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in",
        "bg-black/60"
      )}
    >
      <div
        className={cn(
          componentPatterns.modal,
          "w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in"
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "flex items-center justify-between p-6 border-b",
            themeClasses.borderSecondary,
            "bg-gradient-to-r from-bg-primary to-bg-secondary/50"
          )}
        >
          <h2
            className={cn(
              "text-2xl font-bold",
              "bg-gradient-to-r from-text-primary to-accent-primary bg-clip-text text-transparent"
            )}
          >
            User Profile
          </h2>
          <button
            onClick={onClose}
            className={cn(
              "p-2 rounded-xl transition-all duration-200 hover:scale-105",
              themeClasses.hover
            )}
          >
            <XMarkIcon
              className={cn(
                "w-6 h-6",
                themeClasses.textMuted,
                "hover:text-text-primary"
              )}
            />
          </button>
        </div>{" "}
        {/* Content */}
        <div className="p-6">
          {/* Profile Header */}
          <div className="flex items-center mb-8">
            <div className="relative mr-6">
              <div
                className={cn(
                  "w-20 h-20 rounded-full overflow-hidden flex items-center justify-center ring-4 shadow-lg",
                  themeClasses.bgTertiary,
                  "ring-border-secondary"
                )}
              >
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={getFullName(user.firstName, user.lastName)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span
                    className={cn(
                      "text-2xl font-bold",
                      "bg-gradient-to-br from-accent-primary to-accent-muted bg-clip-text text-transparent"
                    )}
                  >
                    {getInitials(user.firstName, user.lastName)}
                  </span>
                )}
              </div>
              {user.isOnline && (
                <div
                  className={cn(
                    "absolute -bottom-1 -right-1 w-6 h-6 border-4 rounded-full",
                    themeClasses.successBg,
                    "border-bg-primary"
                  )}
                ></div>
              )}
            </div>
            <div className="flex-1">
              <h3
                className={cn(
                  "text-2xl font-bold mb-2",
                  themeClasses.textPrimary
                )}
              >
                {getFullName(user.firstName, user.lastName)}
              </h3>
              {user.country && (
                <div
                  className={cn(
                    "flex items-center mb-3",
                    themeClasses.textSecondary
                  )}
                >
                  <MapPinIcon className="w-5 h-5 mr-2" />
                  <span className="text-lg">{user.country}</span>
                </div>
              )}
              <div className="flex items-center space-x-6 text-sm">
                <div
                  className={cn(
                    "flex items-center",
                    themeClasses.textSecondary
                  )}
                >
                  <StarIcon
                    className={cn(
                      "w-4 h-4 mr-1 fill-current",
                      "text-theme-warning"
                    )}
                  />
                  <span className="font-medium">
                    {user.rating ? user.rating.toFixed(1) : "New"}
                  </span>
                  {user.totalReviews > 0 && (
                    <span className={cn("ml-1", themeClasses.textMuted)}>
                      ({user.totalReviews} reviews)
                    </span>
                  )}
                </div>
                <div
                  className={cn(
                    "flex items-center",
                    themeClasses.textSecondary
                  )}
                >
                  <ClockIcon className="w-4 h-4 mr-1" />
                  <span className="font-medium">
                    {user.totalHoursTaught || 0}h taught
                  </span>
                </div>
              </div>
            </div>
          </div>
          About {/* Bio Section */}
          {user.bio && (
            <div className="mb-8">
              <h4
                className={cn(
                  "text-lg font-semibold mb-3",
                  themeClasses.textPrimary
                )}
              >
                About
              </h4>
              <p className={cn("leading-relaxed", themeClasses.textSecondary)}>
                {user.bio}
              </p>
            </div>
          )}{" "}
          {/* Skills Offered */}
          {user.skillsOffered?.length > 0 && (
            <div className="mb-8">
              <h4
                className={cn(
                  "text-lg font-semibold mb-4",
                  themeClasses.textPrimary
                )}
              >
                Skills Offered
              </h4>
              <div className="grid grid-cols-1 gap-4">
                {user.skillsOffered.map((skill, index) => (
                  <div
                    key={index}
                    className={cn(
                      "rounded-lg p-4 border",
                      themeClasses.bgSecondary,
                      themeClasses.borderPrimary
                    )}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h5
                        className={cn(
                          "font-semibold text-lg",
                          themeClasses.textPrimary
                        )}
                      >
                        {skill.skill}
                      </h5>
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "px-3 py-1 rounded-full text-sm font-medium",
                            componentPatterns.badgeAccent
                          )}
                        >
                          {skill.experience || "Intermediate"}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedSkill(skill.skill);
                            setShowScheduleModal(true);
                          }}
                          className={cn(
                            componentPatterns.buttonPrimary,
                            "text-sm transform hover:-translate-y-0.5"
                          )}
                        >
                          Book Session
                        </button>
                      </div>
                    </div>
                    {skill.category && (
                      <p
                        className={cn(
                          "text-sm mb-2",
                          themeClasses.textSecondary
                        )}
                      >
                        Category: {skill.category}
                      </p>
                    )}
                    {skill.description && (
                      <p
                        className={cn(
                          "text-sm leading-relaxed",
                          themeClasses.textSecondary
                        )}
                      >
                        {skill.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}{" "}
          {/* Languages */}
          {user.languages?.length > 0 && (
            <div className="mb-8">
              <h4
                className={cn(
                  "text-lg font-semibold mb-4",
                  themeClasses.textPrimary
                )}
              >
                Languages
              </h4>
              <div className="flex flex-wrap gap-2">
                {user.languages.map((language, index) => (
                  <span
                    key={index}
                    className={cn(
                      componentPatterns.pill,
                      "border",
                      themeClasses.borderPrimary
                    )}
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Footer */}
        <div
          className={cn(
            "flex justify-end gap-3 p-6 border-t",
            themeClasses.borderSecondary
          )}
        >
          <button
            onClick={onClose}
            className={cn(
              "px-6 py-2 font-medium transition-colors",
              themeClasses.textMuted,
              "hover:text-text-primary"
            )}
          >
            Close
          </button>
          <button
            onClick={() => onMessage(user)}
            className={cn(
              componentPatterns.buttonPrimary,
              "flex items-center gap-2 transform hover:-translate-y-0.5"
            )}
          >
            <ChatBubbleLeftIcon className="w-4 h-4" />
            Send Message
          </button>
        </div>
      </div>

      {/* Schedule Session Modal */}
      {showScheduleModal && (
        <ScheduleSession
          teacher={user}
          skill={selectedSkill}
          onClose={() => {
            setShowScheduleModal(false);
            setSelectedSkill("");
          }}
          onSuccess={() => {
            setShowScheduleModal(false);
            setSelectedSkill("");
            onClose(); // Close the user detail modal too
          }}
        />
      )}
    </div>
  );
};

export default UserDetailModal;

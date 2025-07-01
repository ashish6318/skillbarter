import React from "react";
import { ChatBubbleLeftIcon, ClockIcon } from "@heroicons/react/24/outline";
import { themeClasses, componentPatterns, cn } from "../../utils/theme";

const ConversationsList = ({
  conversations,
  selectedUserId,
  onSelectUser,
  loading,
  onlineUsers = new Set(),
}) => {
  const getInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };

  const getFullName = (firstName, lastName) => {
    return [firstName, lastName].filter(Boolean).join(" ") || "Anonymous";
  };

  const formatTime = (date) => {
    if (!date) return "";
    const now = new Date();
    const messageDate = new Date(date);
    const diffMs = now - messageDate;
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)}h ago`;
    } else {
      return messageDate.toLocaleDateString();
    }
  };
  if (loading) {
    return (
      <div
        className={cn(
          "w-80 border-r p-4",
          themeClasses.bgSecondary,
          themeClasses.borderSecondary
        )}
      >
        <h2
          className={cn(
            "text-lg font-mono font-semibold mb-4",
            themeClasses.textPrimary
          )}
        >
          Messages
        </h2>
        <div className="space-y-3">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className={cn(
                  "animate-pulse rounded-lg h-16",
                  themeClasses.bgTertiary
                )}
              ></div>
            ))}
        </div>
      </div>
    );
  }
  return (
    <div
      className={cn(
        "w-80 border-r flex flex-col",
        themeClasses.bgSecondary,
        themeClasses.borderSecondary
      )}
    >
      <div className={cn("p-4 border-b", themeClasses.borderSecondary)}>
        <h2
          className={cn(
            "text-lg font-mono font-semibold",
            themeClasses.textPrimary
          )}
        >
          Messages
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center">
            <ChatBubbleLeftIcon
              className={cn("w-12 h-12 mx-auto mb-3", themeClasses.textMuted)}
            />
            <p className={cn("font-mono text-sm", themeClasses.textMuted)}>
              No conversations yet
            </p>
            <p className={cn("font-mono text-xs mt-1", themeClasses.textMuted)}>
              Start a conversation from the Discover page
            </p>{" "}
          </div>
        ) : (
          <div className="p-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.otherUser._id}
                onClick={() => onSelectUser(conversation.otherUser)}
                className={cn(
                  "p-3 rounded-lg cursor-pointer transition-colors mb-2",
                  selectedUserId === conversation.otherUser._id
                    ? cn(
                        "border",
                        "bg-gray-100 dark:bg-gray-800",
                        "border-gray-300 dark:border-gray-600",
                        "shadow-sm"
                      )
                    : cn(themeClasses.hover)
                )}
              >
                <div className="flex items-center">
                  <div
                    className={cn(
                      "relative w-10 h-10 rounded-full overflow-hidden flex items-center justify-center mr-3",
                      themeClasses.bgTertiary
                    )}
                  >
                    {conversation.otherUser.profilePicture ? (
                      <img
                        src={conversation.otherUser.profilePicture}
                        alt={getFullName(
                          conversation.otherUser.firstName,
                          conversation.otherUser.lastName
                        )}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span
                        className={cn(
                          "text-sm font-bold",
                          themeClasses.textSecondary
                        )}
                      >
                        {getInitials(
                          conversation.otherUser.firstName,
                          conversation.otherUser.lastName
                        )}
                      </span>
                    )}
                    {/* Online status indicator */}
                    {onlineUsers.has(conversation.otherUser._id) && (
                      <div
                        className={cn(
                          "absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2",
                          themeClasses.bgPrimary
                        )}
                      ></div>
                    )}
                    {/* Unread messages indicator */}
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-bold rounded-full flex items-center justify-center">
                        {conversation.unreadCount > 9
                          ? "9+"
                          : conversation.unreadCount}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3
                        className={cn(
                          "font-medium text-sm truncate",
                          themeClasses.textPrimary
                        )}
                      >
                        {getFullName(
                          conversation.otherUser.firstName,
                          conversation.otherUser.lastName
                        )}
                      </h3>
                      <div
                        className={cn(
                          "flex items-center text-xs",
                          themeClasses.textMuted
                        )}
                      >
                        <ClockIcon className="w-3 h-3 mr-1" />
                        {formatTime(conversation.lastMessage?.createdAt)}
                      </div>
                    </div>
                    <p
                      className={cn(
                        "text-xs truncate mt-1",
                        themeClasses.textSecondary
                      )}
                    >
                      {conversation.lastMessage?.content || "No messages yet"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsList;

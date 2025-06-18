import React from "react";
import { ChatBubbleLeftIcon, ClockIcon } from "@heroicons/react/24/outline";

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
      <div className="w-80 bg-card border-r border-dark-600 p-4">
        <h2 className="text-lg font-mono font-semibold text-dark-50 mb-4">
          Messages
        </h2>
        <div className="space-y-3">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-dark-700 rounded-lg h-16"
              ></div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-card border-r border-dark-600 flex flex-col">
      <div className="p-4 border-b border-dark-600">
        <h2 className="text-lg font-mono font-semibold text-dark-50">
          Messages
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-4 text-center">
            <ChatBubbleLeftIcon className="w-12 h-12 text-dark-400 mx-auto mb-3" />
            <p className="text-dark-400 font-mono text-sm">
              No conversations yet
            </p>
            <p className="text-dark-500 font-mono text-xs mt-1">
              Start a conversation from the Discover page
            </p>
          </div>
        ) : (
          <div className="p-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.otherUser._id}
                onClick={() => onSelectUser(conversation.otherUser)}
                className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                  selectedUserId === conversation.otherUser._id
                    ? "bg-accent-500 bg-opacity-20 border border-accent-500"
                    : "hover:bg-dark-700"
                }`}
              >
                {" "}
                <div className="flex items-center">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-dark-700 flex items-center justify-center mr-3">
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
                      <span className="text-sm font-mono font-bold text-dark-300">
                        {getInitials(
                          conversation.otherUser.firstName,
                          conversation.otherUser.lastName
                        )}
                      </span>
                    )}
                    {/* Online status indicator */}
                    {onlineUsers.has(conversation.otherUser._id) && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-dark-900 rounded-full"></div>
                    )}
                    {/* Unread messages indicator */}
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {conversation.unreadCount > 9
                          ? "9+"
                          : conversation.unreadCount}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-mono font-medium text-dark-50 text-sm truncate">
                        {getFullName(
                          conversation.otherUser.firstName,
                          conversation.otherUser.lastName
                        )}
                      </h3>
                      <div className="flex items-center text-dark-400 text-xs">
                        <ClockIcon className="w-3 h-3 mr-1" />
                        {formatTime(conversation.lastMessage?.createdAt)}
                      </div>
                    </div>{" "}
                    <p className="text-dark-300 font-mono text-xs truncate mt-1">
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

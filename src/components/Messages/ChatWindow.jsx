import React, { useState, useEffect, useRef } from "react";
import {
  PaperAirplaneIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import {
  themeClasses,
  componentPatterns,
  cn,
  buttonVariants,
} from "../../utils/theme";

const ChatWindow = ({
  selectedUser,
  messages,
  onSendMessage,
  loading,
  onlineUsers,
}) => {
  const { user: currentUser } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      await onSendMessage(newMessage.trim());
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

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
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Debug online status
  useEffect(() => {
    if (selectedUser && onlineUsers) {
      console.log("🔍 Checking online status for user:", selectedUser._id);
      console.log("🔍 Online users set:", Array.from(onlineUsers));
      console.log("🔍 Is user online:", onlineUsers.has(selectedUser._id));
    }
  }, [selectedUser, onlineUsers]);
  if (!selectedUser) {
    return (
      <div
        className={cn(
          "flex-1 flex items-center justify-center",
          themeClasses.bgPrimary
        )}
      >
        <div className="text-center">
          <ChatBubbleLeftIcon
            className={cn("w-16 h-16 mx-auto mb-4", themeClasses.textMuted)}
          />
          <h3
            className={cn(
              "text-lg font-medium mb-2",
              themeClasses.textSecondary
            )}
          >
            Select a conversation
          </h3>
          <p className={cn("text-sm", themeClasses.textMuted)}>
            Choose a conversation from the sidebar to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex-1 flex flex-col", themeClasses.bgPrimary)}>
      {/* Chat Header */}
      <div
        className={cn(
          "border-b p-4",
          themeClasses.bgSecondary,
          themeClasses.borderSecondary
        )}
      >
        <div className="flex items-center">
          <div
            className={cn(
              "w-10 h-10 rounded-full overflow-hidden flex items-center justify-center mr-3",
              themeClasses.bgTertiary
            )}
          >
            {selectedUser.profilePicture ? (
              <img
                src={selectedUser.profilePicture}
                alt={getFullName(selectedUser.firstName, selectedUser.lastName)}
                className="w-full h-full object-cover"
              />
            ) : (
              <span
                className={cn("text-sm font-bold", themeClasses.textSecondary)}
              >
                {getInitials(selectedUser.firstName, selectedUser.lastName)}
              </span>
            )}
          </div>
          <div>
            <h3 className={cn("font-semibold", themeClasses.textPrimary)}>
              {getFullName(selectedUser.firstName, selectedUser.lastName)}
            </h3>
            <p className={cn("text-sm", themeClasses.textSecondary)}>
              {selectedUser.country && `${selectedUser.country} • `}
              {onlineUsers && onlineUsers.has(selectedUser._id)
                ? "Online"
                : "Offline"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div
                    className={cn(
                      "animate-pulse flex",
                      i % 2 === 0 ? "justify-start" : "justify-end"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-lg h-12 w-48",
                        themeClasses.bgTertiary
                      )}
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <p className={cn("text-sm", themeClasses.textMuted)}>
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isCurrentUser = message.sender._id === currentUser._id;
            return (
              <div
                key={
                  message._id ||
                  `temp-${index}-${message.content?.substring(0, 10)}`
                }
                className={`flex ${
                  isCurrentUser ? "justify-end" : "justify-start"
                }`}
              >
                {" "}
                <div
                  className={cn(
                    "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
                    isCurrentUser
                      ? cn(
                          "bg-black text-white",
                          "dark:bg-white dark:text-black",
                          "shadow-lg border border-gray-800 dark:border-gray-300"
                        )
                      : cn(
                          themeClasses.bgSecondary,
                          themeClasses.textPrimary,
                          "border border-gray-200 dark:border-gray-700"
                        )
                  )}
                >
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isCurrentUser ? "text-white dark:text-black" : ""
                    )}
                  >
                    {message.content}
                  </p>
                  <p
                    className={cn(
                      "text-xs mt-1",
                      isCurrentUser
                        ? "text-gray-300 dark:text-gray-600"
                        : themeClasses.textMuted
                    )}
                  >
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div
        className={cn(
          "border-t p-4",
          themeClasses.bgSecondary,
          themeClasses.borderSecondary
        )}
      >
        <form onSubmit={handleSubmit} className="flex gap-3">
          {" "}
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className={cn(componentPatterns.input, "flex-1")}
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className={cn(buttonVariants.primary, themeClasses.disabled)}
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;

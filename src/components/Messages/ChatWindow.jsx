import React, { useState, useEffect, useRef } from "react";
import {
  PaperAirplaneIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";

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
      <div className="flex-1 flex items-center justify-center bg-dark-900">
        <div className="text-center">
          <ChatBubbleLeftIcon className="w-16 h-16 text-dark-400 mx-auto mb-4" />
          <h3 className="text-lg font-mono font-medium text-dark-300 mb-2">
            Select a conversation
          </h3>
          <p className="text-dark-500 font-mono text-sm">
            Choose a conversation from the sidebar to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-dark-900">
      {/* Chat Header */}
      <div className="bg-card border-b border-dark-600 p-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-dark-700 flex items-center justify-center mr-3">
            {selectedUser.profilePicture ? (
              <img
                src={selectedUser.profilePicture}
                alt={getFullName(selectedUser.firstName, selectedUser.lastName)}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-mono font-bold text-dark-300">
                {getInitials(selectedUser.firstName, selectedUser.lastName)}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-mono font-semibold text-dark-50">
              {getFullName(selectedUser.firstName, selectedUser.lastName)}
            </h3>{" "}
            <p className="text-dark-400 font-mono text-sm">
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
                    className={`flex ${
                      i % 2 === 0 ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div className="bg-dark-700 rounded-lg h-12 w-48"></div>
                  </div>
                </div>
              ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-dark-400 font-mono text-sm">
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
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isCurrentUser
                      ? "bg-accent-500 text-white"
                      : "bg-dark-700 text-dark-100"
                  }`}
                >
                  <p className="font-mono text-sm">{message.content}</p>
                  <p
                    className={`font-mono text-xs mt-1 ${
                      isCurrentUser ? "text-accent-100" : "text-dark-400"
                    }`}
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
      <div className="bg-card border-t border-dark-600 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg font-mono text-sm text-dark-50 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="px-4 py-2 bg-accent-500 hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { messagesAPI } from "../utils/api";
import ConversationsList from "../components/Messages/ConversationsList";
import ChatWindow from "../components/Messages/ChatWindow";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import toast from "react-hot-toast";

const MessagesPage = () => {
  const location = useLocation();
  const navigationHandledRef = useRef(false);
  const selectedUserRef = useRef(null); // Track current selected user for cleanup
  const {
    socket,
    isConnected,
    onlineUsers,
    joinConversation,
    leaveConversation,
  } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [lastSelectedUserId, setLastSelectedUserId] = useState(null); // Track to prevent redundant operations
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false); // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      console.log("🔄 Fetching conversations...");
      const response = await messagesAPI.getConversations();
      console.log("📋 Full API response:", response);
      console.log("📋 Response data:", response.data);
      console.log(
        "📋 Response.data.conversations:",
        response.data.conversations
      );
      console.log("📋 Direct conversations:", response.data); // Check if conversations are directly in data or nested
      const conversations = response.data.conversations || response.data || [];
      console.log("📋 Setting conversations:", conversations);
      setConversations(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast.error("Failed to load conversations");
    } finally {
      setLoading(false);
    }
  }, []); // Fetch messages for a specific conversation
  const fetchMessages = useCallback(async (userId) => {
    // Validate userId before making API call
    if (!userId || userId === "undefined" || typeof userId !== "string") {
      console.error(
        "❌ Invalid userId passed to fetchMessages:",
        userId,
        typeof userId
      );
      toast.error("Invalid user selected");
      return;
    }

    try {
      setMessagesLoading(true);
      console.log("📥 Fetching messages for userId:", userId);
      const response = await messagesAPI.getChatMessages(userId);
      const fetchedMessages = response.data.conversation || [];

      console.log("📥 Fetched messages:", fetchedMessages.length);

      // Sort messages by creation time and ensure no duplicates
      const uniqueMessages = fetchedMessages
        .filter(
          (message, index, array) =>
            index === array.findIndex((m) => m._id === message._id)
        )
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      console.log(
        "✅ Unique messages after deduplication:",
        uniqueMessages.length
      );

      setMessages(uniqueMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setMessagesLoading(false);
    }
  }, []); // Handle user selection
  const handleSelectUser = useCallback(
    (otherUser) => {
      // Defensive check: ensure otherUser and _id exist
      if (!otherUser || !otherUser._id) {
        console.error(
          "❌ Invalid user object passed to handleSelectUser:",
          otherUser
        );
        return;
      }

      // Prevent redundant selections (more robust check)
      if (lastSelectedUserId === otherUser._id) {
        console.log("🔄 Same user already selected, skipping");
        return;
      }

      console.log("👤 Selecting user:", otherUser._id, otherUser); // Leave previous conversation room (use functional update to avoid dependency on selectedUser)
      setSelectedUser((prevSelectedUser) => {
        if (prevSelectedUser && prevSelectedUser._id !== otherUser._id) {
          console.log(
            "🚪 Leaving previous conversation:",
            prevSelectedUser._id
          );
          leaveConversation(prevSelectedUser._id);
        }
        selectedUserRef.current = otherUser; // Update ref for cleanup
        return otherUser; // Set new selected user
      });

      // Update tracking state
      setLastSelectedUserId(otherUser._id);

      // Clear previous messages first
      setMessages([]);

      // Fetch messages for this conversation
      fetchMessages(otherUser._id);

      // Join conversation if connected
      if (isConnected) {
        console.log("🔗 Socket is connected, joining conversation");
        joinConversation(otherUser._id);
      } else {
        console.log("⏳ Socket not connected, will join when connected");
      } // Mark messages as read (only if userId is valid)
      if (otherUser._id && otherUser._id !== "undefined") {
        messagesAPI.markAsRead(otherUser._id).catch(console.error);
      }
    },
    [
      lastSelectedUserId,
      joinConversation,
      leaveConversation,
      fetchMessages,
      isConnected,
    ]
  );

  // Send message
  const handleSendMessage = useCallback(
    async (content) => {
      if (!selectedUser || !content.trim()) return;

      try {
        const messageData = {
          receiver: selectedUser._id,
          content: content.trim(),
          messageType: "text",
        };
        const response = await messagesAPI.sendMessage(messageData);

        // Add message to current conversation (check for duplicates)
        setMessages((prev) => {
          const messageExists = prev.some(
            (existingMessage) =>
              existingMessage._id === response.data.message._id
          );
          if (messageExists) {
            console.log("⚠️ Sent message already exists, skipping duplicate");
            return prev;
          }
          return [...prev, response.data.message];
        }); // Update conversations list will happen via socket events
        // Removing direct call to prevent loops
      } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Failed to send message");
        throw error;
      }
    },
    [selectedUser] // Removed fetchConversations to prevent loops
  );

  // Socket event listeners
  useEffect(() => {
    if (!socket) {
      console.log("⚠️ No socket connection for message events");
      return;
    }

    console.log("📡 Setting up socket message listeners");
    const handleNewMessage = (message) => {
      console.log("📨 Received new message:", message);

      // Add to messages if it's part of current conversation
      if (
        selectedUser &&
        (message.sender._id === selectedUser._id ||
          message.receiver._id === selectedUser._id)
      ) {
        console.log("✅ Adding message to current conversation");
        setMessages((prev) => {
          // Check if message already exists to prevent duplicates
          const messageExists = prev.some(
            (existingMessage) => existingMessage._id === message._id
          );
          if (messageExists) {
            console.log("⚠️ Message already exists, skipping duplicate");
            console.log("📊 Current messages count:", prev.length);
            return prev;
          }

          const newMessages = [...prev, message];
          console.log("📊 Added message, new count:", newMessages.length);
          return newMessages;
        });
      } else {
        console.log("ℹ️ Message not for current conversation");
      }

      // Note: fetchConversations is already called in initial load and send message
      // Removing it here to prevent infinite loops
    };

    const handleMessageReceived = (message) => {
      console.log("📨 Message received event:", message);
      handleNewMessage(message);
    };

    socket.on("message:received", handleMessageReceived);
    socket.on("newMessage", handleMessageReceived);
    return () => {
      console.log("🧹 Cleaning up socket message listeners");
      socket.off("message:received", handleMessageReceived);
      socket.off("newMessage", handleMessageReceived);
    };
  }, [socket, selectedUser]); // Removed fetchConversations to prevent infinite loops
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Handle navigation state  // Handle navigation from other pages
  useEffect(() => {
    if (location.state?.selectedUser && !navigationHandledRef.current) {
      const userFromNavigation = location.state.selectedUser;
      console.log(
        "🧭 Navigation: selecting user from state",
        userFromNavigation._id
      );

      navigationHandledRef.current = true;
      // Delay to ensure component is ready
      setTimeout(() => {
        handleSelectUser(userFromNavigation);
      }, 100);
    }
  }, [location.state, handleSelectUser]);

  // Reset navigation flag when location changes
  useEffect(() => {
    navigationHandledRef.current = false;
  }, [location.pathname, location.key]); // Cleanup on unmount (only run once)
  useEffect(() => {
    return () => {
      // Use ref to get current selected user for cleanup
      if (selectedUserRef.current) {
        leaveConversation(selectedUserRef.current._id);
      }
      setLastSelectedUserId(null); // Reset tracking state
    };
  }, [leaveConversation]); // Only depend on leaveConversation

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-dark-900 flex">
      {" "}
      {/* Conversations List */}
      <ConversationsList
        conversations={conversations}
        selectedUserId={selectedUser?._id}
        onSelectUser={handleSelectUser}
        loading={loading}
        onlineUsers={onlineUsers}
      />{" "}
      {/* Chat Window */}
      <ChatWindow
        selectedUser={selectedUser}
        messages={messages}
        onSendMessage={handleSendMessage}
        loading={messagesLoading}
        onlineUsers={onlineUsers}
      />
      {/* Connection Status */}
      {!isConnected && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg font-mono text-sm">
          Disconnected - Trying to reconnect...
        </div>
      )}
    </div>
  );
};

export default MessagesPage;

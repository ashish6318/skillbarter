import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [currentConversation, setCurrentConversation] = useState(null); // Track current conversation
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found for socket connection");
        return;
      } // Initialize socket connection - must connect to server root, not /api
      const socketURL = "http://localhost:5000";
      console.log("🔗 Connecting to socket at:", socketURL);
      console.log("🔑 Using token:", token ? "Token available" : "No token");

      const newSocket = io(socketURL, {
        auth: {
          token: token,
        },
        transports: ["websocket", "polling"],
        timeout: 20000,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        forceNew: true,
      }); // Connection events
      newSocket.on("connect", () => {
        console.log("✅ Socket connected successfully");
        console.log("🆔 Socket ID:", newSocket.id);
        setIsConnected(true);
      });
      newSocket.on("disconnect", (reason) => {
        console.log("❌ Socket disconnected:", reason);
        setIsConnected(false);
        setCurrentConversation(null); // Reset conversation tracking
      });

      newSocket.on("connect_error", (error) => {
        console.error("🔴 Socket connection error:", error.message);
        console.error("🔴 Full error:", error);
        setIsConnected(false);
      });

      newSocket.on("reconnect", (attemptNumber) => {
        console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
        setIsConnected(true);
      });

      newSocket.on("reconnect_attempt", (attemptNumber) => {
        console.log("🔄 Socket reconnection attempt", attemptNumber);
      });

      newSocket.on("reconnect_error", (error) => {
        console.error("🔴 Socket reconnection error:", error);
      });

      newSocket.on("reconnect_failed", () => {
        console.error("🔴 Socket reconnection failed");
        setIsConnected(false);
      }); // User status events (matching server implementation)
      newSocket.on("users:online", (userIds) => {
        console.log("👥 Initial online users:", userIds);
        setOnlineUsers(new Set(userIds));
      });

      newSocket.on("user:online", ({ userId }) => {
        console.log("👤 User came online:", userId);
        setOnlineUsers((prev) => new Set([...prev, userId]));
      });
      newSocket.on("user:offline", ({ userId }) => {
        console.log("👤 User went offline:", userId);
        setOnlineUsers((prev) => {
          const updated = new Set(prev);
          updated.delete(userId);
          return updated;
        });
      }); // Session reminder events
      newSocket.on("session:reminder", (reminderData) => {
        console.log("⏰ Session reminder received:", reminderData);
        // Call global reminder handler if available
        if (window.addSessionReminder) {
          window.addSessionReminder(reminderData);
        }
      });

      // Session notification events
      newSocket.on("sessionRequest", (requestData) => {
        console.log("📋 Session request received:", requestData);
        if (window.addSessionNotification) {
          window.addSessionNotification({
            type: "session_request",
            sessionId: requestData.sessionId,
            student: requestData.student,
            skill: requestData.skill,
            scheduledFor: requestData.scheduledFor,
            duration: requestData.duration,
            message: requestData.message,
          });
        }
      });
      newSocket.on("sessionStatusUpdate", (statusData) => {
        console.log("📊 Session status update received:", statusData);
        if (window.addSessionNotification) {
          let notificationType = "session_update";

          switch (statusData.status) {
            case "confirmed":
              notificationType = "session_confirmed";
              break;
            case "cancelled":
              notificationType = "session_cancelled";
              break;
            case "rejected":
              notificationType = "session_cancelled";
              break;
          }

          window.addSessionNotification({
            type: notificationType,
            sessionId: statusData.sessionId,
            skill: statusData.skill,
            scheduledFor: statusData.scheduledFor,
            reason: statusData.reason,
          });
        }
      });

      // Specific notification for session acceptance
      newSocket.on("sessionAccepted", (acceptData) => {
        console.log("✅ Session accepted notification:", acceptData);
        if (window.addSessionNotification) {
          window.addSessionNotification({
            type: "session_accepted",
            sessionId: acceptData.sessionId,
            skill: acceptData.skill,
            teacherName: acceptData.teacherName,
            scheduledFor: acceptData.scheduledFor,
            duration: acceptData.duration,
            creditsDeducted: acceptData.creditsDeducted,
          });
        }
      });

      newSocket.on("creditDeduction", (creditData) => {
        console.log("💳 Credit deduction notification:", creditData);
        if (window.addSessionNotification) {
          window.addSessionNotification({
            type: "credit_deduction",
            sessionId: creditData.sessionId,
            skill: creditData.skill,
            creditsDeducted: creditData.creditsDeducted,
            remainingCredits: creditData.remainingCredits,
            scheduledFor: creditData.scheduledFor,
          });
        }
      });

      newSocket.on("sessionJoinReady", (joinData) => {
        console.log("🎥 Session join ready notification:", joinData);
        if (window.addSessionNotification) {
          window.addSessionNotification({
            type: "session_join_ready",
            sessionId: joinData.sessionId,
            skill: joinData.skill,
            scheduledFor: joinData.scheduledFor,
            duration: joinData.duration,
          });
        }
      });

      setSocket(newSocket);

      // Cleanup function
      return () => {
        console.log("Cleaning up socket connection");
        newSocket.close();
        setSocket(null);
        setIsConnected(false);
        setOnlineUsers(new Set());
      };
    } else {
      // Clean up socket when not authenticated
      if (socket) {
        console.log("Cleaning up socket - user not authenticated");
        socket.close();
        setSocket(null);
        setIsConnected(false);
        setOnlineUsers(new Set());
      }
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup socket on component unmount
  useEffect(() => {
    return () => {
      if (socket) {
        console.log("Component unmounting - cleaning up socket");
        socket.close();
      }
    };
  }, [socket]); // Socket event handlers (matching server implementation)
  const joinConversation = (otherUserId) => {
    if (socket && isConnected) {
      // Prevent joining the same conversation twice
      if (currentConversation === otherUserId) {
        console.log("� Already in conversation with user:", otherUserId);
        return;
      }

      console.log("�📩 Joining conversation with user:", otherUserId);
      socket.emit("join:conversation", otherUserId);
      setCurrentConversation(otherUserId);
    } else {
      console.warn("⚠️ Cannot join conversation - socket not connected");
    }
  };

  const leaveConversation = (otherUserId) => {
    if (socket && isConnected) {
      console.log("🚪 Leaving conversation with user:", otherUserId);
      socket.emit("leave:conversation", otherUserId);
      setCurrentConversation(null);
    } else {
      console.warn("⚠️ Cannot leave conversation - socket not connected");
    }
  };

  const sendSocketMessage = (receiverId, content, messageType = "text") => {
    if (socket && isConnected) {
      socket.emit("message:send", {
        receiverId,
        content,
        messageType,
      });
    }
  };

  const startTyping = (receiverId) => {
    if (socket && isConnected) {
      socket.emit("typing:start", receiverId);
    }
  };

  const stopTyping = (receiverId) => {
    if (socket && isConnected) {
      socket.emit("typing:stop", receiverId);
    }
  };
  // Debug online users changes
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log("👥 Online users updated:", Array.from(onlineUsers));
    }
  }, [onlineUsers]);

  const value = {
    socket,
    isConnected,
    onlineUsers,
    joinConversation,
    leaveConversation,
    sendSocketMessage,
    startTyping,
    stopTyping,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

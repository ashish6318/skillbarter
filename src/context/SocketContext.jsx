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
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Initialize socket connection
      const socketURL =
        import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

      const newSocket = io(socketURL, {
        auth: {
          token: localStorage.getItem("token"),
        },
      });

      // Connection events
      newSocket.on("connect", () => {
        console.log("Connected to server");
        setIsConnected(true);
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnected from server");
        setIsConnected(false);
      });

      // User status events
      newSocket.on("user_connected", (userData) => {
        setOnlineUsers((prev) => [
          ...prev.filter((u) => u.id !== userData.id),
          userData,
        ]);
      });

      newSocket.on("user_disconnected", (userId) => {
        setOnlineUsers((prev) => prev.filter((u) => u.id !== userId));
      });

      newSocket.on("online_users", (users) => {
        setOnlineUsers(users);
      });

      // Error handling
      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setIsConnected(false);
      });

      setSocket(newSocket);

      // Cleanup function
      return () => {
        console.log("Cleaning up socket connection");
        newSocket.close();
        setSocket(null);
        setIsConnected(false);
        setOnlineUsers([]);
      };
    } else {
      // Clean up socket when not authenticated
      if (socket) {
        console.log("Cleaning up socket - user not authenticated");
        socket.close();
        setSocket(null);
        setIsConnected(false);
        setOnlineUsers([]);
      }
    }
  }, [isAuthenticated, user]); // eslint-disable-line react-hooks/exhaustive-deps
  // Note: 'socket' intentionally excluded from dependencies to prevent infinite loop

  // Cleanup socket on component unmount
  useEffect(() => {
    return () => {
      if (socket) {
        console.log("Component unmounting - cleaning up socket");
        socket.close();
      }
    };
  }, [socket]);

  // Socket event handlers
  const joinRoom = (roomId) => {
    if (socket) {
      socket.emit("join_room", roomId);
    }
  };

  const leaveRoom = (roomId) => {
    if (socket) {
      socket.emit("leave_room", roomId);
    }
  };

  const sendMessage = (messageData) => {
    if (socket) {
      socket.emit("send_message", messageData);
    }
  };

  const markMessageAsRead = (messageId) => {
    if (socket) {
      socket.emit("mark_message_read", messageId);
    }
  };

  const updateTypingStatus = (conversationId, isTyping) => {
    if (socket) {
      socket.emit("typing", { conversationId, isTyping });
    }
  };

  const updateSessionStatus = (sessionId, status) => {
    if (socket) {
      socket.emit("session_status_update", { sessionId, status });
    }
  };

  const value = {
    socket,
    isConnected,
    onlineUsers,
    joinRoom,
    leaveRoom,
    sendMessage,
    markMessageAsRead,
    updateTypingStatus,
    updateSessionStatus,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

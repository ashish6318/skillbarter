import React, { useState, useEffect, useCallback } from "react";
import { sessionsAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import SessionsList from "../components/Sessions/SessionsList";
import SessionCard from "../components/Sessions/SessionCard";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import {
  themeClasses,
  componentPatterns,
  cn,
  statusClasses,
} from "../utils/theme";

const SessionsPage = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, pending, confirmed, in_progress, completed
  const [role, setRole] = useState("all"); // all, teacher, student

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter !== "all") params.status = filter;
      if (role !== "all") params.role = role;

      const response = await sessionsAPI.getSessions(params);
      setSessions(response.data.sessions || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setError("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  }, [filter, role]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleSessionRequest = useCallback(() => {
    // Add new session request to the list
    fetchSessions();
  }, [fetchSessions]);

  const handleSessionUpdate = useCallback((data) => {
    // Update session in the list
    setSessions((prev) =>
      prev.map((session) =>
        session._id === data.sessionId
          ? { ...session, status: data.status || session.status }
          : session
      )
    );
  }, []);

  useEffect(() => {
    if (socket) {
      // Listen for real-time session updates
      socket.on("session:request", handleSessionRequest);
      socket.on("session:accepted", handleSessionUpdate);
      socket.on("session:started", handleSessionUpdate);
      socket.on("session:ended", handleSessionUpdate);
      socket.on("sessionStatusUpdate", handleSessionUpdate);

      return () => {
        socket.off("session:request");
        socket.off("session:accepted");
        socket.off("session:started");
        socket.off("session:ended");
        socket.off("sessionStatusUpdate");
      };
    }
  }, [socket, handleSessionRequest, handleSessionUpdate]);

  const handleSessionAction = async (sessionId, action, data = {}) => {
    try {
      let response;
      switch (action) {
        case "accept":
          response = await sessionsAPI.updateSession(sessionId, {
            status: "confirmed",
          });
          break;
        case "reject":
          response = await sessionsAPI.updateSession(sessionId, {
            status: "cancelled",
            reason: data.reason,
          });
          break;
        case "cancel":
          response = await sessionsAPI.cancelSession(sessionId);
          break;
        case "start":
          response = await sessionsAPI.startSession(sessionId);
          break;
        case "end":
          response = await sessionsAPI.endSession(sessionId, data);
          break;
        case "review":
          response = await sessionsAPI.submitReview(sessionId, data);
          break;
        case "reschedule":
          response = await sessionsAPI.rescheduleSession(sessionId, data);
          break;
        default:
          return;
      }

      // Update the session in the list
      setSessions((prev) =>
        prev.map((session) =>
          session._id === sessionId
            ? { ...session, ...response.data.session }
            : session
        )
      );
    } catch (err) {
      console.error(`Error performing ${action} on session:`, err);
      setError(`Failed to ${action} session`);
    }
  };

  const filteredSessions = sessions.filter((session) => {
    if (filter === "all") return true;
    return session.status === filter;
  });

  const getSessionCounts = () => {
    const counts = {
      all: sessions.length,
      pending: sessions.filter((s) => s.status === "pending").length,
      confirmed: sessions.filter((s) => s.status === "confirmed").length,
      in_progress: sessions.filter((s) => s.status === "in_progress").length,
      completed: sessions.filter((s) => s.status === "completed").length,
    };
    return counts;
  };

  const counts = getSessionCounts();
  if (loading) {
    return (
      <div
        className={cn(
          "min-h-screen flex items-center justify-center",
          themeClasses.bgPrimary
        )}
      >
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen", themeClasses.bgPrimary)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={cn("text-3xl font-bold", themeClasses.textPrimary)}>
            My Sessions
          </h1>
          <p className={cn("text-lg mt-2", themeClasses.textSecondary)}>
            Manage your learning and teaching sessions
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className={cn("mb-6 rounded-lg p-4", statusClasses.errorLight)}>
            <p className={themeClasses.error}>{error}</p>
          </div>
        )}

        {/* Filters */}
        <div
          className={cn("mb-6 rounded-lg shadow p-6", componentPatterns.card)}
        >
          <div className="flex flex-wrap gap-4">
            {" "}
            {/* Status Filter */}
            <div>
              <label
                className={cn(
                  "block text-sm font-medium mb-2",
                  themeClasses.textPrimary
                )}
              >
                Status
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={cn(componentPatterns.input)}
              >
                <option value="all">All ({counts.all})</option>
                <option value="pending">Pending ({counts.pending})</option>
                <option value="confirmed">
                  Confirmed ({counts.confirmed})
                </option>
                <option value="in_progress">
                  In Progress ({counts.in_progress})
                </option>
                <option value="completed">
                  Completed ({counts.completed})
                </option>
              </select>
            </div>{" "}
            {/* Role Filter */}
            <div>
              <label
                className={cn(
                  "block text-sm font-medium mb-2",
                  themeClasses.textPrimary
                )}
              >
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={cn(componentPatterns.input)}
              >
                <option value="all">All</option>
                <option value="teacher">As Teacher</option>
                <option value="student">As Student</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        {filteredSessions.length === 0 ? (
          <div
            className={cn(
              "rounded-lg shadow p-8 text-center",
              componentPatterns.card
            )}
          >
            <p className={cn("text-lg", themeClasses.textMuted)}>
              {filter === "all"
                ? "No sessions found. Start by booking a session with someone!"
                : `No ${filter} sessions found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSessions.map((session) => (
              <SessionCard
                key={session._id}
                session={session}
                currentUser={user}
                onAction={handleSessionAction}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionsPage;

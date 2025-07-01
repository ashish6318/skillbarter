import React, { useState, useEffect, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { sessionsAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import SessionsList from "../components/Sessions/SessionsList";
import SessionCard from "../components/Sessions/SessionCard";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import {
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import {
  themeClasses,
  componentPatterns,
  cn,
  statusClasses,
} from "../utils/theme";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
  hover: {
    y: -4,
    scale: 1.01,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

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
      <motion.div
        className={cn(
          "min-h-screen flex items-center justify-center",
          themeClasses.bgPrimary
        )}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <LoadingSpinner />
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cn("min-h-screen", themeClasses.bgPrimary)}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Modern Hero Header */}
      <motion.div
        className={cn(
          "backdrop-blur-sm border-b",
          themeClasses.bgPrimary,
          themeClasses.borderSecondary
        )}
        variants={itemVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <motion.h1
              className={cn(
                "text-5xl font-bold mb-6 font-['Poppins',_sans-serif] leading-tight",
                "text-transparent bg-clip-text bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 dark:from-gray-300 dark:via-gray-200 dark:to-gray-100"
              )}
              variants={itemVariants}
            >
              My Sessions
            </motion.h1>
            <motion.p
              className={cn(
                "text-xl max-w-3xl mx-auto leading-relaxed",
                themeClasses.textSecondary
              )}
              variants={itemVariants}
            >
              Manage your learning and teaching sessions with{" "}
              <span className={cn("font-medium", themeClasses.textPrimary)}>
                complete control and flexibility
              </span>
            </motion.p>
          </div>

          {/* Stats Overview */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
            variants={containerVariants}
          >
            {[
              {
                label: "Total Sessions",
                value: counts.all,
                icon: CalendarDaysIcon,
                gradient: "from-gray-600 to-gray-700",
              },
              {
                label: "Pending",
                value: counts.pending,
                icon: ClockIcon,
                gradient: "from-gray-500 to-gray-600",
              },
              {
                label: "Confirmed",
                value: counts.confirmed,
                icon: UserGroupIcon,
                gradient: "from-gray-700 to-gray-800",
              },
              {
                label: "Completed",
                value: counts.completed,
                icon: CheckCircleIcon,
                gradient: "from-gray-400 to-gray-500",
              },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  className={cn(
                    "relative p-4 rounded-xl border transition-all duration-300 group cursor-pointer",
                    themeClasses.bgSecondary,
                    "border-gray-200/50 dark:border-gray-700/50",
                    "hover:border-gray-300 dark:hover:border-gray-600",
                    "hover:shadow-lg hover:shadow-gray-500/10"
                  )}
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={cn("text-sm", themeClasses.textSecondary)}>
                        {stat.label}
                      </p>
                      <p
                        className={cn(
                          "text-2xl font-bold",
                          themeClasses.textPrimary
                        )}
                      >
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg bg-gradient-to-r flex items-center justify-center",
                        stat.gradient
                      )}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <motion.div
            className={cn("mb-6 rounded-lg p-4", statusClasses.errorLight)}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <p className={themeClasses.error}>{error}</p>
          </motion.div>
        )}

        {/* Modern Filters */}
        <motion.div
          className={cn(
            "mb-8 rounded-2xl shadow-sm p-6",
            componentPatterns.card
          )}
          variants={itemVariants}
        >
          <h3
            className={cn(
              "text-lg font-semibold mb-4",
              themeClasses.textPrimary
            )}
          >
            Filter Sessions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Filter */}
            <div>
              <label
                className={cn(
                  "block text-sm font-medium mb-3",
                  themeClasses.textPrimary
                )}
              >
                Status
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className={cn(
                  componentPatterns.input,
                  "w-full px-4 py-3 rounded-xl border-gray-200 dark:border-gray-700"
                )}
              >
                <option value="all">All Sessions ({counts.all})</option>
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
            </div>

            {/* Role Filter */}
            <div>
              <label
                className={cn(
                  "block text-sm font-medium mb-3",
                  themeClasses.textPrimary
                )}
              >
                Your Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={cn(
                  componentPatterns.input,
                  "w-full px-4 py-3 rounded-xl border-gray-200 dark:border-gray-700"
                )}
              >
                <option value="all">All Roles</option>
                <option value="teacher">As Teacher</option>
                <option value="student">As Student</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Sessions List */}
        {filteredSessions.length === 0 ? (
          <motion.div
            className={cn(
              "rounded-2xl shadow-sm p-12 text-center",
              componentPatterns.card
            )}
            variants={itemVariants}
          >
            <div
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4",
                "bg-gray-100 dark:bg-gray-800"
              )}
            >
              <CalendarDaysIcon
                className={cn("w-8 h-8", themeClasses.textMuted)}
              />
            </div>
            <h3
              className={cn(
                "text-xl font-semibold mb-2",
                themeClasses.textPrimary
              )}
            >
              No Sessions Found
            </h3>
            <p className={cn("text-lg", themeClasses.textMuted)}>
              {filter === "all"
                ? "Start by booking a session with someone!"
                : `No ${filter} sessions found.`}
            </p>
          </motion.div>
        ) : (
          <motion.div className="space-y-4" variants={containerVariants}>
            {filteredSessions.map((session, index) => (
              <motion.div
                key={session._id}
                variants={cardVariants}
                custom={index}
              >
                <SessionCard
                  session={session}
                  currentUser={user}
                  onAction={handleSessionAction}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SessionsPage;

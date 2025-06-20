import React, { useState, useEffect, useCallback } from "react";
import {
  XMarkIcon,
  CreditCardIcon,
  UserGroupIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { sessionsAPI } from "../../utils/api";
import {
  themeClasses,
  componentPatterns,
  cn,
  buttonVariants,
} from "../../utils/theme";

const SessionNotification = ({
  notification,
  onDismiss,
  onAccept,
  onReject,
}) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (notification.type === "session_request" && notification.scheduledFor) {
      const updateTimeLeft = () => {
        const now = new Date();
        const sessionTime = new Date(notification.scheduledFor);
        const diff = sessionTime.getTime() - now.getTime();

        if (diff <= 0) {
          setTimeLeft("Session time has passed");
          return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m`);
        } else {
          setTimeLeft(`${minutes}m`);
        }
      };

      updateTimeLeft();
      const interval = setInterval(updateTimeLeft, 60000);
      return () => clearInterval(interval);
    }
  }, [notification.scheduledFor, notification.type]);
  const getNotificationIcon = () => {
    switch (notification.type) {
      case "session_request":
        return <UserGroupIcon className="w-5 h-5 text-blue-500" />;
      case "session_accepted":
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case "credit_deduction":
        return <CreditCardIcon className="w-5 h-5 text-red-500" />;
      case "session_join_ready":
        return <VideoCameraIcon className="w-5 h-5 text-green-500" />;
      case "session_confirmed":
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case "session_cancelled":
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      default:
        return <UserGroupIcon className="w-5 h-5 text-gray-500" />;
    }
  };
  const getNotificationColor = () => {
    switch (notification.type) {
      case "session_request":
        return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20";
      case "session_accepted":
        return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20";
      case "credit_deduction":
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20";
      case "session_join_ready":
        return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20";
      case "session_confirmed":
        return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20";
      case "session_cancelled":
        return "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20";
      default:
        return cn(themeClasses.borderSecondary, themeClasses.bgTertiary);
    }
  };
  const getNotificationTitle = () => {
    switch (notification.type) {
      case "session_request":
        return "New Session Request";
      case "session_accepted":
        return "Session Accepted!";
      case "credit_deduction":
        return "Credits Deducted";
      case "session_join_ready":
        return "Session Ready to Join";
      case "session_confirmed":
        return "Session Confirmed";
      case "session_cancelled":
        return "Session Cancelled";
      default:
        return "Session Update";
    }
  };
  const getNotificationMessage = () => {
    switch (notification.type) {
      case "session_request":
        return `${notification.student?.name} wants to learn ${notification.skill}`;
      case "session_accepted":
        return `${notification.teacherName} accepted your ${notification.skill} session! ${notification.creditsDeducted} credits deducted.`;
      case "credit_deduction":
        return `${notification.creditsDeducted} credits deducted for ${notification.skill} session`;
      case "session_join_ready":
        return `Your ${notification.skill} session starts in 15 minutes. Ready to join!`;
      case "session_confirmed":
        return `Your ${notification.skill} session has been confirmed`;
      case "session_cancelled":
        return `Your ${notification.skill} session has been cancelled`;
      default:
        return notification.message || "Session update";
    }
  };

  const handleAcceptSession = () => {
    if (onAccept) {
      onAccept(notification.sessionId);
    }
    onDismiss();
  };

  const handleRejectSession = () => {
    if (onReject) {
      onReject(notification.sessionId);
    }
    onDismiss();
  };

  const handleJoinSession = () => {
    // Navigate to session room
    window.location.href = `/session/${notification.sessionId}/room`;
    onDismiss();
  };
  return (
    <div
      className={cn(
        "fixed top-4 right-4 max-w-sm w-full border rounded-lg shadow-lg p-4 z-50",
        getNotificationColor()
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {getNotificationIcon()}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4
                className={cn(
                  "text-sm font-semibold",
                  themeClasses.textPrimary
                )}
              >
                {getNotificationTitle()}
              </h4>
              <button
                onClick={onDismiss}
                className={cn(
                  "transition-colors",
                  themeClasses.textMuted,
                  themeClasses.hover
                )}
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>

            <p className={cn("text-sm mt-1", themeClasses.textSecondary)}>
              {getNotificationMessage()}
            </p>

            {/* Additional details based on notification type */}
            {notification.type === "session_request" && (
              <div className="mt-2 space-y-1 text-xs text-gray-600">
                <div>
                  Duration: {Math.floor(notification.duration / 60)} hours
                </div>
                <div>
                  Scheduled:{" "}
                  {format(new Date(notification.scheduledFor), "MMM d, h:mm a")}
                </div>
                {timeLeft && <div>Time until session: {timeLeft}</div>}
                {notification.message && (
                  <div className="mt-1 p-2 bg-gray-100 rounded text-xs">
                    Message: "{notification.message}"
                  </div>
                )}
              </div>
            )}

            {notification.type === "credit_deduction" && (
              <div className="mt-2 text-xs text-gray-600">
                <div>Remaining credits: {notification.remainingCredits}</div>
                <div>
                  Session:{" "}
                  {format(new Date(notification.scheduledFor), "MMM d, h:mm a")}
                </div>
              </div>
            )}

            {notification.type === "session_join_ready" && (
              <div className="mt-2 text-xs text-gray-600">
                <div>
                  Session time:{" "}
                  {format(new Date(notification.scheduledFor), "MMM d, h:mm a")}
                </div>
                <div>
                  Duration: {Math.floor(notification.duration / 60)} hours
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex space-x-2 mt-3">
              {notification.type === "session_request" && (
                <>
                  <button
                    onClick={handleAcceptSession}
                    className="flex-1 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={handleRejectSession}
                    className="flex-1 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                </>
              )}

              {notification.type === "session_join_ready" && (
                <button
                  onClick={handleJoinSession}
                  className="flex-1 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                >
                  Join Session
                </button>
              )}

              {notification.type !== "session_request" &&
                notification.type !== "session_join_ready" && (
                  <button
                    onClick={onDismiss}
                    className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 transition-colors"
                  >
                    Dismiss
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SessionNotificationManager = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const notificationWithId = { ...notification, id: Date.now() };
    setNotifications((prev) => [...prev, notificationWithId]); // Show toast notification as backup
    switch (notification.type) {
      case "session_request":
        toast.success(`New session request for ${notification.skill}!`);
        break;
      case "session_accepted":
        toast.success(
          `Session accepted! ${notification.creditsDeducted} credits deducted for ${notification.skill}`
        );
        break;
      case "credit_deduction":
        toast.success(
          `${notification.creditsDeducted} credits deducted for session booking`
        );
        break;
      case "session_join_ready":
        toast.success(`Session starting in 15 minutes - Ready to join!`);
        break;
      case "session_confirmed":
        toast.success(`Session confirmed for ${notification.skill}!`);
        break;
      case "session_cancelled":
        toast.error(`Session cancelled: ${notification.skill}`);
        break;
      default:
        toast.success("Session update received");
    }

    // Auto-dismiss non-critical notifications after 10 seconds
    if (
      notification.type !== "session_request" &&
      notification.type !== "session_join_ready"
    ) {
      setTimeout(() => {
        dismissNotification(notificationWithId.id);
      }, 10000);
    }
  }, []);

  const dismissNotification = (notificationId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };
  const handleAcceptSession = async (sessionId) => {
    try {
      await sessionsAPI.updateSession(sessionId, { status: "confirmed" });
      toast.success("Session accepted successfully!");
    } catch (error) {
      console.error("Error accepting session:", error);
      toast.error("Failed to accept session");
    }
  };
  const handleRejectSession = async (sessionId) => {
    try {
      await sessionsAPI.updateSession(sessionId, {
        status: "rejected",
        reason: "Declined by teacher",
      });
      toast.success("Session rejected");
    } catch (error) {
      console.error("Error rejecting session:", error);
      toast.error("Failed to reject session");
    }
  };

  // Expose addNotification function globally
  useEffect(() => {
    window.addSessionNotification = addNotification;
    return () => {
      delete window.addSessionNotification;
    };
  }, [addNotification]);

  return (
    <div className="fixed top-0 right-0 z-50 pointer-events-none">
      <div className="space-y-2 p-4 pointer-events-auto">
        {notifications.map((notification) => (
          <SessionNotification
            key={notification.id}
            notification={notification}
            onDismiss={() => dismissNotification(notification.id)}
            onAccept={handleAcceptSession}
            onReject={handleRejectSession}
          />
        ))}
      </div>
    </div>
  );
};

export { SessionNotification, SessionNotificationManager };
export default SessionNotificationManager;

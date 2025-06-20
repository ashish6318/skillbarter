import React, { useState, useEffect, useCallback } from "react";
import {
  XMarkIcon,
  ClockIcon,
  CalendarIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import NotificationService from "../../services/NotificationService";
import { themeClasses, cn, buttonVariants } from "../../utils/theme";

const SessionReminder = ({ reminder, onDismiss, onJoinSession }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date();
      const sessionTime = new Date(reminder.scheduledFor);
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
    const interval = setInterval(updateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [reminder.scheduledFor]);

  const getReminderIcon = () => {
    switch (reminder.timeUntil) {
      case "in 15 minutes":
        return <VideoCameraIcon className="w-5 h-5 text-red-500" />;
      case "in 1 hour":
        return <ClockIcon className="w-5 h-5 text-orange-500" />;
      case "in 24 hours":
        return <CalendarIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };
  const getReminderColor = () => {
    switch (reminder.timeUntil) {
      case "in 15 minutes":
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20";
      case "in 1 hour":
        return "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20";
      case "in 24 hours":
        return "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20";
      default:
        return cn(themeClasses.borderSecondary, themeClasses.bgTertiary);
    }
  };

  const handleJoinSession = () => {
    if (onJoinSession) {
      onJoinSession(reminder.sessionId);
    }
    onDismiss();
  };
  return (
    <div
      className={cn(
        "fixed top-4 right-4 max-w-sm w-full border rounded-lg shadow-lg p-4 z-50",
        getReminderColor()
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {getReminderIcon()}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4
                className={cn(
                  "text-sm font-semibold",
                  themeClasses.textPrimary
                )}
              >
                Session Reminder
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
              <span className="font-medium">{reminder.skill}</span> session{" "}
              {reminder.timeUntil}
            </p>

            <div
              className={cn(
                "flex items-center space-x-4 mt-2 text-xs",
                themeClasses.textMuted
              )}
            >
              <span className="flex items-center">
                <CalendarIcon className="w-3 h-3 mr-1" />
                {format(new Date(reminder.scheduledFor), "MMM d, h:mm a")}
              </span>
              <span className="flex items-center">
                <ClockIcon className="w-3 h-3 mr-1" />
                {timeLeft}
              </span>
            </div>

            <div className="mt-2 text-xs text-gray-600">
              {reminder.role === "teacher" ? (
                <span>Student: {reminder.otherParticipant?.name}</span>
              ) : (
                <span>Teacher: {reminder.otherParticipant?.name}</span>
              )}
            </div>

            {/* Action buttons for 15-minute reminder */}
            {reminder.timeUntil === "in 15 minutes" && (
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={handleJoinSession}
                  className="flex-1 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                >
                  Join Session
                </button>
                <button
                  onClick={onDismiss}
                  className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SessionReminderManager = () => {
  const [reminders, setReminders] = useState([]);
  const addReminder = useCallback((reminder) => {
    setReminders((prev) => [...prev, { ...reminder, id: Date.now() }]);

    // Add to notification service
    NotificationService.sessionReminder({
      skill: reminder.skill,
      timeUntil: reminder.timeUntil,
      scheduledFor: reminder.scheduledFor,
      sessionId: reminder.sessionId,
    });

    // Auto-dismiss after 30 seconds for non-critical reminders
    if (reminder.timeUntil !== "in 15 minutes") {
      setTimeout(() => {
        dismissReminder(reminder.id || Date.now());
      }, 30000);
    }
  }, []);

  const dismissReminder = (reminderId) => {
    setReminders((prev) => prev.filter((r) => r.id !== reminderId));
  };

  const handleJoinSession = (sessionId) => {
    // Navigate to session room
    window.location.href = `/session/${sessionId}/room`;
  };
  // Expose addReminder function globally so it can be called from socket events
  useEffect(() => {
    window.addSessionReminder = addReminder;
    return () => {
      delete window.addSessionReminder;
    };
  }, [addReminder]);

  return (
    <div className="fixed top-0 right-0 z-50 pointer-events-none">
      <div className="space-y-2 p-4 pointer-events-auto">
        {reminders.map((reminder) => (
          <SessionReminder
            key={reminder.id}
            reminder={reminder}
            onDismiss={() => dismissReminder(reminder.id)}
            onJoinSession={handleJoinSession}
          />
        ))}
      </div>
    </div>
  );
};

export { SessionReminder, SessionReminderManager };
export default SessionReminderManager;

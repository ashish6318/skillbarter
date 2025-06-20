import React, { useState, useEffect } from "react";
import {
  BellIcon,
  XMarkIcon,
  CheckIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { formatDistanceToNow } from "date-fns";
import NotificationService from "../../services/NotificationService";
import {
  themeClasses,
  componentPatterns,
  cn,
  buttonVariants,
} from "../../utils/theme";

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Load notifications
    const loadNotifications = () => {
      const allNotifications = NotificationService.getNotifications();
      setNotifications(allNotifications);
      setUnreadCount(allNotifications.filter((n) => !n.read).length);
    };

    loadNotifications(); // Subscribe to new notifications
    const handleNewNotification = () => {
      loadNotifications();
    };

    NotificationService.subscribe("credit_purchased", handleNewNotification);
    NotificationService.subscribe("credit_transferred", handleNewNotification);
    NotificationService.subscribe("credit_received", handleNewNotification);
    NotificationService.subscribe("session_reminder", handleNewNotification);
    NotificationService.subscribe("low_credits", handleNewNotification);

    return () => {
      NotificationService.unsubscribe(
        "credit_purchased",
        handleNewNotification
      );
      NotificationService.unsubscribe(
        "credit_transferred",
        handleNewNotification
      );
      NotificationService.unsubscribe("credit_received", handleNewNotification);
      NotificationService.unsubscribe(
        "session_reminder",
        handleNewNotification
      );
      NotificationService.unsubscribe("low_credits", handleNewNotification);
    };
  }, []);

  const markAsRead = (id) => {
    NotificationService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    notifications.forEach((n) => {
      if (!n.read) {
        NotificationService.markAsRead(n.id);
      }
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const clearAll = () => {
    NotificationService.clearAll();
    setNotifications([]);
    setUnreadCount(0);
  };
  const getNotificationIcon = (type) => {
    const icons = {
      credit_purchased: "💳",
      credit_transferred: "💸",
      credit_received: "💰",
      session_reminder: "⏰",
      low_credits: "⚠️",
    };
    return icons[type] || "📢";
  };
  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-2 rounded-full transition-colors",
          themeClasses.textMuted,
          themeClasses.hover,
          themeClasses.focus
        )}
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span
            className={cn(
              "absolute -top-1 -right-1 inline-flex items-center justify-center",
              "px-2 py-1 text-xs font-bold leading-none text-white",
              "transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"
            )}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div
          className={cn(
            componentPatterns.modal,
            "absolute right-0 mt-2 w-80 z-50 max-h-96 overflow-hidden"
          )}
        >
          {/* Header */}
          <div
            className={cn(
              "px-4 py-3 border-b flex items-center justify-between",
              themeClasses.borderSecondary
            )}
          >
            <h3
              className={cn("text-lg font-semibold", themeClasses.textPrimary)}
            >
              Notifications
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className={cn(
                "transition-colors",
                themeClasses.textMuted,
                themeClasses.hover
              )}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Actions */}
          {notifications.length > 0 && (
            <div
              className={cn(
                "px-4 py-2 border-b flex justify-between text-sm",
                themeClasses.borderSecondary
              )}
            >
              {" "}
              <button
                onClick={markAllAsRead}
                className={cn(
                  "flex items-center transition-colors",
                  themeClasses.textAccent,
                  "hover:text-accent-hover"
                )}
              >
                <CheckIcon className="h-4 w-4 mr-1" />
                Mark all read
              </button>
              <button
                onClick={clearAll}
                className={cn(
                  "flex items-center transition-colors",
                  "text-red-600 hover:text-red-700"
                )}
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Clear all
              </button>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div
                className={cn("px-4 py-8 text-center", themeClasses.textMuted)}
              >
                <BellIcon
                  className={cn("h-8 w-8 mx-auto mb-2", themeClasses.textMuted)}
                />
                <p>No notifications</p>
              </div>
            ) : (
              <div className={cn("divide-y", themeClasses.borderSecondary)}>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "px-4 py-3 cursor-pointer transition-colors",
                      themeClasses.hover,
                      !notification.read &&
                        cn(themeClasses.bgTertiary, "opacity-90")
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-lg flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p
                            className={cn(
                              "text-sm",
                              themeClasses.textPrimary,
                              !notification.read
                                ? "font-semibold"
                                : "font-medium"
                            )}
                          >
                            {notification.title}
                          </p>{" "}
                          {!notification.read && (
                            <div
                              className={cn(
                                "w-2 h-2 rounded-full flex-shrink-0",
                                themeClasses.textAccent,
                                "bg-current"
                              )}
                            ></div>
                          )}
                        </div>
                        <p
                          className={cn(
                            "text-sm mt-1",
                            themeClasses.textSecondary
                          )}
                        >
                          {notification.message}
                        </p>
                        <p
                          className={cn("text-xs mt-1", themeClasses.textMuted)}
                        >
                          {formatDistanceToNow(
                            new Date(notification.timestamp),
                            { addSuffix: true }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;

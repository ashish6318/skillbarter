import React, { useState, useEffect } from "react";
import {
  BellIcon,
  XMarkIcon,
  CheckIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { formatDistanceToNow } from "date-fns";
import NotificationService from "../../services/NotificationService";

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
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-full"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Notifications
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Actions */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-b border-gray-200 flex justify-between text-sm">
              <button
                onClick={markAllAsRead}
                className="text-indigo-600 hover:text-indigo-800 flex items-center"
              >
                <CheckIcon className="h-4 w-4 mr-1" />
                Mark all read
              </button>
              <button
                onClick={clearAll}
                className="text-red-600 hover:text-red-800 flex items-center"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Clear all
              </button>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <BellIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-lg flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-sm font-medium text-gray-900 ${
                              !notification.read ? "font-semibold" : ""
                            }`}
                          >
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
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

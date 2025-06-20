import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDaysIcon,
  AcademicCapIcon,
  CreditCardIcon,
  UsersIcon,
  BookOpenIcon,
  ChartBarIcon,
  ArrowRightIcon,
  PlusIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import { themeClasses, componentPatterns, cn } from "../utils/theme";

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    sessions: { upcoming: 0, completed: 0 },
    messages: { unread: 0 },
    credits: { balance: 0 },
    connections: { count: 0 },
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);

      // In a real app, you'd have a dedicated dashboard API endpoint
      // For now, we'll simulate with placeholder data

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStats({
        sessions: { upcoming: 3, completed: 12 },
        messages: { unread: 2 },
        credits: { balance: user?.credits || 0 },
        connections: { count: 8 },
      });

      setRecentActivity([
        {
          id: 1,
          type: "session_completed",
          title: "JavaScript Fundamentals session completed",
          time: "2 hours ago",
          icon: AcademicCapIcon,
        },
        {
          id: 2,
          type: "message_received",
          title: "New message from Sarah Chen",
          time: "4 hours ago",
          icon: ChatBubbleLeftRightIcon,
        },
        {
          id: 3,
          type: "session_booked",
          title: "Guitar lesson scheduled for tomorrow",
          time: "1 day ago",
          icon: CalendarDaysIcon,
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.credits]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);
  const quickActions = [
    {
      title: "Find Skills",
      description: "Discover new skills to learn",
      href: "/discover",
      icon: AcademicCapIcon,
    },
    {
      title: "My Sessions",
      description: "View upcoming and past sessions",
      href: "/sessions",
      icon: CalendarDaysIcon,
    },
    {
      title: "Messages",
      description: "Chat with your connections",
      href: "/messages",
      icon: ChatBubbleLeftRightIcon,
    },
    {
      title: "Credits",
      description: "Manage your credit balance",
      href: "/credits",
      icon: CreditCardIcon,
    },
  ];
  if (isLoading) {
    return (
      <div
        className={cn(
          "min-h-screen flex items-center justify-center",
          themeClasses.bgPrimary
        )}
      >
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen", themeClasses.bgPrimary)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1
            className={cn("text-3xl font-bold mb-2", themeClasses.textPrimary)}
          >
            Welcome back, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className={cn("text-lg", themeClasses.textSecondary)}>
            Here's what's happening with your skill exchange journey.
          </p>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {" "}
          <div className={cn(componentPatterns.card, "p-6")}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarDaysIcon
                  className={cn("h-8 w-8", themeClasses.textAccent)}
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt
                    className={cn(
                      "text-sm font-medium truncate",
                      themeClasses.textSecondary
                    )}
                  >
                    Upcoming Sessions
                  </dt>
                  <dd
                    className={cn(
                      "text-lg font-medium",
                      themeClasses.textPrimary
                    )}
                  >
                    {stats.sessions.upcoming}
                  </dd>
                </dl>
              </div>
            </div>
          </div>{" "}
          <div className={cn(componentPatterns.card, "p-6")}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AcademicCapIcon
                  className={cn("h-8 w-8", themeClasses.textAccent)}
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt
                    className={cn(
                      "text-sm font-medium truncate",
                      themeClasses.textSecondary
                    )}
                  >
                    Sessions Completed
                  </dt>
                  <dd
                    className={cn(
                      "text-lg font-semibold",
                      themeClasses.textPrimary
                    )}
                  >
                    {stats.sessions.completed}
                  </dd>
                </dl>
              </div>
            </div>
          </div>{" "}
          <div className={cn(componentPatterns.card, "p-6")}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChatBubbleLeftRightIcon
                  className={cn("h-8 w-8", themeClasses.textAccent)}
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt
                    className={cn(
                      "text-sm font-medium truncate",
                      themeClasses.textSecondary
                    )}
                  >
                    Unread Messages
                  </dt>
                  <dd
                    className={cn(
                      "text-lg font-semibold",
                      themeClasses.textPrimary
                    )}
                  >
                    {stats.messages.unread}
                  </dd>
                </dl>
              </div>
            </div>
          </div>{" "}
          <div className={cn(componentPatterns.card, "p-6")}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCardIcon
                  className={cn("h-8 w-8", themeClasses.textAccent)}
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt
                    className={cn(
                      "text-sm font-medium truncate",
                      themeClasses.textSecondary
                    )}
                  >
                    Credit Balance
                  </dt>
                  <dd
                    className={cn(
                      "text-lg font-semibold",
                      themeClasses.textPrimary
                    )}
                  >
                    {stats.credits.balance}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            {" "}
            <div className={componentPatterns.card}>
              <div className="p-6">
                <h3
                  className={cn(
                    "text-lg font-semibold mb-4",
                    themeClasses.textPrimary
                  )}
                >
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Link
                        key={index}
                        to={action.href}
                        className={cn(
                          "flex items-center p-4 rounded-lg border transition-all",
                          themeClasses.borderSecondary,
                          themeClasses.hover,
                          "hover:border-border-accent"
                        )}
                      >
                        {" "}
                        <div
                          className={cn(
                            "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
                            themeClasses.gradientAccent
                          )}
                        >
                          <Icon
                            className={cn("h-6 w-6", themeClasses.textInverse)}
                          />
                        </div>
                        <div className="ml-4">
                          <h4
                            className={cn(
                              "text-sm font-medium",
                              themeClasses.textPrimary
                            )}
                          >
                            {action.title}
                          </h4>
                          <p
                            className={cn(
                              "text-sm",
                              themeClasses.textSecondary
                            )}
                          >
                            {action.description}
                          </p>
                        </div>
                        <ArrowRightIcon
                          className={cn(
                            "ml-auto h-5 w-5",
                            themeClasses.textMuted
                          )}
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>{" "}
          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <div className={componentPatterns.card}>
              <div className="p-6">
                <h3
                  className={cn(
                    "text-lg font-semibold mb-4",
                    themeClasses.textPrimary
                  )}
                >
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {recentActivity.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div key={activity.id} className="flex items-start">
                        <div className="flex-shrink-0">
                          <Icon
                            className={cn("h-5 w-5", themeClasses.textAccent)}
                          />
                        </div>
                        <div className="ml-3">
                          <p
                            className={cn(
                              "text-sm font-medium",
                              themeClasses.textPrimary
                            )}
                          >
                            {activity.title}
                          </p>
                          <p
                            className={cn(
                              "text-sm",
                              themeClasses.textSecondary
                            )}
                          >
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>{" "}
                {recentActivity.length === 0 && (
                  <p
                    className={cn(
                      "text-sm text-center py-4",
                      themeClasses.textSecondary
                    )}
                  >
                    No recent activity
                  </p>
                )}
              </div>
            </div>{" "}
            {/* Profile Completion */}
            <div className={cn(componentPatterns.card, "mt-6")}>
              <div className="p-6">
                <h3
                  className={cn(
                    "text-lg font-medium mb-4",
                    themeClasses.textPrimary
                  )}
                >
                  Profile Completion
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={cn("text-sm", themeClasses.textSecondary)}>
                      Profile info
                    </span>{" "}
                    <span
                      className={cn(
                        "text-sm font-medium",
                        themeClasses.success
                      )}
                    >
                      ✓
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={cn("text-sm", themeClasses.textSecondary)}>
                      Skills added
                    </span>
                    <span
                      className={cn(
                        "text-sm font-medium",
                        themeClasses.success
                      )}
                    >
                      ✓
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={cn("text-sm", themeClasses.textSecondary)}>
                      Profile photo
                    </span>
                    <Link
                      to="/profile"
                      className={cn(
                        "text-sm font-medium transition-colors",
                        themeClasses.textAccent,
                        "hover:text-accent-hover"
                      )}
                    >
                      Add
                    </Link>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={cn("text-sm", themeClasses.textSecondary)}>
                      Availability
                    </span>
                    <Link
                      to="/profile"
                      className={cn(
                        "text-sm font-medium transition-colors",
                        themeClasses.textAccent,
                        "hover:text-accent-hover"
                      )}
                    >
                      Set
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

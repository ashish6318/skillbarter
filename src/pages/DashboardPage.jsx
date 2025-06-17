import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  UserGroupIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { API_ENDPOINTS } from "../utils/constants";
import LoadingSpinner from "../components/Common/LoadingSpinner";

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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
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
  };

  const quickActions = [
    {
      title: "Find Skills",
      description: "Discover new skills to learn",
      href: "/discover",
      icon: AcademicCapIcon,
      color: "bg-blue-500",
    },
    {
      title: "My Sessions",
      description: "View upcoming and past sessions",
      href: "/sessions",
      icon: CalendarDaysIcon,
      color: "bg-green-500",
    },
    {
      title: "Messages",
      description: "Chat with your connections",
      href: "/messages",
      icon: ChatBubbleLeftRightIcon,
      color: "bg-purple-500",
    },
    {
      title: "Credits",
      description: "Manage your credit balance",
      href: "/credits",
      icon: CreditCardIcon,
      color: "bg-yellow-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Here's what's happening with your skill exchange journey.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarDaysIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Upcoming Sessions
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.sessions.upcoming}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AcademicCapIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Sessions Completed
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.sessions.completed}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Unread Messages
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.messages.unread}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCardIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Credit Balance
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
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
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <Link
                        key={index}
                        to={action.href}
                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
                      >
                        <div
                          className={`flex-shrink-0 w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}
                        >
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-gray-900">
                            {action.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {action.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {recentActivity.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div key={activity.id} className="flex items-start">
                        <div className="flex-shrink-0">
                          <Icon className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {recentActivity.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No recent activity
                  </p>
                )}
              </div>
            </div>

            {/* Profile Completion */}
            <div className="bg-white rounded-lg shadow mt-6">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Profile Completion
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Profile info</span>
                    <span className="text-sm font-medium text-green-600">
                      ✓
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Skills added</span>
                    <span className="text-sm font-medium text-green-600">
                      ✓
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Profile photo</span>
                    <Link
                      to="/profile"
                      className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      Add
                    </Link>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Availability</span>
                    <Link
                      to="/profile"
                      className="text-sm font-medium text-blue-600 hover:text-blue-500"
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

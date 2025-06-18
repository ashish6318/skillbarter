import React, { useState, useEffect, useCallback } from "react";
import {
  CalendarDaysIcon,
  ClockIcon,
  UserGroupIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  StarIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { format, isToday, isTomorrow, isThisWeek } from "date-fns";
import { sessionsAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../Common/LoadingSpinner";

const SessionDashboard = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("upcoming");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [sessionsRes] = await Promise.all([
        sessionsAPI.getSessions({ limit: 50 }),
      ]);

      setSessions(sessionsRes.data.sessions || []);
      calculateStats(sessionsRes.data.sessions || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (sessionData) => {
    const now = new Date();
    const stats = {
      total: sessionData.length,
      upcoming: sessionData.filter(
        (s) => s.status === "confirmed" && new Date(s.scheduledFor) > now
      ).length,
      inProgress: sessionData.filter((s) => s.status === "in_progress").length,
      completed: sessionData.filter((s) => s.status === "completed").length,
      pending: sessionData.filter(
        (s) => s.status === "pending" && s.teacher._id === user?.id
      ).length,
      teachingSessions: sessionData.filter((s) => s.teacher._id === user?.id)
        .length,
      learningSessions: sessionData.filter((s) => s.student._id === user?.id)
        .length,
    };
    setStats(stats);
  };

  const getFilteredSessions = () => {
    const now = new Date();

    switch (filter) {
      case "upcoming":
        return sessions
          .filter(
            (s) => s.status === "confirmed" && new Date(s.scheduledFor) > now
          )
          .sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor));

      case "pending":
        return sessions.filter(
          (s) => s.status === "pending" && s.teacher._id === user?.id
        );

      case "in_progress":
        return sessions.filter((s) => s.status === "in_progress");

      case "completed":
        return sessions
          .filter((s) => s.status === "completed")
          .sort(
            (a, b) =>
              new Date(b.completedAt || b.endedAt) -
              new Date(a.completedAt || a.endedAt)
          );

      default:
        return sessions;
    }
  };

  const getSessionTimeLabel = (scheduledFor) => {
    const date = new Date(scheduledFor);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isThisWeek(date)) return format(date, "EEEE");
    return format(date, "MMM dd");
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className={`bg-white rounded-lg p-6 shadow-sm border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
    </div>
  );

  const SessionRow = ({ session }) => {
    const isTeacher = session.teacher._id === user?.id;
    const participant = isTeacher ? session.student : session.teacher;

    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                {participant.profilePicture ? (
                  <img
                    src={participant.profilePicture}
                    alt={participant.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-indigo-600 font-medium">
                    {participant.name?.charAt(0) || "U"}
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {session.skill}
                </h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    session.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : session.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : session.status === "in_progress"
                      ? "bg-blue-100 text-blue-800"
                      : session.status === "completed"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {session.status.replace("_", " ").toUpperCase()}
                </span>
              </div>

              <div className="flex items-center space-x-4 mt-1">
                <p className="text-sm text-gray-600">
                  with <span className="font-medium">{participant.name}</span>
                  <span className="text-gray-400">
                    {" "}
                    • {isTeacher ? "Teaching" : "Learning"}
                  </span>
                </p>
              </div>

              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <CalendarDaysIcon className="w-4 h-4 mr-1" />
                  {getSessionTimeLabel(session.scheduledFor)}
                </div>
                <div className="flex items-center">
                  <ClockIcon className="w-4 h-4 mr-1" />
                  {format(new Date(session.scheduledFor), "h:mm a")} (
                  {session.duration}m)
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {session.status === "confirmed" && (
              <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                <VideoCameraIcon className="w-4 h-4 mr-1" />
                Join
              </button>
            )}

            {session.status === "pending" && isTeacher && (
              <div className="flex space-x-2">
                <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                  <CheckCircleIcon className="w-4 h-4 mr-1" />
                  Accept
                </button>
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Decline
                </button>
              </div>
            )}

            {session.status === "completed" && session.review?.rating && (
              <div className="flex items-center">
                <StarIcon className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-600 ml-1">
                  {session.review.rating}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Session Overview</h1>
          <p className="mt-2 text-gray-600">
            Manage your teaching and learning sessions
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Upcoming Sessions"
            value={stats.upcoming || 0}
            icon={CalendarDaysIcon}
            color="border-blue-400"
            subtitle="Confirmed sessions"
          />
          <StatCard
            title="Pending Approvals"
            value={stats.pending || 0}
            icon={ExclamationTriangleIcon}
            color="border-yellow-400"
            subtitle="Awaiting your response"
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress || 0}
            icon={VideoCameraIcon}
            color="border-green-400"
            subtitle="Currently active"
          />
          <StatCard
            title="Completed"
            value={stats.completed || 0}
            icon={CheckCircleIcon}
            color="border-gray-400"
            subtitle="This month"
          />
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-1 mb-6">
          <nav className="flex space-x-1">
            {[
              { key: "upcoming", label: "Upcoming", count: stats.upcoming },
              { key: "pending", label: "Pending", count: stats.pending },
              {
                key: "in_progress",
                label: "In Progress",
                count: stats.inProgress,
              },
              { key: "completed", label: "Completed", count: stats.completed },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  filter === tab.key
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                      filter === tab.key
                        ? "bg-indigo-200 text-indigo-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          {getFilteredSessions().length === 0 ? (
            <div className="text-center py-12">
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No sessions found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === "upcoming" &&
                  "You don't have any upcoming sessions."}
                {filter === "pending" && "No sessions pending your approval."}
                {filter === "in_progress" &&
                  "No sessions currently in progress."}
                {filter === "completed" &&
                  "You haven't completed any sessions yet."}
              </p>
            </div>
          ) : (
            getFilteredSessions().map((session) => (
              <SessionRow key={session._id} session={session} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionDashboard;

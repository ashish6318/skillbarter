import React, { useState, useEffect } from "react";
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
import {
  themeClasses,
  componentPatterns,
  cn,
  buttonVariants,
  statusClasses,
} from "../../utils/theme";

const SessionDashboard = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("upcoming");
  useEffect(() => {
    const calculateStats = (sessionData) => {
      const now = new Date();
      const stats = {
        total: sessionData.length,
        upcoming: sessionData.filter(
          (s) => s.status === "confirmed" && new Date(s.scheduledFor) > now
        ).length,
        inProgress: sessionData.filter((s) => s.status === "in_progress")
          .length,
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

    fetchDashboardData();
  }, [user?.id]);

  // Removed fetchDashboardData function from here

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
  const StatCard = ({ title, value, subtitle }) => (
    <div className={cn(componentPatterns.card, "p-6")}>
      <div className="flex items-center justify-between">
        <div>
          <p className={cn("text-sm font-medium", themeClasses.textSecondary)}>
            {title}
          </p>
          <p className={cn("text-2xl font-bold", themeClasses.textPrimary)}>
            {value}
          </p>
          {subtitle && (
            <p className={cn("text-xs mt-1", themeClasses.textMuted)}>
              {subtitle}
            </p>
          )}
        </div>
        <Icon className={cn("w-8 h-8", themeClasses.textAccent)} />
      </div>
    </div>
  );
  const SessionRow = ({ session }) => {
    const isTeacher = session.teacher._id === user?.id;
    const participant = isTeacher ? session.student : session.teacher;

    return (
      <div className={cn(componentPatterns.cardHover, "p-4")}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  themeClasses.bgTertiary
                )}
              >
                {participant.profilePicture ? (
                  <img
                    src={participant.profilePicture}
                    alt={participant.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <span className={cn("font-medium", themeClasses.textAccent)}>
                    {participant.name?.charAt(0) || "U"}
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              {" "}
              <div className="flex items-center space-x-2">
                <h3
                  className={cn(
                    "text-lg font-medium truncate",
                    themeClasses.textPrimary
                  )}
                >
                  {session.skill}
                </h3>
                <span
                  className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                    session.status === "confirmed"
                      ? statusClasses.successLight
                      : session.status === "pending"
                      ? statusClasses.warningLight
                      : session.status === "in_progress"
                      ? statusClasses.infoLight
                      : session.status === "completed"
                      ? cn(themeClasses.bgTertiary, themeClasses.textMuted)
                      : statusClasses.errorLight
                  )}
                >
                  {session.status.replace("_", " ").toUpperCase()}
                </span>
              </div>
              <div className="flex items-center space-x-4 mt-1">
                <p className={cn("text-sm", themeClasses.textSecondary)}>
                  with <span className="font-medium">{participant.name}</span>
                  <span className={themeClasses.textMuted}>
                    {" "}
                    • {isTeacher ? "Teaching" : "Learning"}
                  </span>
                </p>
              </div>
              <div
                className={cn(
                  "flex items-center space-x-4 mt-2 text-sm",
                  themeClasses.textMuted
                )}
              >
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
          </div>{" "}
          <div className="flex items-center space-x-2">
            {session.status === "confirmed" && (
              <button
                className={cn(
                  buttonVariants.primary,
                  "inline-flex items-center text-sm"
                )}
              >
                <VideoCameraIcon className="w-4 h-4 mr-1" />
                Join
              </button>
            )}{" "}
            {session.status === "pending" && isTeacher && (
              <div className="flex space-x-2">
                <button
                  className={cn(
                    buttonVariants.success,
                    "inline-flex items-center text-sm leading-4"
                  )}
                >
                  <CheckCircleIcon className="w-4 h-4 mr-1" />
                  Accept
                </button>
                <button
                  className={cn(
                    buttonVariants.secondary,
                    "inline-flex items-center text-sm leading-4"
                  )}
                >
                  Decline
                </button>
              </div>
            )}{" "}
            {session.status === "completed" && session.review?.rating && (
              <div className="flex items-center">
                <StarIcon className={cn("w-4 h-4", themeClasses.warning)} />
                <span
                  className={cn("text-sm ml-1", themeClasses.textSecondary)}
                >
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
            Session Overview
          </h1>
          <p className={cn("mt-2", themeClasses.textSecondary)}>
            Manage your teaching and learning sessions
          </p>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Upcoming Sessions"
            value={stats.upcoming || 0}
            icon={CalendarDaysIcon}
            color={themeClasses.borderAccent}
            subtitle="Confirmed sessions"
          />{" "}
          <StatCard
            title="Pending Approvals"
            value={stats.pending || 0}
            icon={ExclamationTriangleIcon}
            subtitle="Awaiting your response"
          />
          <StatCard
            title="In Progress"
            value={stats.inProgress || 0}
            icon={VideoCameraIcon}
            subtitle="Currently active"
          />
          <StatCard
            title="Completed"
            value={stats.completed || 0}
            icon={CheckCircleIcon}
            subtitle="This month"
          />
        </div>{" "}
        {/* Filter Tabs */}
        <div className={cn(componentPatterns.card, "p-1 mb-6")}>
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
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  filter === tab.key
                    ? cn(themeClasses.bgTertiary, themeClasses.textAccent)
                    : cn(themeClasses.textSecondary, themeClasses.hover)
                )}
              >
                {tab.label}{" "}
                {tab.count > 0 && (
                  <span
                    className={cn(
                      "ml-2 py-0.5 px-2 rounded-full text-xs",
                      filter === tab.key
                        ? cn("bg-accent-light", themeClasses.textAccent)
                        : cn(themeClasses.bgTertiary, themeClasses.textMuted)
                    )}
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
              <UserGroupIcon
                className={cn("mx-auto h-12 w-12", themeClasses.textMuted)}
              />
              <h3
                className={cn(
                  "mt-2 text-sm font-medium",
                  themeClasses.textPrimary
                )}
              >
                No sessions found
              </h3>
              <p className={cn("mt-1 text-sm", themeClasses.textSecondary)}>
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

import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  SparklesIcon,
  ChartBarIcon as TrendingUpIcon,
  BellIcon,
  StarIcon,
  FireIcon,
  LightBulbIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import { themeClasses, cn } from "../utils/theme";

// Enhanced animation variants
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
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const cardHoverVariants = {
  hover: {
    scale: 1.03,
    y: -5,
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

// Progress Ring Component
const ProgressRing = ({
  progress,
  size = 60,
  strokeWidth = 4,
  className = "",
}) => {
  const normalizedRadius = size / 2 - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative ${className}`}>
      <svg height={size} width={size} className="transform -rotate-90">
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
          className="text-gray-200 dark:text-gray-700"
        />
        <motion.circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
          className="text-blue-500"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
          {progress}%
        </span>
      </div>
    </div>
  );
};

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
  const statCards = [
    {
      title: "Upcoming Sessions",
      value: stats.sessions.upcoming,
      icon: CalendarDaysIcon,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      change: "+2 this week",
      trend: "up",
      description: "Sessions scheduled",
      progress: 75,
    },
    {
      title: "Sessions Completed",
      value: stats.sessions.completed,
      icon: AcademicCapIcon,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      change: "+3 this month",
      trend: "up",
      description: "Learning milestones",
      progress: 85,
    },
    {
      title: "Unread Messages",
      value: stats.messages.unread,
      icon: ChatBubbleLeftRightIcon,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      change: "2 new today",
      trend: "up",
      description: "Pending conversations",
      progress: 40,
    },
    {
      title: "Credit Balance",
      value: stats.credits.balance,
      icon: CreditCardIcon,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      change: `+${Math.floor(stats.credits.balance * 0.1)} earned`,
      trend: "up",
      description: "Available credits",
      progress: 60,
    },
  ];
  const quickActions = [
    {
      title: "Find Skills",
      description: "Discover new skills to learn",
      href: "/discover",
      icon: LightBulbIcon,
      badge: "Popular",
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      title: "My Sessions",
      description: "View upcoming and past sessions",
      href: "/sessions",
      icon: CalendarDaysIcon,
      badge: "3 Upcoming",
      gradient: "from-blue-400 to-blue-600",
    },
    {
      title: "Messages",
      description: "Chat with your connections",
      href: "/messages",
      icon: ChatBubbleLeftRightIcon,
      badge:
        stats.messages.unread > 0 ? `${stats.messages.unread} New` : "Active",
      gradient: "from-purple-400 to-purple-600",
    },
    {
      title: "Credits",
      description: "Manage your credit balance",
      href: "/credits",
      icon: CreditCardIcon,
      badge: `${stats.credits.balance} Available`,
      gradient: "from-emerald-400 to-emerald-600",
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
    <motion.div
      className={cn("min-h-screen", themeClasses.bgPrimary)}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {" "}
        {/* Enhanced Welcome Section */}
        <motion.div
          className="mb-12 relative overflow-hidden"
          variants={itemVariants}
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-3xl">
            <motion.div
              className="absolute inset-0 opacity-30"
              animate={{
                background: [
                  "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%)",
                  "radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
                  "radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)",
                ],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-10, 10],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 p-8 md:p-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex items-center space-x-4 mb-6"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center"
              >
                <FireIcon className="h-5 w-5 text-white" />
              </motion.div>
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400 font-mono text-sm tracking-wider uppercase">
                  Dashboard Overview
                </span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-green-400 rounded-full"
                />
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Welcome back,{" "}
              <motion.span
                className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {user?.firstName || user?.name?.split(" ")[0]}
              </motion.span>
              !{" "}
              <motion.span
                animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut",
                }}
                className="inline-block"
              >
                👋
              </motion.span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <p className="text-xl text-gray-300 max-w-2xl leading-relaxed mb-6 md:mb-0">
                Track your learning journey, connect with peers, and discover
                new skills in your personalized dashboard.
              </p>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex items-center space-x-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
                >
                  <RocketLaunchIcon className="h-5 w-5" />
                  <span>Get Started</span>
                </motion.button>

                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
                >
                  <BellIcon className="h-6 w-6 text-white" />
                  {stats.messages.unread > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                    >
                      <span className="text-xs text-white font-bold">
                        {stats.messages.unread}
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>{" "}
        {/* Enhanced Stats Cards with Progress Rings */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={itemVariants}
        >
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                variants={cardHoverVariants}
                whileHover="hover"
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  rotateX: 0,
                  transition: {
                    delay: index * 0.1 + 0.3,
                    duration: 0.6,
                    ease: "easeOut",
                  },
                }}
                className={cn(
                  "group relative overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-700",
                  "bg-white dark:bg-gray-800/50 backdrop-blur-sm",
                  "hover:shadow-2xl hover:shadow-gray-900/10 dark:hover:shadow-gray-900/40",
                  "transition-all duration-500 ease-out cursor-pointer transform-gpu"
                )}
                style={{ perspective: "1000px" }}
              >
                {/* Animated background gradient */}
                <motion.div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10",
                    stat.color
                  )}
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                />

                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-6">
                    <motion.div
                      className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center",
                        `bg-gradient-to-br ${stat.color}`,
                        "shadow-lg group-hover:shadow-xl"
                      )}
                      whileHover={{
                        rotate: [0, -10, 10, -5, 0],
                        scale: 1.1,
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </motion.div>

                    <ProgressRing
                      progress={stat.progress}
                      size={48}
                      className="text-gray-400"
                    />
                  </div>

                  <div className="space-y-3">
                    <motion.div
                      className="flex items-baseline justify-between"
                      layoutId={`stat-${index}`}
                    >
                      <motion.p
                        className="text-3xl font-bold text-gray-900 dark:text-white"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          delay: index * 0.1 + 0.6,
                          duration: 0.5,
                          type: "spring",
                          stiffness: 200,
                        }}
                        whileHover={{ scale: 1.1 }}
                      >
                        {stat.value}
                      </motion.p>
                      <motion.div
                        className="flex items-center space-x-1 text-xs font-medium"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.8 }}
                      >
                        <motion.div
                          animate={{
                            y: [0, -2, 0],
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.3,
                          }}
                        >
                          <TrendingUpIcon className="h-4 w-4 text-emerald-500" />
                        </motion.div>
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {stat.change}
                        </span>
                      </motion.div>
                    </motion.div>

                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {stat.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {stat.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hover effect overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />

                {/* Decorative elements */}
                <div
                  className={cn(
                    "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r",
                    stat.color
                  )}
                />
                <motion.div
                  className="absolute top-4 right-4 w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.4,
                  }}
                />
              </motion.div>
            );
          })}
        </motion.div>{" "}
        {/* Enhanced Main Content Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          variants={itemVariants}
        >
          {" "}
          {/* Enhanced Quick Actions */}
          <div className="lg:col-span-2">
            <motion.div
              className={cn(
                "relative overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-700",
                "bg-white dark:bg-gray-800/50 backdrop-blur-sm shadow-2xl"
              )}
              whileHover={{ scale: 1.005 }}
              transition={{ duration: 0.3 }}
            >
              {/* Animated Background Pattern */}
              <motion.div
                className="absolute inset-0 opacity-5"
                animate={{
                  backgroundImage: [
                    "radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.5) 0%, transparent 50%)",
                    "radial-gradient(circle at 100% 100%, rgba(147, 51, 234, 0.5) 0%, transparent 50%)",
                    "radial-gradient(circle at 0% 100%, rgba(59, 130, 246, 0.5) 0%, transparent 50%)",
                  ],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />

              <div className="relative p-8">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-between mb-8"
                >
                  <div className="flex items-center space-x-4">
                    <motion.div
                      className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                    >
                      <SparklesIcon className="h-6 w-6 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Quick Actions
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Navigate to your most used features
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    View All
                  </motion.button>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30, rotateY: -15 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          rotateY: 0,
                          transition: {
                            delay: 0.7 + index * 0.1,
                            duration: 0.6,
                            ease: "easeOut",
                          },
                        }}
                        whileHover={{
                          scale: 1.05,
                          y: -8,
                          rotateY: 5,
                          transition: { duration: 0.3 },
                        }}
                        className="group"
                        style={{ perspective: "1000px" }}
                      >
                        <Link
                          to={action.href}
                          className={cn(
                            "relative flex flex-col p-6 rounded-2xl border border-gray-200 dark:border-gray-600",
                            "bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800",
                            "hover:border-transparent hover:shadow-2xl",
                            "transition-all duration-500 ease-out overflow-hidden transform-gpu"
                          )}
                        >
                          {/* Badge */}
                          <motion.div
                            className={cn(
                              "absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold",
                              "bg-gradient-to-r text-white shadow-lg",
                              action.gradient
                            )}
                            initial={{ scale: 0, rotate: -10 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                              delay: 0.8 + index * 0.1,
                              type: "spring",
                              stiffness: 200,
                            }}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                          >
                            {action.badge}
                          </motion.div>

                          {/* Icon with enhanced animation */}
                          <motion.div
                            className={cn(
                              "flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center mb-4",
                              "bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300",
                              "group-hover:shadow-2xl"
                            )}
                            whileHover={{
                              rotate: [0, -10, 10, -5, 0],
                              scale: 1.15,
                              transition: { duration: 0.6 },
                            }}
                          >
                            <Icon className="h-7 w-7 text-white dark:text-gray-900" />
                          </motion.div>

                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {action.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                              {action.description}
                            </p>
                          </div>

                          {/* Arrow with smooth animation */}
                          <motion.div
                            className="mt-4 flex justify-end"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9 + index * 0.1 }}
                          >
                            <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-2 transition-all duration-300" />
                          </motion.div>

                          {/* Hover overlay effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            initial={false}
                          />

                          {/* Shimmer effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 0.8 }}
                          />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>{" "}
          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Enhanced Recent Activity */}
            <motion.div
              className={cn(
                "relative overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-700",
                "bg-white dark:bg-gray-800/50 backdrop-blur-sm shadow-2xl"
              )}
              initial={{ opacity: 0, x: 30, rotateY: 15 }}
              animate={{
                opacity: 1,
                x: 0,
                rotateY: 0,
                transition: { delay: 0.8, duration: 0.8, ease: "easeOut" },
              }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Gradient Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5"
                animate={{
                  opacity: [0.05, 0.1, 0.05],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <div className="relative p-6">
                <motion.div
                  className="flex items-center justify-between mb-6"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  <div className="flex items-center space-x-3">
                    <motion.div
                      className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <TrendingUpIcon className="h-5 w-5 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Recent Activity
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Last 7 days
                      </p>
                    </div>
                  </div>
                  <motion.div
                    className="w-3 h-3 bg-green-400 rounded-full"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                </motion.div>

                <div className="space-y-4">
                  <AnimatePresence>
                    {recentActivity.map((activity, index) => {
                      const Icon = activity.icon;
                      return (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -30, scale: 0.9 }}
                          animate={{
                            opacity: 1,
                            x: 0,
                            scale: 1,
                            transition: {
                              delay: 1.1 + index * 0.1,
                              duration: 0.5,
                            },
                          }}
                          exit={{ opacity: 0, x: 30, scale: 0.9 }}
                          whileHover={{
                            x: 5,
                            scale: 1.02,
                            transition: { duration: 0.2 },
                          }}
                          className="group relative flex items-start p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 cursor-pointer"
                        >
                          {/* Activity indicator line */}
                          <motion.div
                            className="absolute left-6 top-12 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 to-transparent dark:from-gray-600"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{
                              delay: 1.2 + index * 0.1,
                              duration: 0.3,
                            }}
                          />

                          <motion.div
                            className="relative flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center z-10"
                            whileHover={{ rotate: 5, scale: 1.1 }}
                          >
                            <Icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                          </motion.div>

                          <div className="ml-4 flex-1">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {activity.title}
                            </p>
                            <div className="flex items-center mt-1 space-x-2">
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {activity.time}
                              </p>
                              <motion.div
                                className="w-1 h-1 bg-gray-400 rounded-full"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  delay: index * 0.5,
                                }}
                              />
                            </div>
                          </div>

                          {/* Hover indicator */}
                          <motion.div
                            className="opacity-0 group-hover:opacity-100 w-2 h-2 bg-blue-500 rounded-full"
                            whileHover={{ scale: 1.5 }}
                            transition={{ duration: 0.2 }}
                          />
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {recentActivity.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <BookOpenIcon className="h-8 w-8 text-gray-400" />
                    </motion.div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No recent activity
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Start learning to see your progress here
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Enhanced Profile Completion */}
            <motion.div
              className={cn(
                "relative overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-700",
                "bg-white dark:bg-gray-800/50 backdrop-blur-sm shadow-2xl"
              )}
              initial={{ opacity: 0, x: 30, rotateY: 15 }}
              animate={{
                opacity: 1,
                x: 0,
                rotateY: 0,
                transition: { delay: 1.0, duration: 0.8, ease: "easeOut" },
              }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Animated background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"
                animate={{
                  opacity: [0.05, 0.1, 0.05],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <div className="relative p-6">
                <motion.div
                  className="flex items-center justify-between mb-6"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <div className="flex items-center space-x-3">
                    <motion.div
                      className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center"
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <UsersIcon className="h-5 w-5 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Profile Setup
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Complete your profile
                      </p>
                    </div>
                  </div>
                  <ProgressRing
                    progress={50}
                    size={40}
                    className="text-purple-500"
                  />
                </motion.div>

                <div className="space-y-4">
                  {[
                    { label: "Basic Info", completed: true, icon: UsersIcon },
                    { label: "Skills Added", completed: true, icon: StarIcon },
                    {
                      label: "Profile Photo",
                      completed: false,
                      link: "/profile",
                      icon: SparklesIcon,
                    },
                    {
                      label: "Availability",
                      completed: false,
                      link: "/profile",
                      icon: CalendarDaysIcon,
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20, x: -10 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        x: 0,
                        transition: { delay: 1.3 + index * 0.1, duration: 0.5 },
                      }}
                      whileHover={{ x: 5, scale: 1.02 }}
                      className="group flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-3">
                        <motion.div
                          className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center",
                            item.completed
                              ? "bg-emerald-500"
                              : "bg-gray-200 dark:bg-gray-600"
                          )}
                          whileHover={{
                            rotate: item.completed ? 360 : 5,
                            scale: 1.1,
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          {item.completed ? (
                            <motion.span
                              className="text-white text-xs font-bold"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                delay: 1.4 + index * 0.1,
                                type: "spring",
                                stiffness: 300,
                              }}
                            >
                              ✓
                            </motion.span>
                          ) : (
                            <item.icon className="h-4 w-4 text-gray-500" />
                          )}
                        </motion.div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                          {item.label}
                        </span>
                      </div>

                      {!item.completed && (
                        <Link to={item.link} className="relative">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                          >
                            Add
                          </motion.button>
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Motivational CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.7 }}
                  className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <motion.div
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                    >
                      <LightBulbIcon className="h-5 w-5 text-yellow-500" />
                    </motion.div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      Complete your profile
                    </p>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    A complete profile helps you get better matches and more
                    session requests!
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;

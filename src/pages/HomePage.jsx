import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  AcademicCapIcon,
  UserGroupIcon,
  ClockIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  SparklesIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  StarIcon,
  PlayCircleIcon,
  GlobeAltIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { themeClasses, cn } from "../utils/theme";

// Enhanced animation variants with reduced motion support
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
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
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
      duration: 0.6,
      ease: "easeOut",
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

// Hero section variants
const heroVariants = {
  badge: {
    hidden: { opacity: 0, y: -20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: 0.2,
        duration: 0.8,
        type: "spring",
        stiffness: 120,
      },
    },
  },
  heading: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.4,
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  },
  subtitle: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.6,
        duration: 0.6,
      },
    },
  },
  cta: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.8,
        duration: 0.6,
        type: "spring",
        stiffness: 100,
      },
    },
  },
};

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  // Clean, monochrome features with single icons
  const features = [
    {
      icon: LightBulbIcon,
      title: "Learn Any Skill",
      description:
        "Access thousands of skills from programming to cooking, taught by passionate peers in interactive sessions.",
    },
    {
      icon: UserGroupIcon,
      title: "Teach & Earn",
      description:
        "Share your expertise and earn credits while helping others grow and building your professional network.",
    },
    {
      icon: ClockIcon,
      title: "Flexible Scheduling",
      description:
        "Book sessions at your convenience with our intelligent scheduling system that adapts to your timezone.",
    },
    {
      icon: SparklesIcon,
      title: "Premium Experience",
      description:
        "Enjoy high-quality video calls, interactive whiteboards, and smart matching with our premium features.",
    },
  ];

  // Clean stats without color variations
  const stats = [
    {
      value: "10K+",
      label: "Active Learners",
      icon: UserGroupIcon,
      description: "Growing community",
    },
    {
      value: "500+",
      label: "Skills Available",
      icon: AcademicCapIcon,
      description: "Diverse expertise",
    },
    {
      value: "25K+",
      label: "Sessions Completed",
      icon: CheckCircleIcon,
      description: "Successful exchanges",
    },
    {
      value: "98%",
      label: "Satisfaction Rate",
      icon: StarIcon,
      description: "Happy users",
    },
  ];

  return (
    <motion.div
      className={cn("min-h-screen", themeClasses.bgPrimary)}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Clean, Professional Hero Section */}
      <section
        className="relative overflow-hidden min-h-screen flex items-center"
        role="banner"
        aria-label="Welcome to SkillBarter"
      >
        {/* Pure Theme-Aware Background */}
        <div className={cn("absolute inset-0", themeClasses.bgPrimary)}>
          {/* Subtle Background Pattern - Respects reduced motion */}{" "}
          <motion.div
            className={cn(
              "absolute inset-0 opacity-[0.02] dark:opacity-[0.05]",
              "text-gray-900 dark:text-white"
            )}
            initial={false}
            animate={
              shouldReduceMotion
                ? {}
                : {
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }
            }
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
              backgroundSize: "32px 32px",
              color: "currentColor",
            }}
          />
          {/* Single Subtle Blob - Theme Aware */}
          <motion.div
            className={cn(
              "absolute top-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl",
              "opacity-[0.03] dark:opacity-[0.08]",
              themeClasses.textPrimary
            )}
            animate={
              shouldReduceMotion
                ? {}
                : {
                    scale: [1, 1.1, 1],
                    opacity: [0.02, 0.06, 0.02],
                  }
            }
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              backgroundColor: "currentColor",
              willChange: "transform",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-5xl mx-auto">
            {/* Enhanced Glassmorphism Badge */}
            <motion.div
              className={cn(
                "inline-flex items-center space-x-3 px-8 py-4 rounded-full mb-12",
                // Enhanced glassmorphism with theme awareness
                "bg-white/[0.08] dark:bg-black/[0.08] backdrop-blur-xl",
                "border border-white/[0.15] dark:border-white/[0.10]",
                "shadow-2xl shadow-black/[0.08] dark:shadow-white/[0.05]",
                "ring-1 ring-inset ring-white/[0.08] dark:ring-white/[0.05]"
              )}
              variants={heroVariants.badge}
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                borderColor: "rgba(255, 255, 255, 0.2)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
              }}
              role="banner"
              aria-label="Platform highlight"
            >
              <motion.div
                animate={shouldReduceMotion ? {} : { rotate: [0, 360] }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <SparklesIcon
                  className={cn("h-5 w-5", themeClasses.textSecondary)}
                />
              </motion.div>

              <span
                className={cn(
                  "text-sm font-semibold tracking-wide",
                  "font-['Poppins',_sans-serif]",
                  themeClasses.textPrimary
                )}
              >
                The Future of Peer Learning
              </span>

              <motion.div
                className={cn("w-2 h-2 rounded-full", themeClasses.textAccent)}
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7],
                      }
                }
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  backgroundColor: "currentColor",
                }}
              />
            </motion.div>

            {/* Clean Monochrome Heading with Single Accent Word */}
            <motion.h1
              className={cn(
                "text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8",
                "leading-[1.02] tracking-tight",
                "font-['Poppins',_sans-serif]",
                themeClasses.textPrimary
              )}
              variants={heroVariants.heading}
              aria-label="Learn, teach, and grow together"
            >
              Learn, Teach, and{" "}
              <motion.span
                className="relative inline-block"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.8,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 120,
                }}
              >
                <span className={cn("relative z-10", themeClasses.textPrimary)}>
                  {" "}
                  <motion.span
                    className="relative"
                    animate={
                      shouldReduceMotion
                        ? {}
                        : {
                            textShadow: [
                              "0 0 20px rgba(255, 255, 255, 0.3)",
                              "0 0 30px rgba(255, 255, 255, 0.5)",
                              "0 0 20px rgba(255, 255, 255, 0.3)",
                            ],
                          }
                    }
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.2))",
                    }}
                  >
                    Grow
                  </motion.span>
                </span>{" "}
                {/* Subtle Glow Effect - Theme Aware */}
                <motion.div
                  className={cn(
                    "absolute -inset-2 rounded-lg opacity-20 blur-xl -z-10",
                    "bg-gray-500 dark:bg-gray-300"
                  )}
                  animate={
                    shouldReduceMotion
                      ? {}
                      : {
                          opacity: [0.1, 0.3, 0.1],
                          scale: [0.8, 1.1, 0.8],
                        }
                  }
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.span>{" "}
              Together
            </motion.h1>

            {/* Clean Subtitle */}
            <motion.p
              className={cn(
                "text-lg sm:text-xl md:text-2xl mb-12 max-w-4xl mx-auto",
                "leading-relaxed font-normal",
                "font-['Inter',_sans-serif]",
                themeClasses.textSecondary
              )}
              variants={heroVariants.subtitle}
            >
              Join the world's most innovative peer-to-peer skill exchange
              platform. Share your expertise, learn from others, and build
              meaningful connections in a{" "}
              <span className={cn("font-medium", themeClasses.textPrimary)}>
                professional environment
              </span>
              .
            </motion.p>

            {/* Clean CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              variants={heroVariants.cta}
            >
              {isAuthenticated ? (
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative group"
                >
                  <Link
                    to="/dashboard"
                    className={cn(
                      "relative px-10 py-4 text-lg font-semibold rounded-2xl",
                      "transition-all duration-300 inline-flex items-center justify-center",
                      "font-['Poppins',_sans-serif]",
                      // Theme-aware button styling
                      "bg-gray-900 dark:bg-white text-white dark:text-gray-900",
                      "hover:bg-gray-800 dark:hover:bg-gray-100",
                      "shadow-xl hover:shadow-2xl",
                      "border border-gray-900 dark:border-white",
                      // Enhanced focus states
                      "focus:outline-none focus:ring-4 focus:ring-gray-500/50",
                      "active:scale-95"
                    )}
                    aria-label="Navigate to your dashboard"
                  >
                    {/* Subtle Border Glow on Hover */}
                    <motion.div
                      className={cn(
                        "absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100",
                        "bg-gradient-to-r from-gray-600 to-gray-800 dark:from-gray-300 dark:to-gray-500",
                        "blur-sm transition-opacity duration-300 -z-10"
                      )}
                    />

                    <span className="relative z-10 flex items-center">
                      Go to Dashboard
                      <motion.div
                        className="ml-2"
                        animate={shouldReduceMotion ? {} : { x: [0, 3, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 1,
                        }}
                      >
                        <ArrowRightIcon className="w-5 h-5" />
                      </motion.div>
                    </span>
                  </Link>
                </motion.div>
              ) : (
                <>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative group"
                  >
                    <Link
                      to="/register"
                      className={cn(
                        "relative px-10 py-4 text-lg font-semibold rounded-2xl",
                        "transition-all duration-300 inline-flex items-center justify-center",
                        "font-['Poppins',_sans-serif]",
                        // Primary CTA - Theme aware
                        "bg-gray-900 dark:bg-white text-white dark:text-gray-900",
                        "hover:bg-gray-800 dark:hover:bg-gray-100",
                        "shadow-xl hover:shadow-2xl",
                        "border border-gray-900 dark:border-white",
                        // Accessibility
                        "focus:outline-none focus:ring-4 focus:ring-gray-500/50",
                        "active:scale-95"
                      )}
                      aria-label="Create your free account"
                    >
                      {/* Enhanced Border Animation */}
                      <motion.div
                        className={cn(
                          "absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100",
                          "bg-gradient-to-r from-gray-600 to-gray-800 dark:from-gray-300 dark:to-gray-500",
                          "blur-sm transition-opacity duration-300 -z-10"
                        )}
                      />

                      <span className="relative z-10 flex items-center">
                        <RocketLaunchIcon className="w-5 h-5 mr-2" />
                        Start Learning
                      </span>
                    </Link>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative group"
                  >
                    <Link
                      to="/login"
                      className={cn(
                        "relative px-10 py-4 text-lg font-medium rounded-2xl",
                        "transition-all duration-300 inline-flex items-center justify-center",
                        "font-['Poppins',_sans-serif]",
                        // Secondary CTA - Clean border style
                        "border-2 border-current",
                        themeClasses.textPrimary,
                        "hover:bg-current hover:text-bg-primary",
                        "shadow-lg hover:shadow-xl",
                        // Accessibility
                        "focus:outline-none focus:ring-4 focus:ring-gray-500/50",
                        "active:scale-95"
                      )}
                      aria-label="Sign in to your account"
                    >
                      <span className="relative z-10 flex items-center">
                        <PlayCircleIcon className="w-5 h-5 mr-2" />
                        Sign In
                      </span>
                    </Link>
                  </motion.div>
                </>
              )}
            </motion.div>

            {/* Enhanced Trust Indicators */}
            <motion.div
              className="flex flex-wrap justify-center items-center gap-12 mt-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              role="region"
              aria-label="Platform statistics and ratings"
            >
              <motion.div
                className="flex items-center space-x-3 group"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={cn(
                        "w-9 h-9 rounded-full border-2 relative overflow-hidden",
                        "bg-gradient-to-br from-gray-400 to-gray-600 dark:from-gray-600 dark:to-gray-400",
                        themeClasses.borderPrimary
                      )}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        delay: 1.3 + i * 0.1,
                        duration: 0.5,
                        type: "spring",
                        stiffness: 200,
                      }}
                      whileHover={{ scale: 1.1, zIndex: 10 }}
                    >
                      {/* Simulated avatar pattern */}
                      <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                    </motion.div>
                  ))}
                </div>
                <div className="text-left">
                  <span
                    className={cn(
                      "text-sm font-bold",
                      themeClasses.textPrimary
                    )}
                  >
                    10,000+
                  </span>
                  <p className={cn("text-xs", themeClasses.textSecondary)}>
                    active learners
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center space-x-3 group"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        delay: 1.4 + i * 0.1,
                        duration: 0.4,
                        type: "spring",
                        stiffness: 300,
                      }}
                      whileHover={{
                        scale: 1.2,
                        rotate: [0, -10, 10, 0],
                        transition: { duration: 0.3 },
                      }}
                    >
                      <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </motion.div>
                  ))}
                </div>
                <div className="text-left">
                  <span
                    className={cn(
                      "text-sm font-bold",
                      themeClasses.textPrimary
                    )}
                  >
                    4.9/5
                  </span>
                  <p className={cn("text-xs", themeClasses.textSecondary)}>
                    user rating
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="flex items-center space-x-3 group"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    "bg-gradient-to-r from-gray-600 to-gray-700 dark:from-gray-400 dark:to-gray-300"
                  )}
                  animate={
                    shouldReduceMotion
                      ? {}
                      : {
                          boxShadow: [
                            "0 0 0 0 rgba(34, 197, 94, 0.4)",
                            "0 0 0 8px rgba(34, 197, 94, 0)",
                          ],
                        }
                  }
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <GlobeAltIcon className="w-4 h-4 text-white" />
                </motion.div>
                <div className="text-left">
                  <span
                    className={cn(
                      "text-sm font-bold",
                      themeClasses.textPrimary
                    )}
                  >
                    Global
                  </span>
                  <p className={cn("text-xs", themeClasses.textSecondary)}>
                    community
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-500/50 dark:focus:ring-gray-400/50 rounded-full p-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          role="button"
          aria-label="Scroll down to see more content"
          tabIndex={0}
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight,
              behavior: "smooth",
            });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              window.scrollTo({
                top: window.innerHeight,
                behavior: "smooth",
              });
            }
          }}
          whileHover={{ scale: 1.1 }}
        >
          <motion.div
            animate={shouldReduceMotion ? {} : { y: [0, 8, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div
              className={cn(
                "w-6 h-10 border-2 rounded-full flex justify-center relative",
                "border-white/40 dark:border-white/30"
              )}
            >
              <motion.div
                className="w-1 h-3 bg-white/70 rounded-full mt-2"
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        y: [0, 12, 0],
                        opacity: [0.7, 1, 0.7],
                      }
                }
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Clean Trust Indicators */}
      <section className="py-24 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="text-center"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    className={cn(
                      "w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center",
                      themeClasses.bgSecondary,
                      themeClasses.textPrimary
                    )}
                    whileHover={{ rotate: 5 }}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.div>
                  <motion.div
                    className={cn(
                      "text-3xl font-bold mb-2",
                      "font-['Poppins',_sans-serif]",
                      themeClasses.textPrimary
                    )}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className={cn("text-sm", themeClasses.textSecondary)}>
                    {stat.label}
                  </div>
                  <div className={cn("text-xs mt-1", themeClasses.textMuted)}>
                    {stat.description}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Clean Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2
              className={cn(
                "text-4xl font-bold mb-6",
                "font-['Poppins',_sans-serif]",
                themeClasses.textPrimary
              )}
            >
              Why Choose SkillBarter?
            </h2>
            <p
              className={cn(
                "text-xl max-w-3xl mx-auto",
                themeClasses.textSecondary
              )}
            >
              Experience the future of learning with our innovative platform
              designed for{" "}
              <span className={cn("font-medium", themeClasses.textPrimary)}>
                modern professionals
              </span>
              .
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className={cn(
                    "p-8 rounded-2xl border transition-all duration-300",
                    themeClasses.bgSecondary,
                    themeClasses.borderSecondary,
                    "hover:border-gray-300 dark:hover:border-gray-600",
                    "hover:shadow-lg"
                  )}
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <motion.div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center mb-6",
                      themeClasses.bgTertiary,
                      themeClasses.textPrimary
                    )}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.div>
                  <h3
                    className={cn(
                      "text-xl font-bold mb-4",
                      "font-['Poppins',_sans-serif]",
                      themeClasses.textPrimary
                    )}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={cn(
                      "leading-relaxed",
                      themeClasses.textSecondary
                    )}
                  >
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Clean CTA Section */}
      {!isAuthenticated && (
        <section
          className={cn(
            "py-24 border-t border-gray-200 dark:border-gray-800",
            themeClasses.bgSecondary
          )}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2
                className={cn(
                  "text-4xl font-bold mb-6",
                  "font-['Poppins',_sans-serif]",
                  themeClasses.textPrimary
                )}
              >
                Ready to Start Your Journey?
              </h2>
              <p
                className={cn(
                  "text-xl mb-10 max-w-2xl mx-auto",
                  themeClasses.textSecondary
                )}
              >
                Join thousands of learners and teachers building skills together
                in our professional community.
              </p>
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/register"
                  className={cn(
                    "inline-flex items-center px-10 py-4 text-lg font-semibold rounded-2xl",
                    "font-['Poppins',_sans-serif]",
                    "bg-gray-900 dark:bg-white text-white dark:text-gray-900",
                    "hover:bg-gray-800 dark:hover:bg-gray-100",
                    "shadow-xl hover:shadow-2xl transition-all duration-300",
                    "border border-gray-900 dark:border-white",
                    "focus:outline-none focus:ring-4 focus:ring-gray-500/50"
                  )}
                >
                  <RocketLaunchIcon className="w-5 h-5 mr-2" />
                  Get Started Today
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}
    </motion.div>
  );
};

export default HomePage;

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
import chatGPTImage from "../assets/images/ChatGPT Image Jun 23, 2025, 08_43_29 AM.png";

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
      {" "}
      {/* Full-Screen Hero Section with Background Image */}
      <section
        className="relative overflow-hidden h-screen flex items-center justify-center"
        role="banner"
        aria-label="Welcome to SkillBarter"
      >
        {/* Full-Screen Background Image */}
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <img
            src={chatGPTImage}
            alt="SkillBarter platform illustration showing people collaborating and learning together"
            className="w-full h-full object-cover object-center"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
          {/* Gradient overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        </motion.div>

        {/* Centered Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-20">
          {/* Main Heading */}
          <motion.h1
            className={cn(
              "text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6",
              "font-['Poppins',_sans-serif]",
              "text-white drop-shadow-2xl leading-tight"
            )}
            variants={heroVariants.heading}
            initial="hidden"
            animate="visible"
          >
            Learn. Teach.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
              Exchange.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className={cn(
              "text-lg sm:text-xl lg:text-2xl mb-8 sm:mb-12 max-w-2xl mx-auto",
              "text-gray-200 drop-shadow-lg font-medium leading-relaxed"
            )}
            variants={heroVariants.subtitle}
            initial="hidden"
            animate="visible"
          >
            Connect with peers, share skills, and grow together in our vibrant
            learning community.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            className="flex justify-center"
            variants={heroVariants.cta}
            initial="hidden"
            animate="visible"
          >
            {isAuthenticated ? (
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <Link
                  to="/dashboard"
                  className={cn(
                    "relative px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full",
                    "transition-all duration-300 inline-flex items-center justify-center",
                    "font-['Poppins',_sans-serif]",
                    "bg-white text-gray-900 hover:bg-gray-100",
                    "shadow-2xl hover:shadow-3xl",
                    "border-2 border-white/20",
                    "focus:outline-none focus:ring-4 focus:ring-white/30",
                    "backdrop-blur-sm"
                  )}
                  aria-label="Navigate to your dashboard"
                >
                  <span className="flex items-center">
                    Go to Dashboard
                    <motion.div
                      className="ml-3"
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
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <Link
                  to="/register"
                  className={cn(
                    "relative px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full",
                    "transition-all duration-300 inline-flex items-center justify-center",
                    "font-['Poppins',_sans-serif]",
                    "bg-white text-gray-900 hover:bg-gray-100",
                    "shadow-2xl hover:shadow-3xl",
                    "border-2 border-white/20",
                    "focus:outline-none focus:ring-4 focus:ring-white/30",
                    "backdrop-blur-sm"
                  )}
                  aria-label="Create your free account"
                >
                  <span className="flex items-center">
                    <RocketLaunchIcon className="w-5 h-5 mr-3" />
                    Start Learning
                  </span>
                </Link>
              </motion.div>
            )}
          </motion.div>
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

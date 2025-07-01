import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  AcademicCapIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  SparklesIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  StarIcon,
  PlayCircleIcon,
  GlobeAltIcon,
  ChevronDownIcon,
  ArrowRightIcon,
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
      {/* Modern Hero Section with ChatGPT Background */}
      <section className="relative overflow-hidden min-h-screen flex items-center justify-center">
        {/* ChatGPT Background Image */}
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
          {/* Modern gradient overlays for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

          {/* Animated gradient overlay for modern effect */}
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              background: [
                "radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 20%, rgba(0, 0, 0, 0.2) 0%, transparent 50%)",
                "radial-gradient(circle at 40% 40%, rgba(128, 128, 128, 0.15) 0%, transparent 50%)",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />

          {/* Floating Particles */}
          <motion.div
            className="absolute inset-0 opacity-10"
            style={{
              background:
                "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)",
              backgroundSize: "50px 50px",
            }}
            animate={{
              backgroundPosition: ["0px 0px", "50px 50px"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          {/* Premium Badge */}
          <motion.div
            className="inline-flex items-center space-x-3 px-6 py-3 rounded-full mb-8 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl"
            variants={heroVariants.badge}
            initial="hidden"
            animate="visible"
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(255, 255, 255, 0.15)",
            }}
          >
            <SparklesIcon className="h-5 w-5 text-gray-300" />
            <span className="text-white font-semibold text-sm tracking-wide font-['Poppins',_sans-serif]">
              Next-Generation Learning Platform
            </span>
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          </motion.div>

          {/* Main Heading with Gradient Text */}
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 font-['Poppins',_sans-serif] leading-tight"
            variants={heroVariants.heading}
            initial="hidden"
            animate="visible"
          >
            <span className="text-white">Learn. </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-white to-gray-400">
              Teach.
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-300">
              Exchange.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl sm:text-2xl lg:text-3xl mb-12 max-w-4xl mx-auto text-gray-300 font-medium leading-relaxed"
            variants={heroVariants.subtitle}
            initial="hidden"
            animate="visible"
          >
            Connect with peers, share expertise, and grow together in our{" "}
            <span className="text-white font-semibold">
              vibrant learning ecosystem
            </span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={heroVariants.cta}
            initial="hidden"
            animate="visible"
          >
            {isAuthenticated ? (
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/dashboard"
                  className="px-10 py-4 text-lg font-semibold rounded-2xl bg-white text-black hover:bg-gray-100 shadow-2xl border border-gray-300 backdrop-blur-sm transition-all duration-300 inline-flex items-center font-['Poppins',_sans-serif]"
                >
                  <span className="flex items-center">
                    Go to Dashboard
                    <ArrowRightIcon className="w-5 h-5 ml-3" />
                  </span>
                </Link>
              </motion.div>
            ) : (
              <>
                <motion.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/register"
                    className="px-10 py-4 text-lg font-semibold rounded-2xl bg-white text-black hover:bg-gray-100 shadow-2xl border border-gray-300 backdrop-blur-sm transition-all duration-300 inline-flex items-center font-['Poppins',_sans-serif]"
                  >
                    <RocketLaunchIcon className="w-5 h-5 mr-3" />
                    Start Learning
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/discover"
                    className="px-10 py-4 text-lg font-semibold rounded-2xl bg-black/30 text-white hover:bg-black/40 border border-white/30 backdrop-blur-sm transition-all duration-300 inline-flex items-center font-['Poppins',_sans-serif]"
                  >
                    <LightBulbIcon className="w-5 h-5 mr-3" />
                    Explore Skills
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          onClick={() =>
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
          }
          whileHover={{ scale: 1.1 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 rounded-full flex justify-center border-white/40"
          >
            <motion.div
              className="w-1 h-3 bg-white/70 rounded-full mt-2"
              animate={{ y: [0, 12, 0], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </section>
      {/* Premium Stats Section */}
      <section className={cn("py-24", themeClasses.bgPrimary)}>
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
                "text-4xl font-bold mb-6 font-['Poppins',_sans-serif]",
                themeClasses.textPrimary
              )}
            >
              Join Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-800 dark:from-gray-300 dark:to-gray-100">
                Thriving Community
              </span>
            </h2>
            <p
              className={cn(
                "text-xl max-w-3xl mx-auto",
                themeClasses.textSecondary
              )}
            >
              Experience the power of peer-to-peer learning with thousands of
              motivated learners and experts
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const gradients = [
                "from-gray-600 to-gray-700",
                "from-gray-500 to-gray-600",
                "from-gray-700 to-gray-800",
                "from-gray-400 to-gray-500",
              ];
              const bgColors = [
                "bg-gray-50 dark:bg-gray-900/20",
                "bg-gray-100 dark:bg-gray-800/20",
                "bg-gray-200 dark:bg-gray-700/20",
                "bg-gray-50 dark:bg-gray-900/20",
              ];

              return (
                <motion.div
                  key={index}
                  className={cn(
                    "relative p-6 rounded-2xl border transition-all duration-300 group cursor-pointer",
                    themeClasses.bgSecondary,
                    "border-gray-200/50 dark:border-gray-700/50",
                    "hover:border-gray-300 dark:hover:border-gray-600",
                    "hover:shadow-xl hover:shadow-gray-500/10"
                  )}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  {/* Gradient Background */}
                  <div
                    className={cn(
                      "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br",
                      gradients[index]
                    )}
                  />

                  {/* Icon with gradient background */}
                  <div
                    className={cn(
                      "w-14 h-14 rounded-xl flex items-center justify-center mb-4 mx-auto",
                      bgColors[index]
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg bg-gradient-to-r flex items-center justify-center",
                        gradients[index]
                      )}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {/* Value with animated counter */}
                  <motion.div
                    className={cn(
                      "text-3xl font-bold mb-2 text-center font-['Poppins',_sans-serif]",
                      themeClasses.textPrimary
                    )}
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: index * 0.1 + 0.5,
                      type: "spring",
                      stiffness: 200,
                    }}
                    viewport={{ once: true }}
                  >
                    {stat.value}
                  </motion.div>

                  {/* Label */}
                  <div
                    className={cn(
                      "text-sm font-medium text-center",
                      themeClasses.textSecondary
                    )}
                  >
                    {stat.label}
                  </div>

                  {/* Description */}
                  <div
                    className={cn(
                      "text-xs mt-2 text-center",
                      themeClasses.textMuted
                    )}
                  >
                    {stat.description}
                  </div>

                  {/* Hover glow effect */}
                  <motion.div
                    className={cn(
                      "absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-20 blur-lg bg-gradient-to-r transition-opacity duration-300",
                      gradients[index]
                    )}
                    style={{ zIndex: -1 }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
      {/* Premium Features Section */}
      <section className={cn("py-24", themeClasses.bgSecondary)}>
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
                "text-4xl font-bold mb-6 font-['Poppins',_sans-serif]",
                themeClasses.textPrimary
              )}
            >
              Why Choose{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-800 dark:from-gray-300 dark:to-gray-100">
                SkillBarter
              </span>
              ?
            </h2>
            <p
              className={cn(
                "text-xl max-w-3xl mx-auto",
                themeClasses.textSecondary
              )}
            >
              Experience the future of learning with our innovative platform
              designed for{" "}
              <span
                className={cn(
                  "font-medium text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-800 dark:from-gray-300 dark:to-gray-100"
                )}
              >
                modern professionals
              </span>
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
              const gradients = [
                "from-gray-600 to-gray-700",
                "from-gray-500 to-gray-600",
                "from-gray-700 to-gray-800",
                "from-gray-400 to-gray-500",
              ];
              const bgColors = [
                "bg-gray-50 dark:bg-gray-900/20",
                "bg-gray-100 dark:bg-gray-800/20",
                "bg-gray-200 dark:bg-gray-700/20",
                "bg-gray-50 dark:bg-gray-900/20",
              ];

              return (
                <motion.div
                  key={index}
                  className={cn(
                    "relative p-8 rounded-3xl border transition-all duration-500 group cursor-pointer overflow-hidden",
                    themeClasses.bgPrimary,
                    "border-gray-200/50 dark:border-gray-700/50",
                    "hover:border-gray-300 dark:hover:border-gray-600",
                    "hover:shadow-2xl hover:shadow-gray-500/20"
                  )}
                  variants={cardVariants}
                  whileHover="hover"
                >
                  {/* Animated Background Gradient */}
                  <motion.div
                    className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br",
                      gradients[index]
                    )}
                    initial={false}
                  />

                  {/* Floating particles effect */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                    style={{
                      background:
                        "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)",
                      backgroundSize: "20px 20px",
                    }}
                    animate={{
                      backgroundPosition: ["0px 0px", "20px 20px"],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />

                  {/* Icon with premium styling */}
                  <motion.div
                    className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 relative",
                      bgColors[index]
                    )}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl bg-gradient-to-r flex items-center justify-center shadow-lg",
                        gradients[index]
                      )}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Glow effect */}
                    <motion.div
                      className={cn(
                        "absolute inset-0 rounded-2xl blur-lg bg-gradient-to-r opacity-0 group-hover:opacity-40 transition-opacity duration-300",
                        gradients[index]
                      )}
                      style={{ zIndex: -1 }}
                    />
                  </motion.div>

                  {/* Title */}
                  <h3
                    className={cn(
                      "text-xl font-bold mb-4 font-['Poppins',_sans-serif]",
                      themeClasses.textPrimary
                    )}
                  >
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={cn(
                      "leading-relaxed",
                      themeClasses.textSecondary
                    )}
                  >
                    {feature.description}
                  </p>

                  {/* Hover border effect */}
                  <motion.div
                    className={cn(
                      "absolute -inset-0.5 rounded-3xl opacity-0 group-hover:opacity-50 blur-sm bg-gradient-to-r transition-opacity duration-300",
                      gradients[index]
                    )}
                    style={{ zIndex: -2 }}
                  />
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

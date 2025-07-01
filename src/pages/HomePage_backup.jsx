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
import heroIllustration from "../assets/images/hero-illustration.png";

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
      {/* Clean, Professional Hero Section - Minimal Google Careers Style */}
      <section
        className="relative overflow-hidden min-h-screen flex items-center"
        role="banner"
        aria-label="Welcome to SkillBarter"
      >
        {/* Pure Theme-Aware Background */}
        <div className={cn("absolute inset-0", themeClasses.bgPrimary)}>
          {/* Subtle Background Pattern - Respects reduced motion */}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            {/* Left Column - Minimal Text Content */}
            <div className="text-center lg:text-left max-w-lg mx-auto lg:mx-0 order-2 lg:order-1">
              {/* Enhanced Glassmorphism Badge */}
              <motion.div
                className={cn(
                  "inline-flex items-center space-x-3 px-8 py-4 rounded-full mb-16",
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
                  className={cn(
                    "w-2 h-2 rounded-full",
                    themeClasses.textAccent
                  )}
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

              {/* Clean CTA Button */}
              <motion.div
                className="flex justify-center lg:justify-start"
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
                        "relative px-12 py-5 text-lg font-semibold rounded-2xl",
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
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative group"
                  >
                    <Link
                      to="/register"
                      className={cn(
                        "relative px-12 py-5 text-lg font-semibold rounded-2xl",
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
                        <RocketLaunchIcon className="w-5 h-5 mr-3" />
                        Start Learning
                      </span>
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Right Column - Constrained Hero Illustration (Max 500px) */}
            <div className="flex justify-center lg:justify-end order-1 lg:order-2">
              <motion.div
                className="relative w-full max-w-[500px] mx-auto"
                initial={{ opacity: 0, scale: 0.8, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{
                  delay: 0.6,
                  duration: 1.2,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                whileHover={{ y: -8 }}
              >
                {/* Enhanced card container with multiple layers */}
                <motion.div
                  className="relative group cursor-pointer"
                  whileHover="hover"
                  initial="rest"
                  animate="rest"
                  variants={{
                    rest: {
                      y: 0,
                      rotateX: 0,
                      rotateY: 0,
                    },
                    hover: {
                      y: -12,
                      rotateX: 5,
                      rotateY: 5,
                      transition: {
                        duration: 0.4,
                        ease: "easeOut",
                      },
                    },
                  }}
                  style={{ perspective: 1000 }}
                >
                  {/* Enhanced glow with multiple layers */}
                  <motion.div
                    className={cn(
                      "absolute -inset-6 rounded-3xl blur-2xl -z-20",
                      "bg-gray-300/20 dark:bg-gray-600/30"
                    )}
                    variants={{
                      rest: {
                        scale: 1,
                        opacity: 0.15,
                      },
                      hover: {
                        scale: 1.1,
                        opacity: 0.3,
                        transition: { duration: 0.4 },
                      },
                    }}
                  />

                  {/* Outer shadow layer */}
                  <motion.div
                    className={cn(
                      "absolute -inset-2 rounded-2xl -z-10",
                      "bg-gradient-to-br from-white/5 to-black/5",
                      "dark:from-white/10 dark:to-black/10",
                      "shadow-2xl"
                    )}
                    variants={{
                      rest: {
                        scale: 1,
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                      },
                      hover: {
                        scale: 1.02,
                        boxShadow: "0 35px 60px -12px rgba(0, 0, 0, 0.35)",
                        transition: { duration: 0.4 },
                      },
                    }}
                  />

                  {/* Main card border */}
                  <motion.div
                    className={cn(
                      "absolute -inset-px rounded-2xl -z-5",
                      "bg-gradient-to-br from-white/20 via-transparent to-black/20",
                      "dark:from-white/30 dark:via-transparent dark:to-black/30"
                    )}
                    variants={{
                      rest: { opacity: 0.5 },
                      hover: {
                        opacity: 0.8,
                        transition: { duration: 0.4 },
                      },
                    }}
                  />

                  {/* Image container */}
                  <motion.div
                    className={cn(
                      "relative overflow-hidden rounded-2xl",
                      "bg-gradient-to-br from-gray-50 to-gray-100",
                      "dark:from-gray-900 dark:to-gray-800",
                      "border border-gray-200/50 dark:border-gray-700/50"
                    )}
                    variants={{
                      rest: {
                        borderColor: "rgba(156, 163, 175, 0.3)",
                      },
                      hover: {
                        borderColor: "rgba(156, 163, 175, 0.6)",
                        transition: { duration: 0.4 },
                      },
                    }}
                  >
                    {/* Main illustration */}
                    <motion.img
                      src={heroIllustration}
                      alt="SkillBarter platform illustration showing people collaborating and learning together"
                      className={cn(
                        "w-full h-auto max-w-[500px]",
                        "filter brightness-105 contrast-105",
                        // Theme-aware filter adjustments
                        "dark:brightness-95 dark:contrast-110"
                      )}
                      variants={{
                        rest: {
                          scale: 1,
                          filter: "brightness(105%) contrast(105%)",
                        },
                        hover: {
                          scale: 1.05,
                          filter: "brightness(110%) contrast(110%)",
                          transition: { duration: 0.4 },
                        },
                      }}
                    />

                    {/* Overlay shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                      variants={{
                        rest: { x: "-100%" },
                        hover: {
                          x: "100%",
                          transition: {
                            duration: 0.8,
                            ease: "easeInOut",
                            delay: 0.1,
                          },
                        },
                      }}
                    />
                  </motion.div>

                  {/* Premium floating accent elements */}
                  <motion.div
                    className={cn(
                      "absolute -top-3 -right-3 w-6 h-6 rounded-full",
                      "bg-gradient-to-br from-gray-400 to-gray-600 dark:from-gray-600 dark:to-gray-400",
                      "shadow-xl border border-white/20"
                    )}
                    variants={{
                      rest: {
                        y: 0,
                        rotate: 0,
                        scale: 1,
                      },
                      hover: {
                        y: -4,
                        rotate: 15,
                        scale: 1.1,
                        transition: { duration: 0.3, delay: 0.1 },
                      },
                    }}
                    animate={
                      shouldReduceMotion
                        ? {}
                        : {
                            rotate: [0, 5, -5, 0],
                          }
                    }
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />

                  <motion.div
                    className={cn(
                      "absolute -bottom-3 -left-3 w-4 h-4 rounded-full",
                      "bg-gradient-to-br from-gray-500 to-gray-700 dark:from-gray-700 dark:to-gray-500",
                      "shadow-lg border border-white/20"
                    )}
                    variants={{
                      rest: {
                        y: 0,
                        rotate: 0,
                        scale: 1,
                      },
                      hover: {
                        y: -3,
                        rotate: -12,
                        scale: 1.1,
                        transition: { duration: 0.3, delay: 0.2 },
                      },
                    }}
                    animate={
                      shouldReduceMotion
                        ? {}
                        : {
                            rotate: [0, -8, 8, 0],
                          }
                    }
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 2,
                    }}
                  />
                </motion.div>
              </motion.div>
            </div>
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
          whileHover={{ y: -2, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className={cn(
              "flex flex-col items-center space-y-3",
              themeClasses.textSecondary
            )}
            animate={
              shouldReduceMotion
                ? {}
                : {
                    y: [0, 8, 0],
                  }
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="text-xs font-medium tracking-wider uppercase opacity-70">
              Scroll
            </span>
            <ChevronDownIcon className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* Clean Trust Indicators */}
      <section className="py-24 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className={cn(
                  "flex flex-col items-center text-center p-8 rounded-2xl",
                  "bg-white/50 dark:bg-black/20 backdrop-blur-sm",
                  "border border-gray-200/50 dark:border-gray-700/50",
                  "hover:bg-white/70 dark:hover:bg-black/30 transition-all duration-300",
                  "shadow-lg hover:shadow-xl"
                )}
                variants={cardVariants}
                whileHover="hover"
              >
                <stat.icon
                  className={cn("w-8 h-8 mb-4", themeClasses.textSecondary)}
                />
                <div
                  className={cn(
                    "text-3xl font-bold mb-2",
                    themeClasses.textPrimary
                  )}
                >
                  {stat.value}
                </div>
                <div
                  className={cn(
                    "text-sm font-medium mb-1",
                    themeClasses.textPrimary
                  )}
                >
                  {stat.label}
                </div>
                <div className={cn("text-xs", themeClasses.textSecondary)}>
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Clean Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className={cn(
                "text-3xl lg:text-4xl font-bold mb-4",
                themeClasses.textPrimary
              )}
            >
              Why Choose SkillBarter?
            </h2>
            <p
              className={cn(
                "text-lg max-w-2xl mx-auto",
                themeClasses.textSecondary
              )}
            >
              Experience peer-to-peer learning like never before with our
              comprehensive platform.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={cn(
                  "flex flex-col items-center text-center p-8 rounded-2xl",
                  "bg-white/50 dark:bg-black/20 backdrop-blur-sm",
                  "border border-gray-200/50 dark:border-gray-700/50",
                  "hover:bg-white/70 dark:hover:bg-black/30 transition-all duration-300",
                  "shadow-lg hover:shadow-xl"
                )}
                variants={cardVariants}
                whileHover="hover"
              >
                <feature.icon
                  className={cn("w-12 h-12 mb-6", themeClasses.textSecondary)}
                />
                <h3
                  className={cn(
                    "text-xl font-semibold mb-4",
                    themeClasses.textPrimary
                  )}
                >
                  {feature.title}
                </h3>
                <p
                  className={cn(
                    "text-sm leading-relaxed",
                    themeClasses.textSecondary
                  )}
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Clean CTA Section */}
      {!isAuthenticated && (
        <section
          className={cn(
            "py-24 border-t border-gray-200 dark:border-gray-800",
            "bg-gradient-to-br from-gray-50/50 to-gray-100/50 dark:from-gray-900/50 dark:to-gray-800/50"
          )}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2
                className={cn(
                  "text-3xl lg:text-4xl font-bold mb-6",
                  themeClasses.textPrimary
                )}
              >
                Ready to Start Learning?
              </h2>
              <p
                className={cn(
                  "text-lg mb-12 max-w-2xl mx-auto",
                  themeClasses.textSecondary
                )}
              >
                Join thousands of learners and teachers in our growing
                community. Your next skill is just a session away.
              </p>

              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="inline-block"
              >
                <Link
                  to="/register"
                  className={cn(
                    "px-12 py-5 text-lg font-semibold rounded-2xl",
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

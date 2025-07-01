import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpIcon, HeartIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { themeClasses, cn } from "../../utils/theme";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        themeClasses.bgSecondary,
        "border-t",
        themeClasses.borderSecondary,
        "relative mt-auto"
      )}
      role="contentinfo"
    >
      {/* Scroll to top button */}
      <motion.button
        onClick={scrollToTop}
        className={cn(
          "absolute -top-6 right-8 w-12 h-12 rounded-full transition-all duration-300",
          "bg-gray-900 dark:bg-gray-100",
          "text-white dark:text-gray-900",
          "shadow-lg",
          "hover:shadow-xl hover:scale-110 hover:-translate-y-1",
          "focus:outline-none focus:ring-2 focus:ring-gray-500/30"
        )}
        whileHover={{ scale: 1.1, y: -4 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Scroll to top of page"
        title="Scroll to top"
      >
        <ArrowUpIcon className="w-5 h-5 mx-auto" />
      </motion.button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          {/* Main content */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            {/* Brand */}
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center",
                  "bg-gray-900 dark:bg-gray-100",
                  "shadow-md"
                )}
              >
                <span
                  className={cn(
                    "font-mono font-bold text-sm",
                    "text-white dark:text-gray-900"
                  )}
                >
                  SB
                </span>
              </div>
              <div>
                <span
                  className={cn(
                    "text-xl font-['Poppins',_sans-serif] font-bold",
                    themeClasses.textPrimary
                  )}
                >
                  SkillBarter
                </span>
                <p className={cn("text-xs", themeClasses.textMuted)}>
                  Learn & Share
                </p>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              className="flex items-center space-x-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                to="/discover"
                className={cn(
                  "text-sm transition-colors",
                  themeClasses.textMuted,
                  "hover:text-gray-900 dark:hover:text-gray-100"
                )}
              >
                Discover
              </Link>
              <Link
                to="/sessions"
                className={cn(
                  "text-sm transition-colors",
                  themeClasses.textMuted,
                  "hover:text-gray-900 dark:hover:text-gray-100"
                )}
              >
                Sessions
              </Link>
              <a
                href="#"
                className={cn(
                  "text-sm transition-colors",
                  themeClasses.textMuted,
                  "hover:text-gray-900 dark:hover:text-gray-100"
                )}
              >
                Help
              </a>
            </motion.div>
          </div>

          {/* Bottom section */}
          <div
            className={cn("mt-8 pt-6 border-t", themeClasses.borderSecondary)}
          >
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <motion.div
                className="flex items-center space-x-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <p className={cn("text-sm", themeClasses.textMuted)}>
                  © {currentYear} SkillBarter
                </p>
                <span
                  className={cn(
                    "hidden sm:block w-1 h-1 bg-current rounded-full",
                    themeClasses.textMuted
                  )}
                />
                <p
                  className={cn(
                    "text-xs flex items-center",
                    themeClasses.textMuted
                  )}
                >
                  Made with{" "}
                  <HeartIcon className="w-3 h-3 mx-1 text-gray-600 dark:text-gray-400" />
                  for learners
                </p>
              </motion.div>

              <motion.div
                className="flex items-center space-x-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <a
                  href="https://linkedin.com/in/ashishrajput0904"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "text-sm transition-colors",
                    themeClasses.textMuted,
                    "hover:text-gray-900 dark:hover:text-gray-100"
                  )}
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com/ashish6318"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "text-sm transition-colors",
                    themeClasses.textMuted,
                    "hover:text-gray-900 dark:hover:text-gray-100"
                  )}
                >
                  GitHub
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

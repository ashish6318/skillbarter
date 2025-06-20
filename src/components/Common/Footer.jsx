import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpIcon, HeartIcon } from "@heroicons/react/24/outline";
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
      <button
        onClick={scrollToTop}
        className={cn(
          "absolute -top-6 right-8 w-12 h-12 rounded-full transition-all duration-300",
          "bg-gradient-to-r from-accent-primary to-accent-hover",
          themeClasses.textInverse,
          themeClasses.shadowLg,
          "hover:shadow-[var(--shadow-xl)] hover:scale-110 hover:-translate-y-1",
          "focus:outline-none focus:ring-2 focus:ring-accent-primary/30"
        )}
        aria-label="Scroll to top of page"
        title="Scroll to top"
      >
        <ArrowUpIcon className="w-5 h-5 mx-auto" />
      </button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          {/* Main content */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            {/* Brand */}
            <div className="flex items-center space-x-3">
              {" "}
              <div
                className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center",
                  "bg-gradient-to-br from-accent-primary to-accent-hover",
                  themeClasses.shadowMd
                )}
              >
                <span
                  className={cn(
                    "font-mono font-bold text-sm",
                    themeClasses.textInverse
                  )}
                >
                  SB
                </span>
              </div>
              <div>
                <span
                  className={cn(
                    "text-xl font-mono font-bold",
                    themeClasses.textPrimary
                  )}
                >
                  SkillBarter
                </span>
                <p className={cn("text-xs font-mono", themeClasses.textMuted)}>
                  Learn & Share
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex items-center space-x-8">
              <Link
                to="/discover"
                className={cn(
                  "text-sm font-mono transition-colors",
                  themeClasses.textMuted,
                  "hover:text-accent-primary"
                )}
              >
                Discover
              </Link>
              <Link
                to="/sessions"
                className={cn(
                  "text-sm font-mono transition-colors",
                  themeClasses.textMuted,
                  "hover:text-accent-primary"
                )}
              >
                Sessions
              </Link>
              <a
                href="#"
                className={cn(
                  "text-sm font-mono transition-colors",
                  themeClasses.textMuted,
                  "hover:text-accent-primary"
                )}
              >
                Help
              </a>
            </div>
          </div>

          {/* Bottom section */}
          <div
            className={cn("mt-8 pt-6 border-t", themeClasses.borderSecondary)}
          >
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <p className={cn("text-sm font-mono", themeClasses.textMuted)}>
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
                    "text-xs font-mono flex items-center",
                    themeClasses.textMuted
                  )}
                >
                  Made with <HeartIcon className="w-3 h-3 mx-1 text-red-500" />
                  for learners
                </p>
              </div>{" "}
              <div className="flex items-center space-x-6">
                <a
                  href="https://linkedin.com/in/ashishrajput0904"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "text-sm font-mono transition-colors",
                    themeClasses.textMuted,
                    "hover:text-accent-primary"
                  )}
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com/ashish6318"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "text-sm font-mono transition-colors",
                    themeClasses.textMuted,
                    "hover:text-accent-primary"
                  )}
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

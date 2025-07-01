import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  CreditCardIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useState, useRef, useEffect } from "react";
import NotificationCenter from "../Notifications/NotificationCenter";
import ThemeToggle from "./ThemeToggle";
import { themeClasses, componentPatterns, cn } from "../../utils/theme";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { isConnected } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsProfileDropdownOpen(false);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation for dropdown
  const handleDropdownKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsProfileDropdownOpen(false);
    }
  };

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Discover", href: "/discover", icon: MagnifyingGlassIcon },
    { name: "Messages", href: "/messages", icon: ChatBubbleLeftRightIcon },
    { name: "Sessions", href: "/sessions", icon: CalendarDaysIcon },
    { name: "Credits", href: "/credits", icon: CreditCardIcon },
  ];
  return (
    <nav
      className={cn(
        componentPatterns.navbar,
        themeClasses.transitionColors,
        "sticky top-0 z-50"
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      {" "}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand - Optimized for space */}
          <div className="flex items-center min-w-0 flex-shrink-0">
            <Link
              to="/"
              className="flex items-center space-x-2 group"
              aria-label="SkillBarter home"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  "bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-200 dark:to-gray-100",
                  "shadow-md",
                  "transition-all duration-200",
                  "active:scale-95 active:shadow-sm"
                )}
              >
                <span
                  className={cn(
                    "font-mono font-bold text-base",
                    "text-white dark:text-gray-900"
                  )}
                >
                  SB
                </span>
              </div>
              <div className="flex flex-col justify-center">
                <span
                  className={cn(
                    "text-lg sm:text-xl font-mono font-bold leading-tight",
                    themeClasses.textPrimary
                  )}
                >
                  <span className="hidden sm:inline">SkillBarter</span>
                  <span className="sm:hidden">SB</span>
                </span>
                <span
                  className={cn(
                    "hidden md:block text-xs font-mono leading-none",
                    themeClasses.textMuted
                  )}
                >
                  by Ashish Rajput
                </span>
              </div>
            </Link>
          </div>{" "}
          {/* Desktop Navigation - Centered with compact spacing */}
          {isAuthenticated && (
            <div className="hidden lg:flex items-center justify-center flex-1 px-4">
              <div className="flex items-center space-x-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveRoute(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "relative flex items-center px-3 py-2 rounded-xl text-sm font-medium",
                        "transition-all duration-200",
                        isActive
                          ? cn(
                              "bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-200 dark:to-gray-100",
                              "text-white dark:text-gray-900",
                              "shadow-md"
                            )
                          : cn(
                              themeClasses.textSecondary,
                              themeClasses.hover,
                              "hover:text-text-primary",
                              "active:scale-95"
                            )
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <Icon className="w-4 h-4 mr-1.5" />
                      <span className="hidden xl:inline">{item.name}</span>
                      {isActive && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-current rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}{" "}
          {/* Right side - User menu with better alignment */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {/* Connection status indicator */}
            {isAuthenticated && (
              <div
                className={cn(
                  "hidden md:flex items-center space-x-2 px-3 py-1 rounded-full",
                  themeClasses.bgTertiary
                )}
              >
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    isConnected ? "bg-green-500 animate-pulse" : "bg-red-500",
                    isConnected ? "shadow-sm" : ""
                  )}
                  title={isConnected ? "Connected" : "Disconnected"}
                  aria-label={
                    isConnected
                      ? "Connected to server"
                      : "Disconnected from server"
                  }
                />
                <span
                  className={cn(
                    "text-xs font-mono font-medium",
                    themeClasses.textMuted
                  )}
                >
                  {isConnected ? "ONLINE" : "OFFLINE"}
                </span>
              </div>
            )}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 min-w-0 flex-shrink-0">
                {/* Credits display */}
                <div
                  className={cn(
                    "hidden sm:flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all duration-200",
                    themeClasses.bgSecondary,
                    themeClasses.borderPrimary,
                    "hover:shadow-md hover:border-gray-400 dark:hover:border-gray-500"
                  )}
                >
                  <CreditCardIcon
                    className={cn(
                      "w-4 h-4",
                      "text-gray-700 dark:text-gray-300"
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm font-mono font-bold",
                      themeClasses.textPrimary
                    )}
                  >
                    {user?.credits || 0}
                  </span>
                  <span
                    className={cn("text-xs font-mono", themeClasses.textMuted)}
                  >
                    credits
                  </span>
                </div>

                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Notification Center */}
                <NotificationCenter />

                {/* Profile dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    className={cn(
                      "flex items-center space-x-3 p-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 min-w-0",
                      themeClasses.hover,
                      "focus:ring-gray-400/30 hover:scale-105 max-w-[200px]",
                      isProfileDropdownOpen &&
                        "bg-gray-100 dark:bg-gray-800 scale-105"
                    )}
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                    onKeyDown={handleDropdownKeyDown}
                    aria-expanded={isProfileDropdownOpen}
                    aria-haspopup="true"
                    aria-label="User menu"
                  >
                    {user?.profilePicture ? (
                      <div className="relative">
                        <img
                          className={cn(
                            "w-8 h-8 rounded-full object-cover ring-2 transition-all duration-200",
                            "ring-gray-300 dark:ring-gray-600",
                            "hover:ring-4 hover:ring-gray-400/50 dark:hover:ring-gray-500/50"
                          )}
                          src={user.profilePicture}
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                        <div
                          className={cn(
                            "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2",
                            isConnected ? "bg-green-500" : "bg-red-500",
                            "border-white dark:border-gray-900"
                          )}
                        />
                      </div>
                    ) : (
                      <UserCircleIcon
                        className={cn("w-8 h-8", themeClasses.textMuted)}
                      />
                    )}{" "}
                    <div className="hidden sm:block text-left min-w-0 max-w-[150px]">
                      <span
                        className={cn(
                          "block text-sm font-medium truncate",
                          themeClasses.textPrimary
                        )}
                        title={
                          `${user?.firstName || ""} ${
                            user?.lastName || ""
                          }`.trim() || "User"
                        }
                      >
                        {`${user?.firstName || ""} ${
                          user?.lastName || ""
                        }`.trim() || "User"}
                      </span>
                      <span
                        className={cn(
                          "text-xs truncate block",
                          themeClasses.textMuted
                        )}
                        title={user?.email || ""}
                      >
                        {user?.email || "@user"}
                      </span>
                    </div>
                    <ChevronDownIcon
                      className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        themeClasses.textMuted,
                        isProfileDropdownOpen && "rotate-180"
                      )}
                    />
                  </button>
                  {/* Dropdown menu */}
                  {isProfileDropdownOpen && (
                    <div
                      className={cn(
                        "absolute right-0 mt-2 w-56 rounded-2xl border shadow-xl transition-all duration-200 z-50",
                        "bg-white dark:bg-gray-900",
                        "border-gray-200 dark:border-gray-700"
                      )}
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu"
                    >
                      <div className="py-2">
                        <div
                          className={cn(
                            "px-4 py-3 border-b",
                            "border-gray-200 dark:border-gray-700"
                          )}
                        >
                          <p
                            className={cn(
                              "text-sm font-medium truncate",
                              themeClasses.textPrimary
                            )}
                            title={
                              `${user?.firstName || ""} ${
                                user?.lastName || ""
                              }`.trim() || "User"
                            }
                          >
                            {`${user?.firstName || ""} ${
                              user?.lastName || ""
                            }`.trim() || "User"}
                          </p>
                          <p
                            className={cn(
                              "text-xs truncate",
                              themeClasses.textMuted
                            )}
                            title={user?.email || ""}
                          >
                            {user?.email || "@user"}
                          </p>
                        </div>
                        <Link
                          to="/profile"
                          className={cn(
                            "flex items-center px-4 py-3 text-sm transition-colors group",
                            "text-gray-700 dark:text-gray-300",
                            "hover:bg-gray-100 dark:hover:bg-gray-800"
                          )}
                          role="menuitem"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <UserCircleIcon className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                          Profile Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className={cn(
                            "flex items-center w-full px-4 py-3 text-sm transition-colors group",
                            "text-gray-700 dark:text-gray-300",
                            "hover:bg-gray-100 dark:hover:bg-gray-800"
                          )}
                          role="menuitem"
                        >
                          <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {/* Theme Toggle for non-authenticated users */}
                <ThemeToggle />

                <Link
                  to="/login"
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-mono font-medium transition-all duration-200",
                    themeClasses.textMuted,
                    "hover:text-text-primary hover:scale-105"
                  )}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className={cn(
                    "px-6 py-2 rounded-xl text-sm font-mono font-medium transition-all duration-200 transform hover:scale-105",
                    "bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-200 dark:to-gray-100",
                    "hover:from-gray-700 hover:to-gray-800 dark:hover:from-gray-100 dark:hover:to-gray-200",
                    "text-white dark:text-gray-900",
                    "shadow-md",
                    "hover:shadow-lg"
                  )}
                >
                  Sign up
                </Link>
              </div>
            )}{" "}
            {/* Mobile menu button */}
            {isAuthenticated && (
              <button
                className={cn(
                  "lg:hidden inline-flex items-center justify-center p-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200",
                  themeClasses.textMuted,
                  "hover:text-text-primary hover:scale-105",
                  themeClasses.hover,
                  "focus:ring-accent-primary/30"
                )}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            )}
          </div>
        </div>{" "}
        {/* Mobile menu */}
        {isAuthenticated && isMobileMenuOpen && (
          <div
            className={cn(
              "lg:hidden animate-slide-up",
              "absolute top-full left-0 right-0 z-40"
            )}
          >
            <div
              className={cn(
                "mx-4 mt-2 rounded-2xl border backdrop-blur-lg",
                "border-gray-200 dark:border-gray-700",
                "bg-white/95 dark:bg-gray-900/95",
                "shadow-lg"
              )}
            >
              <div className="px-4 py-6 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveRoute(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center px-4 py-3 rounded-xl text-base font-mono font-medium transition-all duration-200 group",
                        isActive
                          ? cn(
                              "bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-200 dark:to-gray-100",
                              "text-white dark:text-gray-900",
                              "scale-105"
                            )
                          : cn(
                              themeClasses.textMuted,
                              "hover:text-text-primary hover:scale-105",
                              themeClasses.hover
                            )
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon
                        className={cn(
                          "w-5 h-5 mr-3 transition-transform group-hover:scale-110"
                        )}
                      />
                      {item.name}
                      {isActive && (
                        <div className="ml-auto w-2 h-2 bg-current rounded-full" />
                      )}
                    </Link>
                  );
                })}

                {/* Credits display on mobile */}
                <div
                  className={cn(
                    "flex items-center justify-between px-4 py-3 text-sm rounded-xl mx-0 mt-4 border",
                    themeClasses.bgTertiary,
                    themeClasses.borderSecondary
                  )}
                >
                  <div className="flex items-center">
                    <CreditCardIcon
                      className={cn(
                        "w-5 h-5 mr-3",
                        "text-gray-700 dark:text-gray-300"
                      )}
                    />
                    <span
                      className={cn(
                        "font-mono font-medium",
                        themeClasses.textPrimary
                      )}
                    >
                      Credits
                    </span>
                  </div>
                  <span
                    className={cn(
                      "font-mono font-bold text-lg",
                      themeClasses.textAccent
                    )}
                  >
                    {user?.credits || 0}
                  </span>
                </div>

                {/* Mobile profile section */}
                <div
                  className={cn(
                    "pt-4 mt-4 border-t",
                    themeClasses.borderSecondary
                  )}
                >
                  <div className="flex items-center px-4 py-3">
                    {user?.profilePicture ? (
                      <img
                        className={cn(
                          "w-10 h-10 rounded-full object-cover ring-2",
                          themeClasses.borderAccent
                        )}
                        src={user.profilePicture}
                        alt={`${user.firstName} ${user.lastName}`}
                      />
                    ) : (
                      <UserCircleIcon
                        className={cn("w-10 h-10", themeClasses.textMuted)}
                      />
                    )}
                    <div className="ml-3 flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm font-medium truncate",
                          themeClasses.textPrimary
                        )}
                        title={
                          `${user?.firstName || ""} ${
                            user?.lastName || ""
                          }`.trim() || "User"
                        }
                      >
                        {`${user?.firstName || ""} ${
                          user?.lastName || ""
                        }`.trim() || "User"}
                      </p>
                      <p
                        className={cn(
                          "text-xs truncate",
                          themeClasses.textMuted
                        )}
                        title={user?.email || ""}
                      >
                        {user?.email || "@user"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 px-2">
                    <Link
                      to="/profile"
                      className={cn(
                        "flex items-center px-4 py-3 rounded-xl text-sm font-mono transition-colors group",
                        themeClasses.textSecondary,
                        themeClasses.hover,
                        "hover:text-text-primary"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <UserCircleIcon className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={cn(
                        "flex items-center w-full px-4 py-3 rounded-xl text-sm font-mono transition-colors group",
                        themeClasses.textSecondary,
                        "hover:bg-theme-error/10 hover:text-theme-error"
                      )}
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

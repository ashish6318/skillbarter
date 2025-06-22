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
          {/* Logo and brand - More space and better alignment */}
          <div className="flex items-center min-w-0 flex-1 lg:flex-none">
            <Link
              to="/"
              className="flex items-center space-x-4 group"
              aria-label="SkillBarter home"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  "bg-gradient-to-br from-accent-primary to-accent-hover",
                  themeClasses.shadowMd,
                  "transition-all duration-200",
                  "active:scale-95 active:shadow-sm"
                )}
              >
                <span
                  className={cn(
                    "font-mono font-bold text-base",
                    themeClasses.textInverse
                  )}
                >
                  SB
                </span>
              </div>
              <div className="flex flex-col justify-center">
                <span
                  className={cn(
                    "text-xl font-mono font-bold leading-tight",
                    themeClasses.textPrimary
                  )}
                >
                  SkillBarter
                </span>
                <span
                  className={cn(
                    "text-xs font-mono leading-none",
                    themeClasses.textMuted
                  )}
                >
                  by Ashish Rajput
                </span>
              </div>
            </Link>
          </div>{" "}
          {/* Desktop Navigation - Centered with better spacing */}
          {isAuthenticated && (
            <div className="hidden lg:flex items-center justify-center flex-1 px-8">
              <div className="flex items-center space-x-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveRoute(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "relative flex items-center px-4 py-2 rounded-xl text-sm font-mono font-medium",
                        "transition-all duration-200",
                        isActive
                          ? cn(
                              themeClasses.gradientAccent,
                              themeClasses.textInverse,
                              themeClasses.shadowMd
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
                      <Icon className="w-4 h-4 mr-2" />
                      {item.name}
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
                    isConnected
                      ? "bg-theme-success animate-pulse"
                      : "bg-theme-error",
                    isConnected ? themeClasses.shadowSm : ""
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
              <div className="flex items-center space-x-3">
                {/* Credits display */}
                <div
                  className={cn(
                    "hidden sm:flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all duration-200",
                    themeClasses.bgSecondary,
                    themeClasses.borderPrimary,
                    "hover:shadow-[var(--shadow-md)] hover:border-border-accent"
                  )}
                >
                  <CreditCardIcon
                    className={cn("w-4 h-4", themeClasses.textAccent)}
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
                      "flex items-center space-x-3 p-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2",
                      themeClasses.hover,
                      "focus:ring-accent-primary/30 hover:scale-105",
                      isProfileDropdownOpen && "bg-bg-hover scale-105"
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
                            themeClasses.borderAccent,
                            "hover:ring-4 hover:ring-accent-primary/20"
                          )}
                          src={user.profilePicture}
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                        <div
                          className={cn(
                            "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2",
                            isConnected ? "bg-theme-success" : "bg-theme-error",
                            themeClasses.borderPrimary
                          )}
                        />
                      </div>
                    ) : (
                      <UserCircleIcon
                        className={cn("w-8 h-8", themeClasses.textMuted)}
                      />
                    )}{" "}
                    <div className="hidden sm:block text-left">
                      <span
                        className={cn(
                          "block text-sm font-mono font-medium",
                          themeClasses.textPrimary
                        )}
                      >
                        Ashish Rajput
                      </span>
                      <span
                        className={cn(
                          "text-xs font-mono",
                          themeClasses.textMuted
                        )}
                      >
                        @ashish
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
                  <div
                    className={cn(
                      "absolute right-0 mt-2 w-56 rounded-2xl border opacity-0 invisible transition-all duration-200 z-50",
                      componentPatterns.dropdown,
                      "bg-bg-primary/95 backdrop-blur-lg",
                      isProfileDropdownOpen &&
                        "opacity-100 visible transform scale-100",
                      !isProfileDropdownOpen && "scale-95"
                    )}
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                  >
                    <div className="py-2">
                      {" "}
                      <div
                        className={cn(
                          "px-4 py-3 border-b",
                          themeClasses.borderSecondary
                        )}
                      >
                        <p
                          className={cn(
                            "text-sm font-mono font-medium",
                            themeClasses.textPrimary
                          )}
                        >
                          Ashish Rajput
                        </p>
                        <p
                          className={cn(
                            "text-xs font-mono",
                            themeClasses.textMuted
                          )}
                        >
                          @ashish
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        className={cn(
                          "flex items-center px-4 py-3 text-sm font-mono transition-colors group",
                          themeClasses.textSecondary,
                          themeClasses.hover,
                          "hover:text-text-primary"
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
                          "flex items-center w-full px-4 py-3 text-sm font-mono transition-colors group",
                          themeClasses.textSecondary,
                          "hover:bg-theme-error/10 hover:text-theme-error"
                        )}
                        role="menuitem"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                        Sign out
                      </button>
                    </div>
                  </div>
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
                    themeClasses.gradientAccent,
                    themeClasses.gradientHover,
                    themeClasses.textInverse,
                    themeClasses.shadowMd,
                    "hover:shadow-[var(--shadow-lg)]"
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
                themeClasses.borderSecondary,
                "bg-bg-primary/95",
                themeClasses.shadowLg
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
                              themeClasses.gradientAccent,
                              themeClasses.textInverse,
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
                      className={cn("w-5 h-5 mr-3", themeClasses.textAccent)}
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
                    <div className="ml-3 flex-1">
                      <p
                        className={cn(
                          "text-sm font-mono font-medium",
                          themeClasses.textPrimary
                        )}
                      >
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p
                        className={cn(
                          "text-xs font-mono",
                          themeClasses.textMuted
                        )}
                      >
                        {user?.email}
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

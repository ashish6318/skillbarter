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
} from "@heroicons/react/24/outline";
import { useState } from "react";
import NotificationCenter from "../Notifications/NotificationCenter";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { isConnected } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Discover", href: "/discover", icon: MagnifyingGlassIcon },
    { name: "Messages", href: "/messages", icon: ChatBubbleLeftRightIcon },
    { name: "Sessions", href: "/sessions", icon: CalendarDaysIcon },
    { name: "Credits", href: "/credits", icon: CreditCardIcon },
  ];

  return (
    <nav className="bg-dark-800 shadow-lg border-b border-dark-600 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg flex items-center justify-center shadow-glow transition-transform group-hover:scale-105">
                <span className="text-white font-mono font-bold text-sm">
                  &lt;/&gt;
                </span>
              </div>
              <span className="text-xl font-mono font-bold text-dark-50 group-hover:text-accent-400 transition-all">
                SkillBarter
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-mono font-medium transition-all duration-200 ${
                      isActiveRoute(item.href)
                        ? "bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-glow"
                        : "text-dark-200 hover:text-dark-50 hover:bg-dark-700"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right side - User menu */}
          <div className="flex items-center space-x-4">
            {/* Connection status indicator */}
            {isAuthenticated && (
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    isConnected ? "bg-success-500 shadow-soft" : "bg-error-500"
                  }`}
                  title={isConnected ? "Connected" : "Disconnected"}
                />
                <span className="text-xs text-dark-400 font-mono">
                  {isConnected ? "ONLINE" : "OFFLINE"}
                </span>
              </div>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Credits display */}
                <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-dark-700 rounded-lg border border-dark-600">
                  <CreditCardIcon className="w-4 h-4 text-accent-400" />
                  <span className="text-sm font-mono font-medium text-dark-100">
                    {user?.credits || 0}
                  </span>
                </div>

                {/* Notification Center */}
                <NotificationCenter />

                {/* Profile dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-dark-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-500">
                    {user?.profilePicture ? (
                      <img
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-dark-600"
                        src={user.profilePicture}
                        alt={user.firstName + " " + user.lastName}
                      />
                    ) : (
                      <UserCircleIcon className="w-8 h-8 text-dark-400" />
                    )}
                    <span className="hidden sm:block text-sm font-mono font-medium text-dark-200">
                      {user?.firstName} {user?.lastName}
                    </span>
                  </button>

                  {/* Dropdown menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-dark-800 rounded-xl shadow-medium border border-dark-600 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 bg-glass">
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-3 text-sm font-mono text-dark-200 hover:bg-dark-700 hover:text-dark-50 transition-colors"
                      >
                        <UserCircleIcon className="w-4 h-4 mr-3" />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm font-mono text-dark-200 hover:bg-error-500 hover:text-white transition-colors"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-dark-300 hover:text-dark-50 px-4 py-2 rounded-lg text-sm font-mono font-medium transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-400 hover:to-accent-500 text-white px-6 py-2 rounded-lg text-sm font-mono font-medium transition-all duration-200 shadow-glow hover:scale-105"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            {isAuthenticated && (
              <button
                className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-dark-400 hover:text-dark-50 hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isAuthenticated && isMobileMenuOpen && (
          <div className="md:hidden animate-slide-up">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-dark-600 bg-dark-800">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-3 rounded-lg text-base font-mono font-medium transition-colors ${
                      isActiveRoute(item.href)
                        ? "bg-accent-500 text-white"
                        : "text-dark-300 hover:text-dark-50 hover:bg-dark-700"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}

              {/* Credits display on mobile */}
              <div className="flex items-center px-4 py-3 text-sm text-dark-400 bg-dark-700 rounded-lg mx-2 mt-2">
                <CreditCardIcon className="w-5 h-5 mr-3 text-accent-500" />
                <span className="font-mono">Credits: {user?.credits || 0}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

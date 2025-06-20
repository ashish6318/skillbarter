import React from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../context/ThemeContext";
import { themeClasses, cn } from "../../utils/theme";

const ThemeToggle = ({ className = "" }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "p-2 rounded-lg",
        themeClasses.transition,
        themeClasses.focus,
        themeClasses.bgSecondary,
        themeClasses.hover,
        themeClasses.textSecondary,
        "hover:scale-105",
        className
      )}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? (
        <SunIcon className="w-5 h-5 transition-transform duration-200 hover:rotate-12" />
      ) : (
        <MoonIcon className="w-5 h-5 transition-transform duration-200 hover:-rotate-12" />
      )}
    </button>
  );
};

export default ThemeToggle;

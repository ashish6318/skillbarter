import React from "react";
import { themeClasses, cn } from "../../utils/theme";

const LoadingSpinner = ({ size = "medium", className = "" }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-2",
          "border-border-primary border-t-accent-primary",
          sizeClasses[size]
        )}
      ></div>
    </div>
  );
};

export default LoadingSpinner;

import React from "react";

const LoadingSpinner = ({ size = "medium", className = "" }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-2 border-dark-600 border-t-accent-400 ${sizeClasses[size]}`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;

import React from "react";
import clsx from "clsx";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className,
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className={clsx("relative", sizeClasses[size], className)}>
      <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-pulse"></div>
      <div
        className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"
        style={{ animationDuration: "1s" }}
      ></div>
    </div>
  );
};

export default LoadingSpinner;

import React, { useEffect, useRef } from "react";
import { CheckCircle, AlertTriangle, Info, AlertCircle } from "lucide-react";
import clsx from "clsx";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  type: ToastType;
  message: string;
  visible: boolean;
  onHide: () => void;
}

const variants = {
  success: {
    icon: CheckCircle,
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  error: {
    icon: AlertTriangle,
    iconColor: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
  info: {
    icon: Info,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  warning: {
    icon: AlertCircle,
    iconColor: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
};

const CustomToast: React.FC<ToastProps> = ({
  type,
  message,
  visible,
  onHide,
}) => {
  const timeoutRef = useRef<number | null>(null);
  const Icon = variants[type].icon;

  useEffect(() => {
    if (visible) {
      timeoutRef.current = setTimeout(() => {
        onHide();
      }, 5000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [visible, onHide]);

  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div
        className={clsx(
          "flex items-center gap-3 p-4 rounded-lg border shadow-lg max-w-md",
          "backdrop-blur-sm",
          variants[type].bgColor,
          variants[type].borderColor
        )}
      >
        <div
          className={clsx(
            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
            variants[type].bgColor
          )}
        >
          <Icon className={clsx("w-5 h-5", variants[type].iconColor)} />
        </div>
        <p className="text-sm font-medium text-gray-900 flex-1">{message}</p>
        <button
          onClick={onHide}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CustomToast;

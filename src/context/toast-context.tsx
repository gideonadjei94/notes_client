import React, { createContext, useCallback, useContext, useState } from "react";
import CustomToast from "../components/common/custom-toast";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastState {
  type: ToastType;
  message: string;
  visible: boolean;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<ToastState>({
    type: "info",
    message: "",
    visible: false,
  });

  const showToast = useCallback(
    (message: string, type: ToastType = "info", duration = 5000) => {
      setToast({ type, message, visible: true });

      setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, duration);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <CustomToast
        type={toast.type}
        message={toast.message}
        visible={toast.visible}
        onHide={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

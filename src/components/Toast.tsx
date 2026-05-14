import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { cn } from "../utils";
import { createPortal } from "react-dom";

export type ToastType = "success" | "error" | "info";

export interface ToastOptions {
  type?: ToastType;
  duration?: number;
  className?: string;
}

export interface ToastMessage extends ToastOptions {
  id: string;
  message: string;
}

interface ToastContextValue {
  toast: (message: string, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, options: ToastOptions = {}) => {
    const id = Math.random().toString(36).substr(2, 9);
    const type = options.type || "info";
    const duration = options.duration !== undefined ? options.duration : 3000;
    
    setToasts((prev) => [...prev, { id, message, ...options, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <>
            {toasts.map((t) => (
              <div
                key={t.id}
                className={cn(
                  "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center rounded-lg px-6 py-4 text-sm font-medium shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-5",
                  t.type === "success" && "bg-gray-900 text-white border border-gray-800",
                  t.type === "error" && "bg-red-600 text-white border border-red-700 shadow-red-900/20",
                  t.type === "info" && "bg-white text-gray-900 border border-gray-200",
                  t.className
                )}
              >
                {t.message}
              </div>
            ))}
          </>,
          document.body
        )}
    </ToastContext.Provider>
  );
};

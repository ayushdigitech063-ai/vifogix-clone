// src/context/ToastContext.jsx
import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

let idCounter = 1;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ title, message, type = "success", duration = 4000 }) => {
    const id = idCounter++;
    setToasts((prev) => [...prev, { id, title, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const toast = useMemo(() => ({
    success: (message, title = "Success") => addToast({ message, title, type: "success" }),
    error: (message, title = "Error") => addToast({ message, title, type: "error" }),
    info: (message, title = "Notice") => addToast({ message, title, type: "info" }),
  }), [addToast]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast container floating at top-right */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed top-4 right-4 z-[9999] flex w-full max-w-sm flex-col gap-2.5 px-4 sm:px-0"
      >
        {toasts.map((t) => {
          const isSuccess = t.type === "success";
          const isError = t.type === "error";

          return (
            <div
              key={t.id}
              role="status"
              className="pointer-events-auto flex w-full items-start gap-3 rounded-xl border border-border bg-surface p-4 shadow-xl transition-all animate-fade-in"
            >
              <div className="mt-0.5 shrink-0">
                {isSuccess && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                {isError && <AlertCircle className="h-5 w-5 text-accent-red" />}
                {!isSuccess && !isError && <Info className="h-5 w-5 text-primary" />}
              </div>

              <div className="min-w-0 flex-1">
                {t.title && (
                  <h4 className="text-sm font-semibold text-fg">
                    {t.title}
                  </h4>
                )}
                <p className="mt-0.5 text-xs text-muted leading-relaxed">
                  {t.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeToast(t.id)}
                aria-label="Close notification"
                className="shrink-0 rounded-lg p-1 text-muted hover:bg-cream hover:text-fg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
};


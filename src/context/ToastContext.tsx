"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";

interface ToastAction {
  label: string;
  href: string;
}

interface Toast {
  id: number;
  message: string;
  action?: ToastAction;
}

interface ToastContextValue {
  show: (message: string, action?: ToastAction) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback(
    (message: string, action?: ToastAction) => {
      const id = nextId++;
      setToasts((t) => [...t, { id, message, action }]);
      setTimeout(() => dismiss(id), 3500);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ show }}>
      {children}

      {/* Toast viewport — announced to screen readers */}
      <div
        aria-live="polite"
        role="status"
        className="pointer-events-none fixed bottom-5 left-1/2 z-[60] flex w-[calc(100%-2rem)] max-w-[360px] -translate-x-1/2 flex-col gap-2"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-4 rounded-sm px-4 py-3 text-white shadow-lg"
            style={{ backgroundColor: "rgb(25,28,31)" }}
          >
            <span className="text-[14px]">{toast.message}</span>
            {toast.action && (
              <Link
                href={toast.action.href}
                onClick={() => dismiss(toast.id)}
                className="flex-shrink-0 text-[12px] font-semibold uppercase tracking-[1px] underline"
              >
                {toast.action.label}
              </Link>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

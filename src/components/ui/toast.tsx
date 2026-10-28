"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Toast = { id: number; title: string; description?: string; tone: "success" | "error" | "info" };
type ToastInput = Omit<Toast, "id">;

const ToastContext = React.createContext<{ push: (t: ToastInput) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const push = React.useCallback((t: ToastInput) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 4500);
  }, []);
  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-full max-w-sm flex-col gap-2"
        aria-live="polite"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "pointer-events-auto flex gap-3 rounded-xl border bg-white p-4 shadow-lift",
                t.tone === "success" && "border-basil-400/50",
                t.tone === "error" && "border-chili-400/50",
                t.tone === "info" && "border-cream-300",
              )}
            >
              {t.tone === "success" && <CheckCircle2 className="h-5 w-5 shrink-0 text-basil-500" />}
              {t.tone === "error" && <XCircle className="h-5 w-5 shrink-0 text-chili-500" />}
              {t.tone === "info" && <Info className="h-5 w-5 shrink-0 text-saffron-600" />}
              <div>
                <p className="text-sm font-semibold text-espresso-900">{t.title}</p>
                {t.description && <p className="text-xs text-espresso-500">{t.description}</p>}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

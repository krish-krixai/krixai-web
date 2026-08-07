"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useToast, ToastType } from "./use-toast";

const icons: Record<ToastType, React.ElementType> = {
  default: Info,
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
};

const colors: Record<ToastType, string> = {
  default: "text-white bg-white/[0.05] border-white/[0.1]",
  success: "text-green-500 bg-green-500/[0.05] border-green-500/20",
  error: "text-red-500 bg-red-500/[0.05] border-red-500/20",
  warning: "text-amber-500 bg-amber-500/[0.05] border-amber-500/20",
};

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-0 right-0 z-[100] flex flex-col p-6 gap-2 w-full sm:w-[400px] pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const type = toast.type || "default";
          const Icon = icons[type];

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={`pointer-events-auto flex items-start p-4 rounded-xl border backdrop-blur-xl shadow-2xl ${colors[type]}`}
            >
              <Icon className="w-5 h-5 shrink-0 mt-0.5 mr-3" />
              <div className="flex-1 mr-2">
                <h4 className="text-sm font-medium text-white">{toast.title}</h4>
                {toast.description && (
                  <p className="text-[13px] opacity-80 mt-1 leading-relaxed">
                    {toast.description}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const config = {
    success: { icon: CheckCircle, bg: "bg-green-50 border-green-200", text: "text-green-800", iconColor: "text-green-500" },
    error: { icon: XCircle, bg: "bg-rose-50 border-rose-200", text: "text-rose-800", iconColor: "text-rose-500" },
    warning: { icon: AlertTriangle, bg: "bg-amber-50 border-amber-200", text: "text-amber-800", iconColor: "text-amber-500" },
    info: { icon: Info, bg: "bg-blue-50 border-blue-200", text: "text-blue-800", iconColor: "text-blue-500" },
  }[type];

  const Icon = config.icon;

  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg ${config.bg} animate-fade-in-up max-w-sm`}>
      <Icon size={20} className={`${config.iconColor} flex-shrink-0 mt-0.5`} />
      <p className={`text-sm font-medium flex-1 ${config.text}`}>{message}</p>
      <button onClick={onClose} className="text-warm-gray-400 hover:text-warm-gray-600 flex-shrink-0">
        <X size={16} />
      </button>
    </div>
  );
}

// Global toast hook
let globalSetToast: ((toast: { message: string; type: ToastType } | null) => void) | null = null;

export function showToast(message: string, type: ToastType = "info") {
  if (globalSetToast) globalSetToast({ message, type });
}

export function ToastContainer() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    globalSetToast = setToast;
    return () => { globalSetToast = null; };
  }, []);

  if (!toast) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200]">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
    </div>
  );
}

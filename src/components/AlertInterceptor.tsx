"use client";

import { useEffect } from "react";
import { showToast } from "@/components/Toast";

export default function AlertInterceptor() {
  useEffect(() => {
    const originalAlert = window.alert;

    window.alert = (message?: unknown) => {
      const text = typeof message === "string" ? message : String(message ?? "Notification");
      const lower = text.toLowerCase();
      const type =
        lower.includes("error") || lower.includes("ghalat") || lower.includes("wrong") || lower.includes("failed") || lower.includes("nahi")
          ? "error"
          : lower.includes("success") || lower.includes("done") || lower.includes("ho gaya") || lower.includes("verified")
          ? "success"
          : "info";
      showToast(text, type);
    };

    return () => {
      window.alert = originalAlert;
    };
  }, []);

  return null;
}

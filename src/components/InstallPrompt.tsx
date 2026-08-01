"use client";

import { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already dismissed
    const dismissed = localStorage.getItem("momis-install-dismissed");
    if (dismissed) return;

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = window.matchMedia("(display-mode: standalone)").matches;

    if (isIOSDevice && !isInStandaloneMode) {
      setIsIOS(true);
      setTimeout(() => setShowPrompt(true), 3000);
      return;
    }

    // Android / Chrome install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("momis-install-dismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:w-80 bg-white rounded-2xl shadow-2xl p-5 z-50 animate-fade-in-up border border-warm-gray-100">
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 text-warm-gray-400 hover:text-warm-gray-600"
      >
        <X size={18} />
      </button>

      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Smartphone className="text-rose-500" size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-warm-gray-900 text-sm mb-1">
            App Install Karein! 📱
          </h3>
          <p className="text-xs text-warm-gray-500 mb-3">
            {isIOS
              ? "Share icon par tap karein, phir 'Add to Home Screen' select karein"
              : "Momis Wardrobe ko apne phone mein app ki tarah save karein"}
          </p>

          {isIOS ? (
            <div className="text-xs text-warm-gray-400 bg-warm-gray-50 rounded-lg p-2">
              <span className="font-medium">iOS:</span> Safari mein{" "}
              <span className="inline-block">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline -mt-0.5">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
              </span>{" "}
              icon → &quot;Add to Home Screen&quot;
            </div>
          ) : (
            <button
              onClick={handleInstall}
              className="w-full bg-rose-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors flex items-center justify-center gap-2"
            >
              <Download size={16} />
              Install Karein
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

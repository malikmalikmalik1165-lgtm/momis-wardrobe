"use client";

import { useState, useEffect } from "react";
import { Download, X, Smartphone, Share } from "lucide-react";
import Image from "next/image";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    setIsStandalone(standalone);
    if (standalone) return;

    const dismissed = localStorage.getItem("momis-install-dismissed");
    const dismissedTime = dismissed ? parseInt(dismissed) : 0;
    // Show again after 3 days
    if (dismissedTime && Date.now() - dismissedTime < 3 * 24 * 60 * 60 * 1000) return;

    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOSDevice) {
      setIsIOS(true);
      setTimeout(() => setShowPrompt(true), 5000);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowPrompt(true), 5000);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setShowPrompt(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("momis-install-dismissed", String(Date.now()));
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:w-[340px] z-[90] animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-2xl border border-warm-gray-100 overflow-hidden">
        {/* Header gradient */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Smartphone size={18} />
            <span className="text-sm font-bold">App Download Karein!</span>
          </div>
          <button onClick={handleDismiss} className="text-white/70 hover:text-white">
            <X size={16} />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
              <Image src="/icons/icon-192.png" alt="Momis Wardrobe" width={56} height={56} />
            </div>
            <div>
              <h3 className="font-bold text-warm-gray-900 text-sm">Momis Wardrobe</h3>
              <p className="text-[11px] text-warm-gray-500 mt-0.5">
                Elegant Women&apos;s Fashion App
              </p>
              <div className="flex items-center gap-1 mt-1">
                {[1,2,3,4,5].map((i) => (
                  <span key={i} className="text-amber-400 text-xs">★</span>
                ))}
                <span className="text-[10px] text-warm-gray-400 ml-1">4.8</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-warm-gray-400 mb-4">
            <span className="bg-warm-gray-100 px-2 py-1 rounded">🚚 Fast Delivery</span>
            <span className="bg-warm-gray-100 px-2 py-1 rounded">💵 COD</span>
            <span className="bg-warm-gray-100 px-2 py-1 rounded">🔔 Notifications</span>
          </div>

          {isIOS ? (
            <div className="bg-warm-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-warm-gray-600 mb-1">
                <strong>iPhone/iPad:</strong>
              </p>
              <p className="text-[11px] text-warm-gray-500">
                Safari mein <Share size={12} className="inline -mt-0.5" /> Share icon tap karein → <strong>&quot;Add to Home Screen&quot;</strong>
              </p>
            </div>
          ) : (
            <button
              onClick={handleInstall}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-rose-200 transition-all"
            >
              <Download size={18} /> Install Free App
            </button>
          )}

          <p className="text-[9px] text-warm-gray-300 text-center mt-2">
            Free • No storage • Opens instantly
          </p>
        </div>
      </div>
    </div>
  );
}

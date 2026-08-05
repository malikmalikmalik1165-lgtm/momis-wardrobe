"use client";

import { MessageCircle, X } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function WhatsAppFloat() {
  const [showBubble, setShowBubble] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const pathname = usePathname();

  // Don't show on admin/team pages
  const hidden = pathname.startsWith("/admin") || pathname.startsWith("/team");

  useEffect(() => {
    if (hidden) return;
    const timer = setTimeout(() => {
      if (!dismissed) setShowBubble(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, [hidden, dismissed]);

  if (hidden) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-8 right-4 sm:right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat Bubble */}
      {showBubble && !dismissed && (
        <div className="animate-fade-in-up relative bg-white rounded-2xl shadow-2xl p-4 max-w-[260px] border border-warm-gray-100">
          <button
            onClick={() => { setDismissed(true); setShowBubble(false); }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-warm-gray-200 rounded-full flex items-center justify-center hover:bg-warm-gray-300"
          >
            <X size={12} />
          </button>
          <p className="text-sm text-warm-gray-700 mb-2">
            👋 <strong>Assalam o Alaikum!</strong>
          </p>
          <p className="text-xs text-warm-gray-500 mb-3">
            Koi sawal hai? Order karna hai? Direct WhatsApp par baat karein!
          </p>
          <a
            href="https://wa.me/923295578925?text=Assalam%20o%20Alaikum!%20Mujhe%20products%20ke%20baare%20mein%20poochna%20hai."
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-green-500 text-white text-center py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
          >
            Chat Start Karein 💬
          </a>
          {/* Triangle */}
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-b border-r border-warm-gray-100 rotate-45" />
        </div>
      )}

      {/* Floating Button */}
      <a
        href="https://wa.me/923295578925?text=Assalam%20o%20Alaikum!%20Mujhe%20Momis%20Wardrobe%20se%20order%20karna%20hai."
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => { setDismissed(true); setShowBubble(false); }}
        className="group w-14 h-14 sm:w-16 sm:h-16 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110"
        style={{ boxShadow: "0 4px 20px rgba(34,197,94,0.4)" }}
      >
        <MessageCircle size={26} className="group-hover:scale-110 transition-transform" />
        {/* Pulse ring */}
        <span className="absolute w-full h-full rounded-full bg-green-400 opacity-30 animate-ping" />
      </a>
    </div>
  );
}

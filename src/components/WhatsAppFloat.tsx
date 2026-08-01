"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppFloat() {
  return (
    <a
      href="https://chat.whatsapp.com/B9JHotGfxhICVZASVkwUIa"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
      title="Join our WhatsApp Community"
    >
      <MessageCircle size={22} className="flex-shrink-0" />
      <span className="hidden sm:inline text-sm font-medium whitespace-nowrap overflow-hidden max-w-0 group-hover:max-w-[200px] transition-all duration-300">
        Join Community
      </span>
    </a>
  );
}

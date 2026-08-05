"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

export default function WhatsAppFloat() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/team")) return null;

  return (
    <a
      href="https://wa.me/923295578925"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 sm:bottom-8 left-4 sm:left-6 z-[80] w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all"
    >
      <MessageCircle size={22} />
    </a>
  );
}

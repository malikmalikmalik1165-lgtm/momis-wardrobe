"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, X, Megaphone, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Notification {
  id: number;
  title: string;
  body: string;
  url: string | null;
  createdAt: string;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadNotifs();
    const interval = setInterval(loadNotifs, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const loadNotifs = async () => {
    try {
      const res = await fetch("/api/notifications/latest");
      if (res.ok) {
        const data = await res.json();
        setNotifs(data);
        const lastSeen = localStorage.getItem("momis-notif-seen") || "0";
        const newCount = data.filter((n: Notification) => n.id > parseInt(lastSeen)).length;
        setUnread(newCount);
      }
    } catch {}
  };

  const handleOpen = () => {
    setOpen(!open);
    if (!open && notifs.length > 0) {
      localStorage.setItem("momis-notif-seen", String(notifs[0].id));
      setUnread(0);
    }
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Abhi";
    if (mins < 60) return `${mins} min`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hr`;
    const days = Math.floor(hrs / 24);
    return `${days} din`;
  };

  return (
    <div ref={ref} className="relative">
      <button onClick={handleOpen} className="relative p-2 text-warm-gray-600 hover:text-warm-gray-900 transition-colors">
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[8px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center animate-pulse">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-warm-gray-100 z-[100] animate-fade-in overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-warm-gray-100 bg-warm-gray-50">
            <div className="flex items-center gap-2">
              <Megaphone size={16} className="text-rose-500" />
              <span className="text-sm font-bold text-warm-gray-900">Notifications</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-warm-gray-400 hover:text-warm-gray-600">
              <X size={16} />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifs.length === 0 ? (
              <div className="py-10 text-center">
                <Bell size={28} className="mx-auto text-warm-gray-200 mb-2" />
                <p className="text-sm text-warm-gray-400">Koi notification nahi</p>
              </div>
            ) : (
              notifs.map((n) => (
                <div key={n.id} className="px-4 py-3 border-b border-warm-gray-50 hover:bg-warm-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-warm-gray-900">{n.title}</p>
                      <p className="text-xs text-warm-gray-500 mt-0.5 line-clamp-2">{n.body}</p>
                      <p className="text-[10px] text-warm-gray-300 mt-1">{timeAgo(n.createdAt)} ago</p>
                    </div>
                    {n.url && n.url !== "/" && (
                      <Link href={n.url} onClick={() => setOpen(false)}
                        className="p-1.5 text-warm-gray-400 hover:text-rose-500 flex-shrink-0">
                        <ExternalLink size={14} />
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

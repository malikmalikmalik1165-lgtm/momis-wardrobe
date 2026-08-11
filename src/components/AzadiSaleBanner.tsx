"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AzadiSaleBanner() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const d = localStorage.getItem("mw-sale-dismissed");
    if (d && Date.now() - parseInt(d) < 86400000) { setDismissed(true); return; }

    // Sale end: Aug 14 midnight
    const end = new Date("2026-08-14T23:59:59").getTime();
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 text-6xl font-bold flex items-center justify-center select-none">🇵🇰</div>
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3 sm:gap-6 relative z-10">
        <span className="text-lg">🇵🇰</span>
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="font-bold text-xs sm:text-sm tracking-wide uppercase">Azadi Sale!</span>
          <div className="flex gap-1">
            {[
              { v: timeLeft.days, l: "D" },
              { v: timeLeft.hours, l: "H" },
              { v: timeLeft.mins, l: "M" },
              { v: timeLeft.secs, l: "S" },
            ].map((t) => (
              <div key={t.l} className="bg-white/20 backdrop-blur-sm rounded px-1.5 py-0.5 text-center min-w-[28px]">
                <span className="text-xs sm:text-sm font-mono font-bold">{String(t.v).padStart(2, "0")}</span>
                <span className="text-[7px] block -mt-0.5 text-white/70">{t.l}</span>
              </div>
            ))}
          </div>
          <Link href="/sale" className="bg-white text-green-700 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold hover:bg-green-50 transition-colors">
            Shop Sale →
          </Link>
        </div>
        <button onClick={() => { setDismissed(true); localStorage.setItem("mw-sale-dismissed", String(Date.now())); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-lg leading-none">×</button>
      </div>
    </div>
  );
}

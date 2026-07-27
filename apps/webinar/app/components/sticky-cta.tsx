"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 md:hidden transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <div className="bg-white/95 border-t border-[#e2efe6] backdrop-blur-md px-4 py-3 pb-safe shadow-xl">
        <Link
          href="/register"
          id="sticky-register-btn"
          className="flex items-center justify-center gap-2 w-full bg-[#1e5631] hover:bg-[#2d7d46] text-white font-black text-base py-3.5 rounded-xl transition-all duration-200 active:scale-95 shadow-md shadow-green-950/15"
        >
          🎯 Reserve My Free Spot
        </Link>
        <p className="text-center text-[#4a6b57] text-xs font-semibold mt-1.5">
          Free · No credit card needed
        </p>
      </div>
    </div>
  );
}

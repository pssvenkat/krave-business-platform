import Link from "next/link";
import { WEBINAR } from "../content";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0d2318]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="text-2xl">🌱</span>
          <div className="hidden sm:block">
            <p className="text-white font-bold text-sm leading-tight">Krave Microgreens</p>
            <p className="text-green-400 text-xs">Free Webinar</p>
          </div>
        </Link>

        {/* Info chip */}
        <div className="hidden md:flex items-center gap-2 text-sm text-green-300/80">
          <span>📅</span>
          <span>{WEBINAR.date} · {WEBINAR.time}</span>
        </div>

        {/* CTA */}
        <Link
          href="/register"
          className="bg-green-500 hover:bg-green-400 text-white font-bold text-sm px-5 py-2.5 rounded-lg transition-all duration-200 shadow-lg shadow-green-900/40 hover:shadow-green-800/50 active:scale-95"
        >
          Register Free →
        </Link>
      </div>
    </nav>
  );
}

import Link from "next/link";
import Image from "next/image";
import { WEBINAR } from "../content";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0d2b1a]/85 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo — white background container as per brand guidelines */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-white rounded-xl px-3 py-1.5 shadow-md group-hover:shadow-lg transition-shadow duration-200 flex items-center">
            <Image
              src="/logo.jpg"
              alt="Krave Microgreens"
              width={100}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />
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
          className="bg-green-600 hover:bg-green-500 text-white font-bold text-sm px-5 py-2.5 rounded-lg transition-all duration-200 shadow-lg shadow-green-900/40 hover:shadow-green-800/50 active:scale-95"
        >
          Register Free →
        </Link>
      </div>
    </nav>
  );
}

import Link from "next/link";
import Image from "next/image";
import { WEBINAR } from "../content";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#e2efe6] bg-white/95 backdrop-blur-md shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo — white background container as per brand guidelines */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-white border border-[#e2efe6] rounded-xl px-3.5 py-1.5 shadow-sm group-hover:shadow-md transition-shadow duration-200 flex items-center">
            <Image
              src="/logo.jpg"
              alt="Krave Microgreens"
              width={110}
              height={44}
              className="h-9 w-auto object-contain"
              priority
            />
          </div>
        </Link>

        {/* Info chip */}
        <div className="hidden md:flex items-center gap-2 text-sm text-[#1e5631] font-semibold bg-[#edf6f0] px-3.5 py-1.5 rounded-full border border-[#d0e6d6]">
          <span>📅</span>
          <span>{WEBINAR.date} · {WEBINAR.time}</span>
        </div>

        {/* CTA */}
        <Link
          href="/register"
          className="bg-[#1e5631] hover:bg-[#2d7d46] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-green-900/10 hover:shadow-lg active:scale-95"
        >
          Register Free →
        </Link>
      </div>
    </nav>
  );
}

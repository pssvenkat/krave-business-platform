"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/webinars", label: "Webinars", icon: "🎙️" },
  { href: "/trainers", label: "Trainers", icon: "👨‍🏫" },
  { href: "/registrations", label: "Registrations", icon: "📋" },
  { href: "/analytics", label: "Analytics", icon: "📈" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-white border-r border-[#e2efe6] flex-shrink-0 shadow-sm">
      {/* Logo Container - White field for logo */}
      <div className="px-6 py-5 border-b border-[#e2efe6] bg-[#f8faf5]/50">
        <Link href="/dashboard" className="flex items-center">
          <div className="bg-white rounded-xl px-3.5 py-2 border border-[#e2efe6] shadow-sm flex items-center">
            <Image
              src="/logo.jpg"
              alt="Krave Microgreens Admin"
              width={120}
              height={44}
              className="h-9 w-auto object-contain"
              priority
            />
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1.5">
        {NAV.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                isActive
                  ? "bg-[#1e5631] text-white shadow-md shadow-green-900/10"
                  : "text-[#4a6b57] hover:text-[#143623] hover:bg-[#f0f7f2]"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
              {isActive && (
                <span className="ml-auto w-2 h-2 rounded-full bg-[#6cc24a]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-[#e2efe6] bg-[#f8faf5]/30">
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="w-full flex items-center gap-2 text-[#4a6b57] hover:text-red-600 font-semibold text-sm px-3.5 py-2.5 rounded-xl hover:bg-red-50 transition-all duration-150"
          >
            <span>🚪</span> Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}

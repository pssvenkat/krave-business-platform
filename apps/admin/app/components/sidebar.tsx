"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/webinars", label: "Webinars", icon: "🎙️" },
  { href: "/registrations", label: "Registrations", icon: "📋" },
  { href: "/analytics", label: "Analytics", icon: "📈" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-[#0d2318] border-r border-white/10 flex-shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🌱</span>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Krave</p>
            <p className="text-green-400 text-xs">Admin Platform</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-green-500/20 text-green-300 border border-green-500/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="w-full flex items-center gap-2 text-gray-500 hover:text-red-400 text-sm px-3 py-2 rounded-lg hover:bg-white/5 transition-all duration-150"
          >
            <span>🚪</span> Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}

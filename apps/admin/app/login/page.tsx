import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Krave Admin",
};

/**
 * Admin Login Page – Milestone 1 Placeholder
 *
 * The full login form with Supabase Auth + Cloudflare Turnstile
 * will be implemented in Milestone 2.
 */
export default function LoginPage() {
  return (
    <main className="min-h-screen krave-gradient flex items-center justify-center p-4">
      <div className="glass rounded-2xl p-8 w-full max-w-md animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-5xl block mb-3">🌱</span>
          <h1 className="text-2xl font-bold text-white">Krave Admin</h1>
          <p className="text-green-300/70 text-sm mt-1">
            Webinar Management Platform
          </p>
        </div>

        {/* Placeholder form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-green-200 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              placeholder="admin@kravemicrogreens.in"
              className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-400"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-green-200 mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-400"
              disabled
            />
          </div>

          <button
            disabled
            className="w-full py-3 rounded-lg bg-green-500/50 text-white font-semibold cursor-not-allowed"
          >
            Sign In – Available in Milestone 2
          </button>
        </div>

        {/* Status */}
        <div className="mt-6 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
          <p className="text-green-300 text-xs text-center">
            🏗️ Milestone 1 Foundation Complete – Full auth in Milestone 2
          </p>
        </div>
      </div>
    </main>
  );
}

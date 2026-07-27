import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Krave Microgreens Webinar | Register Now",
};

/**
 * Webinar Home Page – Milestone 1 Placeholder
 *
 * This is a foundation placeholder. The full landing page with Hero,
 * Benefits, Trainer, Testimonials, FAQ, and Countdown will be built
 * in Milestone 2.
 */
export default function HomePage() {
  return (
    <main className="min-h-screen krave-gradient flex items-center justify-center">
      <div className="text-center px-4 animate-fade-in">
        {/* Logo */}
        <div className="mb-8">
          <span className="text-6xl">🌱</span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl font-extrabold text-white mb-4">
          Krave Microgreens
        </h1>

        <p className="text-xl text-green-200 mb-2 font-medium">
          Webinar Platform
        </p>

        <p className="text-green-300/70 text-sm mb-12 max-w-md mx-auto">
          Milestone 1 – Foundation complete. The full webinar platform is coming
          in Milestone 2.
        </p>

        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
          {[
            { icon: "⚡", label: "Turborepo", status: "Configured" },
            { icon: "🔐", label: "Supabase Auth", status: "Ready" },
            { icon: "📧", label: "Resend Email", status: "Configured" },
            { icon: "📊", label: "PostHog", status: "Active" },
            { icon: "🔒", label: "AES-256 Encryption", status: "Ready" },
            { icon: "🚀", label: "Vercel Deploy", status: "Ready" },
          ].map((item) => (
            <div
              key={item.label}
              className="glass rounded-xl p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-white font-semibold text-sm">
                    {item.label}
                  </p>
                  <p className="text-green-300 text-xs">{item.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Build info */}
        <div className="glass rounded-2xl p-6 max-w-md mx-auto">
          <p className="text-green-200 text-sm font-medium mb-1">
            Next Up: Milestone 2
          </p>
          <p className="text-white font-bold text-lg">
            Full Webinar Platform
          </p>
          <p className="text-green-300/70 text-xs mt-2">
            Landing page • Registration • Thank You • Live webinar page
          </p>
        </div>
      </div>
    </main>
  );
}

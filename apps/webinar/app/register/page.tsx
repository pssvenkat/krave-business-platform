import type { Metadata } from "next";
import { WEBINAR, SPEAKER } from "../content";
import { Navbar } from "../components/navbar";
import { RegistrationForm } from "../components/registration-form";

export const metadata: Metadata = {
  title: `Register Free | ${WEBINAR.title}`,
  description: `Reserve your free spot for the Krave Microgreens webinar with ${SPEAKER.name} on ${WEBINAR.date}.`,
  robots: { index: true, follow: true },
};

// This is the active webinar ID — set to your Supabase webinar row ID
// You can fetch this dynamically once the admin creates a webinar in Supabase
const ACTIVE_WEBINAR_ID = process.env.NEXT_PUBLIC_ACTIVE_WEBINAR_ID ?? "placeholder";

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen krave-gradient pt-16">
        <div className="max-w-6xl mx-auto px-4 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: value prop */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-1.5 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                </span>
                <span className="text-green-300 text-sm font-semibold">
                  FREE LIVE WEBINAR · {WEBINAR.date}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">
                {WEBINAR.title}
              </h1>

              <p className="text-green-200/80 text-lg mb-8">{WEBINAR.subtitle}</p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: "🗓️", text: `${WEBINAR.date} · ${WEBINAR.time}` },
                  { icon: "⏱️", text: `Duration: ${WEBINAR.duration}` },
                  { icon: "🎙️", text: `Trainer: ${SPEAKER.name}` },
                  { icon: "💻", text: "Online · YouTube Live" },
                  { icon: "💯", text: "100% Free — No payment required" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-green-100">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white/10 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
                <p className="text-green-300 font-bold text-sm uppercase tracking-wider mb-3">
                  What you&apos;ll learn
                </p>
                <ul className="space-y-2">
                  {[
                    "How to start with just ₹3,000",
                    "Where to find your first 10 customers",
                    "Grow cycle, packaging & pricing secrets",
                    "Scale from side income to full business",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-green-100">
                      <span className="text-green-400 mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Form */}
            <div className="bg-white rounded-3xl shadow-2xl shadow-green-900/40 p-6 sm:p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-black text-gray-900 mb-1">
                  Reserve Your Free Spot
                </h2>
                <p className="text-gray-500 text-sm">
                  Fill in your details below — takes 30 seconds
                </p>
              </div>

              <RegistrationForm webinarId={ACTIVE_WEBINAR_ID} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

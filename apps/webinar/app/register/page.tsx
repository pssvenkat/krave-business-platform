import type { Metadata } from "next";
import { WEBINAR, SPEAKER } from "../content";
import { Navbar } from "../components/navbar";
import { RegistrationForm } from "../components/registration-form";

export const metadata: Metadata = {
  title: `Register Free | ${WEBINAR.title}`,
  description: `Reserve your free spot for the Krave Microgreens webinar with ${SPEAKER.name} on ${WEBINAR.date}.`,
  robots: { index: true, follow: true },
};

const ACTIVE_WEBINAR_ID = process.env.NEXT_PUBLIC_ACTIVE_WEBINAR_ID ?? "placeholder";

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-[#edf6f0] via-[#f7fbf8] to-white pt-16">
        <div className="max-w-6xl mx-auto px-4 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left: value prop */}
            <div className="text-[#143623]">
              <div className="inline-flex items-center gap-2 bg-[#e2efe6] border border-[#b8dbc3] rounded-full px-4 py-1.5 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-700" />
                </span>
                <span className="text-[#1e5631] text-sm font-bold">
                  FREE LIVE WEBINAR · {WEBINAR.date}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black mb-4 leading-tight text-[#143623]">
                {WEBINAR.title}
              </h1>

              <p className="text-[#2d7d46] text-lg font-semibold mb-8">{WEBINAR.subtitle}</p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: "🗓️", text: `${WEBINAR.date} · ${WEBINAR.time}` },
                  { icon: "⏱️", text: `Duration: ${WEBINAR.duration}` },
                  { icon: "🎙️", text: `Trainer: ${SPEAKER.name}` },
                  { icon: "💻", text: "Online · YouTube Live" },
                  { icon: "💯", text: "100% Free — No payment required" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 font-semibold text-[#143623]">
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-[#e2efe6] rounded-2xl p-6 shadow-sm">
                <p className="text-[#1e5631] font-bold text-xs uppercase tracking-wider mb-3">
                  What you&apos;ll learn
                </p>
                <ul className="space-y-2.5">
                  {[
                    "How to start with just ₹3,000",
                    "Where to find your first 10 customers",
                    "Grow cycle, packaging & pricing secrets",
                    "Scale from side income to full business",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[#143623] font-medium">
                      <span className="text-[#1e5631] font-bold mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Form */}
            <div className="bg-white rounded-3xl border border-[#e2efe6] shadow-xl shadow-green-950/5 p-6 sm:p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-black text-[#143623] mb-1">
                  Reserve Your Free Spot
                </h2>
                <p className="text-[#4a6b57] text-sm font-medium">
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

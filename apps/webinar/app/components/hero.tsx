import Link from "next/link";
import { WEBINAR, SPEAKER } from "../content";
import { Countdown } from "./countdown";
import { WebinarData } from "../lib/get-webinar";

export function Hero({ webinar }: { webinar?: WebinarData }) {
  const data = webinar ?? { ...WEBINAR, speakerName: SPEAKER.name };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#edf6f0] via-[#f7fbf8] to-white pt-20 pb-16">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-green-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-emerald-100/50 blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-12 text-center">
        {/* Live badge */}
        <div className="inline-flex items-center gap-2 bg-[#e2efe6] border border-[#b8dbc3] rounded-full px-4.5 py-1.5 mb-6 shadow-xs">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-600 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-700" />
          </span>
          <span className="text-[#1e5631] text-sm font-bold tracking-wide">FREE LIVE WEBINAR · {data.date}</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#143623] mb-4 leading-tight tracking-tight">
          {data.title}
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-[#2d7d46] mb-8 font-semibold">
          {data.subtitle}
        </p>

        {/* Meta info */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10 text-sm font-semibold text-[#1e5631]">
          <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-[#e2efe6] shadow-xs">
            <span>🗓️</span> {data.date}
          </span>
          <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-[#e2efe6] shadow-xs">
            <span>⏰</span> {data.time}
          </span>
          <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-[#e2efe6] shadow-xs">
            <span>⏱️</span> {data.duration}
          </span>
          <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-[#e2efe6] shadow-xs">
            <span>🎙️</span> {data.speakerName}
          </span>
        </div>

        {/* Countdown */}
        <div className="mb-10">
          <Countdown targetISO={data.dateISO} />
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            id="hero-register-btn"
            className="inline-flex items-center justify-center gap-2 bg-[#1e5631] hover:bg-[#2d7d46] text-white font-black text-lg px-10 py-4 rounded-2xl transition-all duration-200 shadow-xl shadow-green-950/15 hover:shadow-2xl hover:-translate-y-0.5 active:scale-95"
          >
            🎯 Reserve My Free Spot
          </Link>
          <a
            href={data.whatsappCommunityUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-green-50/60 border border-[#b8dbc3] text-[#1e5631] font-bold text-base px-8 py-4 rounded-2xl transition-all duration-200 shadow-sm"
          >
            💬 Join WhatsApp Community
          </a>
        </div>

        {/* Social proof */}
        <p className="mt-6 text-[#4a6b57] text-sm font-medium">
          🔥 <strong className="text-[#143623] font-bold">2,000+</strong> entrepreneurs already registered · Limited to {data.maxSeats} seats
        </p>
      </div>
    </section>
  );
}

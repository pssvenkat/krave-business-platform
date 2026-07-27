import Link from "next/link";
import { WEBINAR, SPEAKER } from "../content";
import { Countdown } from "./countdown";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden krave-gradient pt-16">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-green-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-green-400/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-green-600/5 blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-20 text-center">
        {/* Live badge */}
        <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-1.5 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
          <span className="text-green-300 text-sm font-semibold">FREE LIVE WEBINAR · {WEBINAR.date}</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight tracking-tight">
          {WEBINAR.title}
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-green-200 mb-8 font-medium">
          {WEBINAR.subtitle}
        </p>

        {/* Meta info */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10 text-sm text-green-300/80">
          <span className="flex items-center gap-1.5">
            <span>🗓️</span> {WEBINAR.date}
          </span>
          <span className="w-1 h-1 rounded-full bg-green-500/50" />
          <span className="flex items-center gap-1.5">
            <span>⏰</span> {WEBINAR.time}
          </span>
          <span className="w-1 h-1 rounded-full bg-green-500/50" />
          <span className="flex items-center gap-1.5">
            <span>⏱️</span> {WEBINAR.duration}
          </span>
          <span className="w-1 h-1 rounded-full bg-green-500/50" />
          <span className="flex items-center gap-1.5">
            <span>🎙️</span> {SPEAKER.name}
          </span>
        </div>

        {/* Countdown */}
        <div className="mb-10">
          <Countdown targetISO={WEBINAR.dateISO} />
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            id="hero-register-btn"
            className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white font-black text-lg px-10 py-4 rounded-xl transition-all duration-200 shadow-2xl shadow-green-900/60 hover:shadow-green-800/70 hover:-translate-y-0.5 active:scale-95"
          >
            🎯 Reserve My Free Spot
          </Link>
          <a
            href={WEBINAR.whatsappCommunityUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-base px-8 py-4 rounded-xl transition-all duration-200 backdrop-blur-sm"
          >
            💬 Join WhatsApp Community
          </a>
        </div>

        {/* Social proof */}
        <p className="mt-6 text-green-400/70 text-sm">
          🔥 <strong className="text-green-300">2,000+</strong> entrepreneurs already registered · Limited to {WEBINAR.maxSeats} seats
        </p>
      </div>
    </section>
  );
}

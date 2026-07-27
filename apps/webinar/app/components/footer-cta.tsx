import Link from "next/link";
import { WEBINAR, SPEAKER } from "../content";
import { Countdown } from "./countdown";

export function FooterCta() {
  return (
    <section className="py-24 krave-gradient relative overflow-hidden">
      {/* Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full bg-green-400/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-green-600/10 blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 text-center">
        {/* Urgency badge */}
        <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-400/30 rounded-full px-4 py-1.5 mb-6">
          <span className="text-red-300 text-sm font-bold">⚡ LIMITED SEATS — Only {WEBINAR.maxSeats} spots available</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
          Don&apos;t Miss Your Spot
        </h2>

        <p className="text-green-200/80 text-lg mb-8 max-w-xl mx-auto">
          Join {SPEAKER.name} live on <strong className="text-white">{WEBINAR.date}</strong> at <strong className="text-white">{WEBINAR.time}</strong> and get your personal roadmap to a microgreens business.
        </p>

        {/* Countdown */}
        <div className="mb-10">
          <Countdown targetISO={WEBINAR.dateISO} />
        </div>

        <Link
          href="/register"
          id="footer-register-btn"
          className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-400 text-white font-black text-xl px-12 py-5 rounded-2xl transition-all duration-200 shadow-2xl shadow-green-900/60 hover:-translate-y-0.5 active:scale-95"
        >
          🎯 Register Now — It&apos;s Free
        </Link>

        <p className="mt-6 text-green-400/60 text-sm">
          No credit card. No spam. Just value.
        </p>

        {/* Footer links */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap justify-center gap-6 text-green-400/50 text-xs">
          <a href="https://kravemicrogreens.in" target="_blank" rel="noopener noreferrer" className="hover:text-green-300 transition-colors">
            kravemicrogreens.in
          </a>
          <span>·</span>
          <a href="https://kravemicrogreens.in/privacy" className="hover:text-green-300 transition-colors">
            Privacy Policy
          </a>
          <span>·</span>
          <a href="https://kravemicrogreens.in/terms" className="hover:text-green-300 transition-colors">
            Terms
          </a>
          <span>·</span>
          <span>© {new Date().getFullYear()} Krave Microgreens</span>
        </div>
      </div>
    </section>
  );
}

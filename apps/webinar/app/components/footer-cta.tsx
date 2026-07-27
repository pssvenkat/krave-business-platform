import Link from "next/link";
import Image from "next/image";
import { WEBINAR, SPEAKER } from "../content";
import { Countdown } from "./countdown";
import { WebinarData } from "../lib/get-webinar";

export function FooterCta({ webinar }: { webinar?: WebinarData }) {
  const data = webinar ?? { ...WEBINAR, speakerName: SPEAKER.name };

  return (
    <section className="py-24 bg-gradient-to-b from-[#edf6f0] via-[#f7fbf8] to-white relative overflow-hidden border-t border-[#e2efe6]">
      {/* Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full bg-green-200/30 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-emerald-100/40 blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 text-center">
        {/* Urgency badge */}
        <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-1.5 mb-6">
          <span className="text-red-700 text-sm font-bold">⚡ LIMITED SEATS — Only {data.maxSeats} spots available</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-[#143623] mb-4">
          Don&apos;t Miss Your Spot
        </h2>

        <p className="text-[#4a6b57] text-lg mb-8 max-w-xl mx-auto font-medium">
          Join {data.speakerName} live on <strong className="text-[#143623] font-bold">{data.date}</strong> at <strong className="text-[#143623] font-bold">{data.time}</strong> and get your personal roadmap to a microgreens business.
        </p>

        {/* Countdown */}
        <div className="mb-10">
          <Countdown targetISO={data.dateISO} />
        </div>

        <Link
          href="/register"
          id="footer-register-btn"
          className="inline-flex items-center gap-3 bg-[#1e5631] hover:bg-[#2d7d46] text-white font-black text-xl px-12 py-5 rounded-2xl transition-all duration-200 shadow-xl shadow-green-950/15 hover:-translate-y-0.5 active:scale-95"
        >
          🎯 Register Now — It&apos;s Free
        </Link>

        <p className="mt-6 text-[#6b8e78] text-sm font-medium">
          No credit card. No spam. Just value.
        </p>

        {/* Footer links */}
        <div className="mt-16 pt-8 border-t border-[#e2efe6]">
          {/* Logo — White background container as requested */}
          <div className="flex justify-center mb-6">
            <a href="https://kravemicrogreens.in" target="_blank" rel="noopener noreferrer">
              <div className="bg-white border border-[#e2efe6] rounded-xl px-4 py-2 shadow-md inline-flex items-center hover:shadow-lg transition-shadow">
                <Image
                  src="/logo.jpg"
                  alt="Krave Microgreens"
                  width={120}
                  height={48}
                  className="h-10 w-auto object-contain"
                />
              </div>
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-[#4a6b57] text-xs font-semibold">
            <a href="https://kravemicrogreens.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#1e5631] transition-colors">
              kravemicrogreens.in
            </a>
            <span>·</span>
            <a href="https://kravemicrogreens.in/privacy" className="hover:text-[#1e5631] transition-colors">
              Privacy Policy
            </a>
            <span>·</span>
            <a href="https://kravemicrogreens.in/terms" className="hover:text-[#1e5631] transition-colors">
              Terms
            </a>
            <span>·</span>
            <span>© {new Date().getFullYear()} Krave Microgreens</span>
          </div>
        </div>
      </div>
    </section>
  );
}

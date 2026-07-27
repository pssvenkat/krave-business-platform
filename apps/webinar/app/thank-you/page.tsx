import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getLatestWebinar } from "../lib/get-webinar";
import { LocalizedTime } from "../components/localized-time";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "You're Registered! | Krave Microgreens Webinar",
  description: "Your spot is confirmed. See you at the webinar!",
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ name?: string; ref?: string }>;
}

export default async function ThankYouPage({ searchParams }: Props) {
  const params = await searchParams;
  const name = params.name ?? "there";
  const webinar = await getLatestWebinar();

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#edf6f0] via-[#f7fbf8] to-white flex items-center justify-center px-4 py-12">
      {/* Confetti decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {["🌱", "✨", "🎉", "💚", "⭐"].map((emoji, i) => (
          <div
            key={i}
            className="absolute text-2xl opacity-30 animate-bounce"
            style={{
              left: `${10 + i * 20}%`,
              top: `${15 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + i * 0.5}s`,
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      <div className="relative max-w-2xl w-full">
        {/* Success card */}
        <div className="bg-white rounded-3xl border border-[#e2efe6] shadow-xl shadow-green-950/5 overflow-hidden">
          {/* Top bar */}
          <div className="bg-[#1e5631] px-8 py-8 text-center text-white">
            {/* Logo in white field container */}
            <div className="inline-flex items-center justify-center bg-white border border-[#e2efe6] rounded-xl px-4 py-2 shadow-md mb-4">
              <Image
                src="/logo.jpg"
                alt="Krave Microgreens"
                width={120}
                height={48}
                className="h-10 w-auto object-contain"
                priority
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">
              You&apos;re In, {name}!
            </h1>
            <p className="text-green-100 mt-1 font-medium text-sm">
              Your spot has been reserved successfully.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Webinar details box */}
            <div className="bg-[#f0f7f2] border border-[#d0e6d6] rounded-2xl p-5">
              <p className="text-[#1e5631] font-bold text-xs mb-3 uppercase tracking-wider">
                Confirmed Webinar Details
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-lg">📋</span>
                  <div>
                    <span className="text-[#4a6b57] font-medium text-xs block">Topic</span>
                    <span className="text-[#143623] font-black text-base">{webinar.title}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-lg">🗓️</span>
                  <div>
                    <span className="text-[#4a6b57] font-medium text-xs block">Date & Time</span>
                    <div className="text-[#143623] font-bold text-sm">
                      <LocalizedTime dateISO={webinar.dateISO} />
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-lg">⏳</span>
                  <div>
                    <span className="text-[#4a6b57] font-medium text-xs block">Duration</span>
                    <span className="text-[#143623] font-bold text-sm">{webinar.duration}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-lg">👨‍🏫</span>
                  <div>
                    <span className="text-[#4a6b57] font-medium text-xs block">Trainer</span>
                    <span className="text-[#143623] font-bold text-sm">{webinar.speakerName}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-lg">💻</span>
                  <div>
                    <span className="text-[#4a6b57] font-medium text-xs block">Where</span>
                    <span className="text-[#143623] font-bold text-sm">YouTube Live (link sent to your email)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmation email notice */}
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
              <span className="text-xl">📧</span>
              <p className="text-blue-900 font-medium">
                A confirmation email has been sent to you with the webinar link and
                reminder schedule. Check your spam folder if you don&apos;t see it.
              </p>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={webinar.googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="add-to-calendar-btn"
                className="flex items-center justify-center gap-2 bg-white border border-[#d0e6d6] hover:bg-[#f0f7f2] text-[#143623] font-bold py-3.5 px-4 rounded-xl transition-all duration-200 text-sm shadow-xs"
              >
                📅 Add to Calendar
              </a>
              <a
                href={webinar.whatsappCommunityUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="join-whatsapp-btn"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20c45b] text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-200 text-sm shadow-md"
              >
                💬 Join WhatsApp Community
              </a>
            </div>

            {/* Share */}
            <div className="text-center pt-2">
              <p className="text-[#4a6b57] text-sm font-medium mb-3">
                Know someone who&apos;d benefit? Share the webinar 👇
              </p>
              <div className="flex justify-center gap-3">
                {[
                  {
                    label: "WhatsApp",
                    href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`🌱 I just registered for "${webinar.title}"! Join me: https://webinar.kravemicrogreens.in`)}`,
                    bg: "bg-[#25D366]",
                  },
                  {
                    label: "Twitter / X",
                    href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`🌱 Joining "${webinar.title}"! Register here: https://webinar.kravemicrogreens.in`)}`,
                    bg: "bg-gray-900",
                  },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${s.bg} text-white text-xs font-bold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity`}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="text-center pt-2">
              <Link
                href="/"
                className="text-[#1e5631] text-sm font-bold hover:underline"
              >
                ← Back to webinar page
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

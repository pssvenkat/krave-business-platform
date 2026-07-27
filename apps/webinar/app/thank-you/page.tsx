import type { Metadata } from "next";
import Link from "next/link";
import { WEBINAR } from "../content";

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

  return (
    <main className="min-h-screen krave-gradient flex items-center justify-center px-4">
      {/* Confetti-like decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {["🌱", "✨", "🎉", "💚", "⭐"].map((emoji, i) => (
          <div
            key={i}
            className="absolute text-2xl opacity-20 animate-bounce"
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
        <div className="bg-white rounded-3xl shadow-2xl shadow-green-900/40 overflow-hidden">
          {/* Top bar */}
          <div className="bg-green-500 px-8 py-6 text-center">
            <div className="text-5xl mb-3">🎉</div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              You&apos;re In, {name}!
            </h1>
            <p className="text-green-100 mt-1">
              Your spot has been reserved successfully.
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Webinar details box */}
            <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
              <p className="text-green-700 font-bold text-sm mb-3 uppercase tracking-wide">
                Webinar Details
              </p>
              <div className="space-y-2 text-sm">
                {[
                  { icon: "📋", label: "Topic", value: WEBINAR.title },
                  { icon: "🗓️", label: "Date", value: WEBINAR.date },
                  { icon: "⏰", label: "Time", value: WEBINAR.time + " · " + WEBINAR.duration },
                  { icon: "💻", label: "Where", value: "YouTube Live (link in your email)" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span>{item.icon}</span>
                    <span className="text-gray-500">{item.label}:</span>
                    <span className="text-gray-800 font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirmation email notice */}
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm">
              <span className="text-xl">📧</span>
              <p className="text-blue-800">
                A confirmation email has been sent to you with the webinar link and
                reminder schedule. Check your spam folder if you don&apos;t see it.
              </p>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={WEBINAR.googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="add-to-calendar-btn"
                className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-green-400 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-all duration-200 text-sm hover:shadow-md"
              >
                📅 Add to Calendar
              </a>
              <a
                href={WEBINAR.whatsappCommunityUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="join-whatsapp-btn"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20c45b] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 text-sm shadow-md shadow-green-900/20"
              >
                💬 Join WhatsApp Community
              </a>
            </div>

            {/* Share */}
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-3">
                Know someone who&apos;d benefit? Share the webinar 👇
              </p>
              <div className="flex justify-center gap-3">
                {[
                  {
                    label: "WhatsApp",
                    href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`🌱 I just registered for a free webinar on how to start a microgreens business from home! Join me: https://webinar.kravemicrogreens.in`)}`,
                    bg: "bg-[#25D366]",
                  },
                  {
                    label: "Twitter / X",
                    href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`🌱 Joining a FREE webinar on starting a profitable microgreens business! Register here: https://webinar.kravemicrogreens.in`)}`,
                    bg: "bg-gray-900",
                  },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${s.bg} text-white text-xs font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity`}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="text-center pt-2">
              <Link
                href="/"
                className="text-green-600 text-sm font-medium hover:underline"
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

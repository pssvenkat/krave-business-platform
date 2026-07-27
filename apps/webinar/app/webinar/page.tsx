import type { Metadata } from "next";
import { WEBINAR, SPEAKER } from "../content";

export const metadata: Metadata = {
  title: `Live Now: ${WEBINAR.title} | Krave Microgreens`,
  description: `Watch the live webinar with ${SPEAKER.name}. ${WEBINAR.title}.`,
  robots: { index: false, follow: false },
};

function getWebinarStatus(dateISO: string): "upcoming" | "live" | "ended" {
  const now = Date.now();
  const start = new Date(dateISO).getTime();
  const durationMs = 90 * 60 * 1000; // 90 minutes
  if (now < start) return "upcoming";
  if (now < start + durationMs) return "live";
  return "ended";
}

export default function WebinarPage() {
  const status = getWebinarStatus(WEBINAR.dateISO);

  return (
    <main className="min-h-screen bg-[#080f0b] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🌱</span>
            <span className="font-bold text-white">Krave Microgreens</span>
          </div>

          {/* Status badge */}
          {status === "live" && (
            <div className="flex items-center gap-2 bg-red-500/20 border border-red-400/40 rounded-full px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-red-400 text-xs font-bold uppercase tracking-wide">Live Now</span>
            </div>
          )}
          {status === "upcoming" && (
            <div className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-400/40 rounded-full px-3 py-1">
              <span className="text-yellow-400 text-xs font-bold uppercase tracking-wide">🕐 Starting Soon</span>
            </div>
          )}
          {status === "ended" && (
            <div className="flex items-center gap-2 bg-gray-500/20 border border-gray-400/40 rounded-full px-3 py-1">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wide">Ended</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video embed — 2/3 width */}
          <div className="lg:col-span-2">
            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-black text-white mb-4 leading-snug">
              {WEBINAR.title}
            </h1>

            {/* YouTube embed */}
            <div className="relative w-full rounded-2xl overflow-hidden bg-black shadow-2xl shadow-green-900/20" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src={`https://www.youtube.com/embed/${WEBINAR.youtubeVideoId}?autoplay=0&rel=0&modestbranding=1`}
                title={WEBINAR.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>

            {/* Status message */}
            {status === "upcoming" && (
              <div className="mt-4 bg-yellow-900/30 border border-yellow-700/30 rounded-xl p-4 text-yellow-200 text-sm">
                ⏳ The webinar hasn&apos;t started yet. The stream will go live on{" "}
                <strong>{WEBINAR.date} at {WEBINAR.time}</strong>. Keep this tab open!
              </div>
            )}
            {status === "ended" && (
              <div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-4 text-gray-400 text-sm">
                📽️ This webinar has ended. A replay may be available soon — check your email.
              </div>
            )}

            {/* Speaker */}
            <div className="mt-6 flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-800 flex items-center justify-center text-2xl flex-shrink-0">
                🌱
              </div>
              <div>
                <p className="text-white font-bold">{SPEAKER.name}</p>
                <p className="text-gray-400 text-sm">{SPEAKER.title}</p>
              </div>
            </div>
          </div>

          {/* Sidebar — 1/3 width */}
          <div className="space-y-4">
            {/* Info card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h2 className="text-white font-bold mb-4">Webinar Info</h2>
              <div className="space-y-3 text-sm">
                {[
                  { icon: "🗓️", label: "Date", value: WEBINAR.date },
                  { icon: "⏰", label: "Time", value: WEBINAR.time },
                  { icon: "⏱️", label: "Duration", value: WEBINAR.duration },
                  { icon: "💻", label: "Platform", value: "YouTube Live" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span>{item.icon}</span>
                    <span className="text-gray-400">{item.label}:</span>
                    <span className="text-white font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp */}
            <a
              href={WEBINAR.whatsappCommunityUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20c45b] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 text-sm"
            >
              💬 Join the WhatsApp Community
            </a>

            {/* Q&A note */}
            <div className="bg-green-900/30 border border-green-700/30 rounded-xl p-4 text-sm text-green-200">
              <p className="font-bold mb-1">📢 Live Q&A</p>
              <p>
                Ask your questions in the YouTube live chat. {SPEAKER.name} will answer
                them in the last 20 minutes of the webinar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

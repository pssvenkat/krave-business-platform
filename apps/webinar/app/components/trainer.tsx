import Image from "next/image";
import { SPEAKER } from "../content";

export function Trainer() {
  return (
    <section id="trainer" className="py-24 bg-[#0d2318]">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block bg-green-900/60 text-green-400 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            YOUR TRAINER
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Learn From India&apos;s Leading Microgreens Expert
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Photo */}
          <div className="flex-shrink-0">
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-green-500/20 blur-2xl scale-110" />
              <div className="relative w-52 h-52 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 border-green-500/40 shadow-2xl shadow-green-900/60">
                {/* Fallback shown when image is missing */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-800 to-green-950 text-7xl">
                  🌱
                </div>
                <Image
                  src={SPEAKER.imageUrl}
                  alt={SPEAKER.name}
                  fill
                  className="object-cover relative"
                />
              </div>
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-3xl font-black text-white mb-1">{SPEAKER.name}</h3>
            <p className="text-green-400 font-semibold mb-6">{SPEAKER.title}</p>
            <p className="text-green-100/70 text-base leading-relaxed mb-8">
              {SPEAKER.bio}
            </p>

            {/* Credential chips */}
            <div className="flex flex-wrap gap-3">
              {SPEAKER.credentials.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-green-900/40 border border-green-700/40 rounded-lg px-4 py-2"
                >
                  <span className="text-green-400">✓</span>
                  <span className="text-green-200 text-sm font-medium">{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

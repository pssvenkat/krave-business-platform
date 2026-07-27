import Image from "next/image";
import { SPEAKER } from "../content";
import { WebinarData } from "../lib/get-webinar";

export function Trainer({ webinar }: { webinar?: WebinarData }) {
  const name = webinar?.speakerName || SPEAKER.name;
  const title = webinar?.speakerTitle || SPEAKER.title;
  const bio = webinar?.speakerBio || SPEAKER.bio;
  const credentials = webinar?.speakerCredentials || SPEAKER.credentials;
  let imageUrl = webinar?.speakerImageUrl || SPEAKER.imageUrl;

  // Auto-normalize URLs like "/trainer" or "trainer" to "/trainer.jpg"
  if (imageUrl && !imageUrl.startsWith("http") && !imageUrl.includes(".")) {
    const cleanPath = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
    imageUrl = `${cleanPath}.jpg`;
  }

  const isExternal = imageUrl?.startsWith("http");

  return (
    <section id="trainer" className="py-24 bg-[#f4f9f5] border-y border-[#e2efe6]">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block bg-[#e2efe6] text-[#1e5631] text-xs font-bold px-4 py-1.5 rounded-full mb-3 tracking-wider uppercase">
            YOUR TRAINER
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#143623]">
            Learn From India&apos;s Leading Microgreens Expert
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12 bg-white rounded-3xl p-8 sm:p-12 border border-[#e2efe6] shadow-xl shadow-green-950/5">
          {/* Photo */}
          <div className="flex-shrink-0">
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-green-200/50 blur-2xl scale-110" />
              <div className="relative w-52 h-52 sm:w-64 sm:h-64 rounded-full overflow-hidden border-4 border-[#1e5631] shadow-xl bg-emerald-50">
                {/* Fallback shown when image is missing */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 text-7xl">
                  🌱
                </div>
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    unoptimized={isExternal}
                    className="object-cover relative"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-3xl font-black text-[#143623] mb-1">{name}</h3>
            <p className="text-[#2d7d46] font-bold text-lg mb-4">{title}</p>
            <p className="text-[#4a6b57] text-base leading-relaxed mb-8 font-medium">
              {bio}
            </p>

            {/* Credential chips */}
            {credentials && credentials.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {credentials.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-[#f0f7f2] border border-[#d0e6d6] rounded-xl px-4 py-2.5"
                  >
                    <span className="text-[#1e5631] font-bold">✓</span>
                    <span className="text-[#143623] text-sm font-semibold">{c}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

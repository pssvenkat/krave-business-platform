import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Krave Academy — Microgreens Masterclass",
  description: "Watch video lessons, track your progress, and earn your certified microgreens grower certificate.",
};

const MODULES = [
  {
    id: "m1",
    number: "01",
    title: "Microgreens Basics & Seed Selection",
    description: "Explore non-GMO seed varieties, substrate types, and initial tray setup.",
    lessons: [
      { id: "l1", title: "Introduction to Microgreens Farming", duration: "11m", done: true },
      { id: "l2", title: "Seed Varieties: Radish, Sunflower, Mustard", duration: "12m", done: true },
      { id: "l3", title: "Preparing Trays, Substrate & Initial Soak", duration: "14m", done: true },
      { id: "l4", title: "Workspace Setup for Home & Balcony Grows", duration: "10m", done: true },
    ],
    color: "from-emerald-500 to-teal-600",
    active: false,
  },
  {
    id: "m2",
    number: "02",
    title: "Germination, Blackout & Moisture Control",
    description: "Master the blackout phase, watering schedule, and preventing mold.",
    lessons: [
      { id: "l5", title: "The Blackout Phase Explained", duration: "15m", done: true },
      { id: "l6", title: "Watering Schedules & Bottom-Watering Technique", duration: "18m", done: false, current: true },
      { id: "l7", title: "Mold Prevention & Air Circulation", duration: "14m", done: false },
      { id: "l8", title: "Light Requirements After Germination", duration: "12m", done: false },
      { id: "l9", title: "Troubleshooting Common Growth Problems", duration: "16m", done: false },
    ],
    color: "from-green-600 to-emerald-700",
    active: true,
  },
  {
    id: "m3",
    number: "03",
    title: "Harvesting, Packaging & Shelf Life",
    description: "Harvesting at peak nutrition, eco-packaging, and refrigeration strategies.",
    lessons: [
      { id: "l10", title: "Harvesting at Peak Nutrition Window", duration: "13m", done: false },
      { id: "l11", title: "Cleaning & Packaging for Retail", duration: "12m", done: false },
      { id: "l12", title: "Extending Shelf Life: Cold Chain Management", duration: "15m", done: false },
      { id: "l13", title: "Labelling, Branding & Certifications", duration: "11m", done: false },
    ],
    color: "from-lime-600 to-green-700",
    active: false,
  },
  {
    id: "m4",
    number: "04",
    title: "Building Your Microgreens Business",
    description: "Pricing, sales channels, Instagram marketing, and scaling up production.",
    lessons: [
      { id: "l14", title: "Pricing Your Microgreens Profitably", duration: "16m", done: false },
      { id: "l15", title: "Selling to Restaurants & Cafes", duration: "20m", done: false },
      { id: "l16", title: "Direct-to-Consumer & Subscription Boxes", duration: "15m", done: false },
      { id: "l17", title: "Instagram & WhatsApp Sales Strategy", duration: "18m", done: false },
      { id: "l18", title: "Scaling from Hobby to 10K/month Business", duration: "22m", done: false },
      { id: "l19", title: "Financial Planning & Growth Roadmap", duration: "18m", done: false },
    ],
    color: "from-amber-500 to-orange-600",
    active: false,
  },
];

const totalLessons = MODULES.flatMap((m) => m.lessons).length;
const completedLessons = MODULES.flatMap((m) => m.lessons).filter((l) => l.done).length;
const progressPct = Math.round((completedLessons / totalLessons) * 100);
const currentLesson = MODULES.flatMap((m) => m.lessons).find((l: any) => l.current);
const currentModule = MODULES.find((m) => m.active);

export default function StudentAcademyPage() {
  return (
    <main className="min-h-screen bg-[#f8faf5]">

      {/* ── Top Nav ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#e2efe6] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-white border border-[#e2efe6] rounded-xl px-3 py-1.5 shadow-xs">
              <Image src="/logo.jpg" alt="Krave Microgreens" width={110} height={40} className="h-8 w-auto object-contain" />
            </div>
            <span className="hidden sm:block text-[#143623] font-black text-base pl-3 border-l border-[#e2efe6]">
              Academy
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-[#edf6f0] border border-[#d0e6d6] px-3.5 py-2 rounded-xl">
              <div className="w-24 bg-[#d0e6d6] h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-[#1e5631] rounded-full" style={{ width: `${progressPct}%` }} />
              </div>
              <span className="text-[#1e5631] font-black text-xs">{progressPct}% Complete</span>
            </div>
            <Link href="/" className="text-xs font-bold text-[#4a6b57] hover:text-[#143623] transition-colors">
              ← Back to Webinar
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT: Video Player + Lesson Info ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Hero Banner */}
            <div className="bg-gradient-to-br from-[#143623] to-[#1e5631] rounded-3xl p-6 text-white flex flex-col sm:flex-row gap-5 items-center shadow-xl">
              <div className="flex-1">
                <span className="inline-block bg-[#6cc24a] text-[#143623] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-3">
                  Now Playing
                </span>
                <h1 className="text-xl sm:text-2xl font-black leading-snug">
                  {currentLesson?.title ?? "Welcome to Krave Academy"}
                </h1>
                <p className="text-green-200 text-sm mt-1 font-medium">
                  Module 2 · Lesson 2 of 5 · {currentLesson?.duration ?? "18m"}
                </p>
              </div>
              <div className="text-center flex-shrink-0">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#6cc24a" strokeWidth="3"
                      strokeDasharray={`${progressPct} 100`} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-white font-black text-xl">{progressPct}%</span>
                    <span className="text-green-200 text-[9px] font-bold">DONE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Player */}
            <div className="bg-black rounded-3xl overflow-hidden aspect-video shadow-xl">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?modestbranding=1&rel=0"
                title="Lesson Video"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Lesson Description */}
            <div className="bg-white border border-[#e2efe6] rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-[#143623] font-black text-lg">{currentLesson?.title}</h2>
                  <p className="text-[#4a6b57] text-sm font-medium">Module 2 — Germination, Blackout & Moisture Control</p>
                </div>
                <button type="button" className="bg-[#edf6f0] hover:bg-[#d0e6d6] border border-[#d0e6d6] text-[#1e5631] font-bold text-xs px-4 py-2 rounded-xl transition-all">
                  ✓ Mark Complete
                </button>
              </div>
              <p className="text-[#4a6b57] text-sm leading-relaxed">
                In this lesson, Shanthi demonstrates the precise watering technique using a bottom-watering tray system.
                Learn how to maintain the ideal moisture level without overwatering — the most common cause of failed microgreen grows.
                You'll also see how to identify early signs of mold and take corrective action.
              </p>
            </div>

            {/* Next/Prev Navigation */}
            <div className="flex gap-4">
              <button type="button" className="flex-1 py-3 bg-white border border-[#e2efe6] text-[#4a6b57] hover:bg-[#f0f7f2] font-bold text-sm rounded-xl transition-all">
                ← Previous Lesson
              </button>
              <button type="button" className="flex-1 py-3 bg-[#1e5631] hover:bg-[#163f24] text-white font-bold text-sm rounded-xl transition-all shadow-sm">
                Next Lesson →
              </button>
            </div>
          </div>

          {/* ── RIGHT: Course Module List + Certificate ── */}
          <div className="space-y-5">

            {/* Progress Summary */}
            <div className="bg-white border border-[#e2efe6] rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-[#143623] font-bold text-sm">Your Progress</h3>
              <div className="flex items-center justify-between text-xs font-bold text-[#4a6b57]">
                <span>{completedLessons} of {totalLessons} lessons done</span>
                <span className="text-[#1e5631]">{progressPct}%</span>
              </div>
              <div className="w-full bg-[#edf6f0] h-2.5 rounded-full overflow-hidden">
                <div className="h-full bg-[#1e5631] rounded-full transition-all duration-700" style={{ width: `${progressPct}%` }} />
              </div>
            </div>

            {/* Course Modules */}
            <div className="bg-white border border-[#e2efe6] rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-[#e2efe6]">
                <h3 className="text-[#143623] font-bold text-sm">Course Modules</h3>
              </div>
              <div className="divide-y divide-[#f0f7f2] max-h-[480px] overflow-y-auto">
                {MODULES.map((mod) => {
                  const modDone = mod.lessons.filter((l) => l.done).length;
                  const modTotal = mod.lessons.length;
                  const modPct = Math.round((modDone / modTotal) * 100);
                  return (
                    <div key={mod.id} className={`${mod.active ? "bg-[#f0f7f2]" : ""}`}>
                      {/* Module Header */}
                      <div className="px-4 py-3 flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center text-white font-black text-xs flex-shrink-0`}>
                          {mod.number}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[#143623] font-bold text-xs leading-snug truncate">{mod.title}</p>
                          <p className="text-[#6b8e78] text-[10px] font-medium">{modDone}/{modTotal} lessons</p>
                        </div>
                        {modPct === 100 && <span className="text-green-600 font-black text-xs">✓</span>}
                      </div>

                      {/* Lessons */}
                      <div className="pl-4 pr-3 pb-2 space-y-1">
                        {mod.lessons.map((les: any) => (
                          <div
                            key={les.id}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold cursor-pointer transition-all ${
                              les.current
                                ? "bg-[#1e5631] text-white"
                                : les.done
                                ? "bg-[#edf6f0] text-[#1e5631]"
                                : "text-[#4a6b57] hover:bg-[#f0f7f2]"
                            }`}
                          >
                            <span className="flex-shrink-0 text-[10px]">
                              {les.current ? "▶" : les.done ? "✓" : "○"}
                            </span>
                            <span className="flex-1 truncate">{les.title}</span>
                            <span className={`flex-shrink-0 text-[10px] ${les.current ? "text-white/70" : "text-[#6b8e78]"}`}>
                              {les.duration}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Certificate CTA */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 text-center space-y-3 shadow-sm">
              <span className="text-4xl block">🎓</span>
              <h3 className="text-[#143623] font-black text-base">Your Certificate Awaits</h3>
              <p className="text-[#4a6b57] text-xs leading-relaxed">
                Complete all {totalLessons} lessons to unlock your official
                <strong className="text-[#143623]"> Certified Microgreens Grower</strong> PDF certificate.
              </p>
              <div className="w-full bg-amber-100 h-2 rounded-full overflow-hidden border border-amber-200">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${progressPct}%` }} />
              </div>
              <p className="text-amber-700 text-xs font-bold">{totalLessons - completedLessons} lessons remaining</p>
              <button
                type="button"
                disabled={progressPct < 100}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-200 disabled:text-amber-400 text-white font-bold text-sm rounded-xl transition-all shadow-sm"
              >
                📜 Download Certificate
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

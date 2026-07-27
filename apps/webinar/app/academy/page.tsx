import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Academy & Video Portal | Krave Microgreens",
  description: "Access course modules, video lessons, and download your completion certificate.",
};

const MODULES = [
  {
    title: "Module 1: Microgreens Setup & Seed Selection",
    duration: "45 mins",
    completed: true,
    lessons: [
      { id: "1", title: "1.1 Introduction to Microgreens Farming", duration: "10m", completed: true },
      { id: "2", title: "1.2 Seed Varieties: Radish, Sunflower, Mustard", duration: "12m", completed: true },
      { id: "3", title: "1.3 Preparing Grow Trays & Substrates", duration: "15m", completed: true },
    ],
  },
  {
    title: "Module 2: Germination, Harvest & Maintenance",
    duration: "60 mins",
    completed: false,
    lessons: [
      { id: "4", title: "2.1 Blackout Period & Moisture Control", duration: "18m", completed: true },
      { id: "5", title: "2.2 Harvesting Clean Sprouts for Long Shelf Life", duration: "22m", completed: false },
      { id: "6", title: "2.3 Preventing Mold & Pest Control", duration: "20m", completed: false },
    ],
  },
];

export default function StudentAcademyPage() {
  return (
    <main className="min-h-screen bg-[#f8faf5]">
      {/* Header Bar */}
      <header className="bg-white border-b border-[#e2efe6] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-white border border-[#e2efe6] rounded-xl px-3.5 py-1.5 shadow-xs">
              <Image
                src="/logo.jpg"
                alt="Krave Microgreens"
                width={110}
                height={40}
                className="h-8 w-auto object-contain"
              />
            </div>
            <span className="text-[#143623] font-black text-lg border-l border-gray-200 pl-3">
              Academy Portal
            </span>
          </Link>
          <Link
            href="/"
            className="text-xs font-bold text-[#1e5631] bg-[#edf6f0] hover:bg-[#d0e6d6] px-4 py-2 rounded-xl transition-all"
          >
            ← Back to Webinar
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        {/* Banner */}
        <div className="bg-[#1e5631] rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="inline-block bg-[#6cc24a] text-[#143623] text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-3">
              STUDENT LEARNING HUB
            </span>
            <h1 className="text-3xl font-black">Microgreens Masterclass & Video Portal</h1>
            <p className="text-green-100 text-sm mt-1 max-w-xl">
              Watch video tutorials, complete module checklists, and download your official grower certificate.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-center min-w-48 flex-shrink-0">
            <span className="text-green-200 text-xs font-bold block uppercase tracking-wider">Course Progress</span>
            <span className="text-3xl font-black text-white mt-1 block">65%</span>
            <span className="text-green-100 text-xs font-medium">4 of 6 Lessons Completed</span>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-black rounded-3xl overflow-hidden shadow-xl aspect-video relative flex items-center justify-center">
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Lesson Video"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="bg-white border border-[#e2efe6] rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-black text-[#143623]">
                Lesson 2.1: Blackout Period & Moisture Control
              </h2>
              <p className="text-[#4a6b57] text-sm mt-2 leading-relaxed">
                In this lesson, Shanthi demonstrates how to stack microgreen trays during the initial 3-day blackout phase to promote strong root anchorage and uniform stem length.
              </p>
            </div>
          </div>

          {/* Module List Sidebar */}
          <div className="space-y-6">
            <div className="bg-white border border-[#e2efe6] rounded-2xl p-6 shadow-sm">
              <h3 className="text-[#143623] font-bold text-base mb-4">Course Modules</h3>
              <div className="space-y-5">
                {MODULES.map((mod, i) => (
                  <div key={i} className="border-b border-[#e2efe6] last:border-0 pb-4 last:pb-0">
                    <h4 className="text-[#143623] font-extrabold text-xs mb-2">{mod.title}</h4>
                    <div className="space-y-1.5">
                      {mod.lessons.map((les) => (
                        <div
                          key={les.id}
                          className={`p-2.5 rounded-xl text-xs flex items-center justify-between font-semibold cursor-pointer transition-all ${
                            les.completed
                              ? "bg-[#edf6f0] text-[#1e5631] border border-[#d0e6d6]"
                              : "bg-[#f8faf5] text-[#4a6b57] hover:bg-[#f0f7f2]"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{les.completed ? "✓" : "▶"}</span>
                            <span>{les.title}</span>
                          </span>
                          <span className="text-[10px] text-gray-400">{les.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificate Widget */}
            <div className="bg-white border border-[#e2efe6] rounded-2xl p-6 shadow-sm text-center space-y-3">
              <span className="text-3xl block">📜</span>
              <h3 className="text-[#143623] font-black text-base">Download Certificate</h3>
              <p className="text-[#4a6b57] text-xs leading-relaxed">
                Complete all course modules to unlock your official Certified Microgreens Grower PDF certificate.
              </p>
              <button
                type="button"
                className="w-full bg-[#1e5631] hover:bg-[#2d7d46] text-white font-bold text-xs py-3 rounded-xl transition-all shadow-sm"
              >
                🎓 Generate PDF Certificate
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export interface LessonItem {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  description: string;
}

export interface CourseModule {
  id: string;
  number: string;
  title: string;
  description: string;
  color: string;
  lessons: LessonItem[];
}

const INITIAL_MODULES: CourseModule[] = [
  {
    id: "m1",
    number: "01",
    title: "Microgreens Basics & Seed Selection",
    description: "Explore non-GMO seed varieties, substrate types, and initial tray setup.",
    color: "from-emerald-500 to-teal-600",
    lessons: [
      {
        id: "l1",
        title: "Introduction to Microgreens Farming",
        duration: "11 mins",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "Welcome to Krave Microgreens Masterclass! Learn why microgreens are 40x more nutrient-dense than mature greens and how to start growing at home.",
      },
      {
        id: "l2",
        title: "Seed Varieties: Radish, Sunflower, Mustard",
        duration: "12 mins",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "Detailed breakdown of top commercial microgreen seed varieties. Learn seed density, soaking requirements, and germination rates.",
      },
      {
        id: "l3",
        title: "Preparing Trays, Substrate & Initial Soak",
        duration: "14 mins",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "Step-by-step substrate preparation using coco coir & peat moss. Proper tray sanitization and initial soaking techniques.",
      },
      {
        id: "l4",
        title: "Workspace Setup for Home & Balcony Grows",
        duration: "10 mins",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "Setting up your growing racks, LED grow lights, and airflow fans in compact home spaces.",
      },
    ],
  },
  {
    id: "m2",
    number: "02",
    title: "Germination, Blackout & Moisture Control",
    description: "Master the blackout phase, watering schedule, and preventing mold.",
    color: "from-green-600 to-emerald-700",
    lessons: [
      {
        id: "l5",
        title: "The Blackout Phase Explained",
        duration: "15 mins",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "Why weight stacking and blackout darkness are essential for strong, vertical microgreens stem growth.",
      },
      {
        id: "l6",
        title: "Watering Schedules & Bottom-Watering Technique",
        duration: "18 mins",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "Shanthi demonstrates bottom-watering technique. Learn how to maintain ideal moisture without overwatering or causing damp-off.",
      },
      {
        id: "l7",
        title: "Mold Prevention & Air Circulation",
        duration: "14 mins",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "How to identify web mold vs root hairs, hydrogen peroxide spraying protocols, and maintaining 50% relative humidity.",
      },
      {
        id: "l8",
        title: "Light Requirements After Germination",
        duration: "12 mins",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "Unstacking your trays and introducing 14-16 hours of daily light for vibrant chlorophyll greening.",
      },
      {
        id: "l9",
        title: "Troubleshooting Common Growth Problems",
        duration: "16 mins",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "Diagnosing yellow leaves, uneven germination, foul odor, and stunted sprouts.",
      },
    ],
  },
  {
    id: "m3",
    number: "03",
    title: "Harvesting, Packaging & Shelf Life",
    description: "Harvesting at peak nutrition, eco-packaging, and refrigeration strategies.",
    color: "from-lime-600 to-green-700",
    lessons: [
      {
        id: "l10",
        title: "Harvesting at Peak Nutrition Window",
        duration: "13 mins",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "Using sharp harvesting knives to cut clean microgreens stems at day 8-12 post-sowing.",
      },
      {
        id: "l11",
        title: "Cleaning & Packaging for Retail",
        duration: "12 mins",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "Drying sprouts using salad spinners and packing into eco-friendly breathable clamshell containers.",
      },
      {
        id: "l12",
        title: "Extending Shelf Life: Cold Chain Management",
        duration: "15 mins",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "Refrigeration temperature control (2-4°C) to extend fresh shelf life up to 14 days.",
      },
      {
        id: "l13",
        title: "Labelling, Branding & Certifications",
        duration: "11 mins",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "FSSAI food license guidelines, nutrition facts labelling, and brand design.",
      },
    ],
  },
  {
    id: "m4",
    number: "04",
    title: "Building Your Microgreens Business",
    description: "Pricing, sales channels, Instagram marketing, and scaling up production.",
    color: "from-amber-500 to-orange-600",
    lessons: [
      {
        id: "l14",
        title: "Pricing Your Microgreens Profitably",
        duration: "16 mins",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "Cost per tray calculations, seed costs, substrate overhead, and pricing per 100g box.",
      },
      {
        id: "l15",
        title: "Selling to Restaurants & Cafes",
        duration: "20 mins",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "Chef pitch scripts, free sample tray delivery, and building recurring B2B weekly orders.",
      },
      {
        id: "l16",
        title: "Direct-to-Consumer & Subscription Boxes",
        duration: "15 mins",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "Setting up weekly home delivery subscription routes in your local city.",
      },
      {
        id: "l17",
        title: "Instagram & WhatsApp Sales Strategy",
        duration: "18 mins",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "Posting harvest reels, customer testimonials, and automated WhatsApp order booking.",
      },
      {
        id: "l18",
        title: "Scaling from Hobby to 10K/month Business",
        duration: "22 mins",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "Scaling rack capacity from 5 trays to 100 trays/week with automated drip irrigation.",
      },
      {
        id: "l19",
        title: "Financial Planning & Growth Roadmap",
        duration: "18 mins",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        description: "Managing cashflow, reinvesting profits, hiring farm assistants, and expanding varieties.",
      },
    ],
  },
];

export function StudentAcademyPlayer() {
  const [modules] = useState<CourseModule[]>(INITIAL_MODULES);
  
  // All flat lessons
  const allLessons = modules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleId: m.id, moduleTitle: m.title }))
  );

  const [activeLessonId, setActiveLessonId] = useState<string>("l6");
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(["l1", "l2", "l3", "l4", "l5"]);

  // Load local completion state
  useEffect(() => {
    const saved = localStorage.getItem("krave_completed_lessons");
    if (saved) {
      try {
        setCompletedLessonIds(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  const toggleComplete = (lessonId: string) => {
    setCompletedLessonIds((prev) => {
      const next = prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId];
      localStorage.setItem("krave_completed_lessons", JSON.stringify(next));
      return next;
    });
  };

  const currentLessonIndex = allLessons.findIndex((l) => l.id === activeLessonId);
  const currentLesson = allLessons[currentLessonIndex] ?? allLessons[0]!;
  const currentModule = modules.find((m) => m.id === currentLesson.moduleId) ?? modules[0]!;

  const totalLessonsCount = allLessons.length;
  const completedCount = completedLessonIds.length;
  const progressPct = Math.round((completedCount / totalLessonsCount) * 100);

  const handleNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      setActiveLessonId(allLessons[currentLessonIndex + 1]!.id);
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setActiveLessonId(allLessons[currentLessonIndex - 1]!.id);
    }
  };

  const downloadCertificate = () => {
    alert("🎉 Congratulations! Your official Certified Microgreens Grower Certificate has been generated. Preparing your PDF download...");
  };

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
              Academy Masterclass
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-[#edf6f0] border border-[#d0e6d6] px-3.5 py-2 rounded-xl">
              <div className="w-24 bg-[#d0e6d6] h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-[#1e5631] rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
              </div>
              <span className="text-[#1e5631] font-black text-xs">{progressPct}% Complete</span>
            </div>
            <Link href="/" className="text-xs font-bold text-[#4a6b57] hover:text-[#143623] transition-colors">
              ← Back to Portal
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT: Video Player + Lesson Info ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Hero Header Banner */}
            <div className="bg-gradient-to-br from-[#143623] to-[#1e5631] rounded-3xl p-6 text-white flex flex-col sm:flex-row gap-5 items-center shadow-xl">
              <div className="flex-1">
                <span className="inline-block bg-[#6cc24a] text-[#143623] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-2.5">
                  Now Playing
                </span>
                <h1 className="text-xl sm:text-2xl font-black leading-snug">
                  {currentLesson.title}
                </h1>
                <p className="text-green-200 text-xs mt-1.5 font-semibold">
                  {currentModule.title} · Lesson {currentLessonIndex + 1} of {totalLessonsCount} · {currentLesson.duration}
                </p>
              </div>

              {/* Circular Progress Meter */}
              <div className="text-center flex-shrink-0">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,.15)" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15.9" fill="none" stroke="#6cc24a" strokeWidth="3"
                      strokeDasharray={`${progressPct} 100`}
                      strokeLinecap="round"
                      className="transition-all duration-700"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-white font-black text-xl">{progressPct}%</span>
                    <span className="text-green-200 text-[9px] font-bold">DONE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Embed Video Player */}
            <div className="bg-black rounded-3xl overflow-hidden aspect-video shadow-xl">
              <iframe
                key={currentLesson.id}
                src={`${currentLesson.videoUrl}?modestbranding=1&rel=0`}
                title={currentLesson.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Lesson Details & Completion Button */}
            <div className="bg-white border border-[#e2efe6] rounded-2xl p-6 shadow-sm space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#f0f7f2] pb-4">
                <div>
                  <h2 className="text-[#143623] font-black text-lg">{currentLesson.title}</h2>
                  <p className="text-[#4a6b57] text-xs font-semibold mt-0.5">{currentModule.title}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleComplete(currentLesson.id)}
                  className={`font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs ${
                    completedLessonIds.includes(currentLesson.id)
                      ? "bg-[#1e5631] text-white"
                      : "bg-[#edf6f0] hover:bg-[#d0e6d6] border border-[#d0e6d6] text-[#1e5631]"
                  }`}
                >
                  {completedLessonIds.includes(currentLesson.id) ? "✓ Completed Lesson" : "Mark as Complete"}
                </button>
              </div>

              <p className="text-[#4a6b57] text-sm leading-relaxed font-medium">
                {currentLesson.description}
              </p>
            </div>

            {/* Next / Previous Lesson Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                disabled={currentLessonIndex === 0}
                onClick={handlePrevLesson}
                className="flex-1 py-3 bg-white border border-[#e2efe6] disabled:opacity-40 text-[#4a6b57] hover:bg-[#f0f7f2] font-bold text-sm rounded-xl transition-all"
              >
                ← Previous Lesson
              </button>
              <button
                type="button"
                disabled={currentLessonIndex === allLessons.length - 1}
                onClick={handleNextLesson}
                className="flex-1 py-3 bg-[#1e5631] hover:bg-[#163f24] disabled:opacity-40 text-white font-bold text-sm rounded-xl transition-all shadow-sm"
              >
                Next Lesson →
              </button>
            </div>
          </div>

          {/* ── RIGHT: Course Modules Drawer & Certificate ── */}
          <div className="space-y-5">

            {/* Overall Progress Box */}
            <div className="bg-white border border-[#e2efe6] rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-[#143623] font-bold text-sm">Your Progress Overview</h3>
              <div className="flex items-center justify-between text-xs font-bold text-[#4a6b57]">
                <span>{completedCount} of {totalLessonsCount} lessons done</span>
                <span className="text-[#1e5631] font-black">{progressPct}%</span>
              </div>
              <div className="w-full bg-[#edf6f0] h-2.5 rounded-full overflow-hidden">
                <div className="h-full bg-[#1e5631] rounded-full transition-all duration-700" style={{ width: `${progressPct}%` }} />
              </div>
            </div>

            {/* Course Modules Sidebar Accordion */}
            <div className="bg-white border border-[#e2efe6] rounded-2xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-[#e2efe6] bg-[#f8faf5]">
                <h3 className="text-[#143623] font-bold text-sm">Course Curriculum ({modules.length} Modules)</h3>
              </div>

              <div className="divide-y divide-[#f0f7f2] max-h-[500px] overflow-y-auto">
                {modules.map((mod) => {
                  const modDone = mod.lessons.filter((l) => completedLessonIds.includes(l.id)).length;
                  const modTotal = mod.lessons.length;
                  const isCurrentMod = mod.id === currentModule.id;

                  return (
                    <div key={mod.id} className={isCurrentMod ? "bg-[#f0f7f2]" : ""}>
                      {/* Module Header */}
                      <div className="px-4 py-3 flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center text-white font-black text-xs flex-shrink-0`}>
                          {mod.number}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[#143623] font-bold text-xs leading-snug truncate">{mod.title}</p>
                          <p className="text-[#6b8e78] text-[10px] font-medium">{modDone}/{modTotal} completed</p>
                        </div>
                        {modDone === modTotal && <span className="text-green-600 font-black text-xs">✓</span>}
                      </div>

                      {/* Lessons List */}
                      <div className="pl-4 pr-3 pb-3 space-y-1.5">
                        {mod.lessons.map((les) => {
                          const isSelected = les.id === activeLessonId;
                          const isDone = completedLessonIds.includes(les.id);

                          return (
                            <div
                              key={les.id}
                              onClick={() => setActiveLessonId(les.id)}
                              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                                isSelected
                                  ? "bg-[#1e5631] text-white shadow-xs"
                                  : isDone
                                  ? "bg-[#edf6f0] text-[#1e5631] hover:bg-[#d0e6d6]"
                                  : "text-[#4a6b57] hover:bg-[#f0f7f2]"
                              }`}
                            >
                              <span className="flex-shrink-0 text-xs font-bold">
                                {isSelected ? "▶" : isDone ? "✓" : "○"}
                              </span>
                              <span className="flex-1 truncate text-[11px] font-bold">{les.title}</span>
                              <span className={`flex-shrink-0 text-[10px] ${isSelected ? "text-white/80" : "text-[#6b8e78]"}`}>
                                {les.duration}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Graduation Certificate Download CTA */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 text-center space-y-3 shadow-sm">
              <span className="text-4xl block">🎓</span>
              <h3 className="text-[#143623] font-black text-base">Masterclass Certificate</h3>
              <p className="text-[#4a6b57] text-xs leading-relaxed">
                Complete all {totalLessonsCount} lessons to unlock your official
                <strong className="text-[#143623]"> Certified Microgreens Grower</strong> PDF certificate.
              </p>
              <div className="w-full bg-amber-100 h-2 rounded-full overflow-hidden border border-amber-200">
                <div className="h-full bg-amber-500 rounded-full transition-all duration-700" style={{ width: `${progressPct}%` }} />
              </div>
              <p className="text-amber-800 text-xs font-bold">
                {totalLessonsCount - completedCount > 0
                  ? `${totalLessonsCount - completedCount} lessons remaining`
                  : "✓ All lessons completed!"}
              </p>
              <button
                type="button"
                onClick={downloadCertificate}
                disabled={progressPct < 100}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-200 disabled:text-amber-400 text-white font-bold text-sm rounded-xl transition-all shadow-sm"
              >
                📜 Download Certificate (PDF)
              </button>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

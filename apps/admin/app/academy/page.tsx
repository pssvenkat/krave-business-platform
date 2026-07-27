import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "../components/sidebar";

export const metadata = { title: "Academy | Krave Admin" };

const MODULES = [
  {
    id: "m1",
    title: "Module 1: Microgreens Basics & Seed Selection",
    duration: "45 mins",
    lessonsCount: 4,
    status: "Published",
    lessons: [
      { id: "l1", title: "1.1 Introduction to Microgreens Farming", videoId: "dQw4w9WgXcQ" },
      { id: "l2", title: "1.2 Choosing Non-GMO & Organic Seeds", videoId: "dQw4w9WgXcQ" },
      { id: "l3", title: "1.3 Equipment & Tray Setup for Small Spaces", videoId: "dQw4w9WgXcQ" },
    ],
  },
  {
    id: "m2",
    title: "Module 2: Growing, Harvesting & Yield Optimization",
    duration: "60 mins",
    lessonsCount: 5,
    status: "Published",
    lessons: [
      { id: "l4", title: "2.1 Soil Substrate vs Hydroponic Mats", videoId: "dQw4w9WgXcQ" },
      { id: "l5", title: "2.2 Watering Schedule & Mold Prevention", videoId: "dQw4w9WgXcQ" },
      { id: "l6", title: "2.3 Harvesting Techniques for Maximum Shelf Life", videoId: "dQw4w9WgXcQ" },
    ],
  },
  {
    id: "m3",
    title: "Module 3: Commercial Packaging & Local Sales Strategy",
    duration: "50 mins",
    lessonsCount: 4,
    status: "Draft",
    lessons: [
      { id: "l7", title: "3.1 Eco-Friendly Packaging & Branding", videoId: "dQw4w9WgXcQ" },
      { id: "l8", title: "3.2 Selling to Restaurants & Direct Consumers", videoId: "dQw4w9WgXcQ" },
    ],
  },
];

export default async function AcademyAdminPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen bg-[#f8faf5]">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-[#e2efe6] px-8 py-5 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#143623]">Krave Academy</h1>
            <p className="text-[#4a6b57] text-sm mt-0.5 font-medium">
              Manage online masterclass courses, video modules, and student certifications
            </p>
          </div>
          <Link
            href="/academy/new-lesson"
            className="bg-[#1e5631] hover:bg-[#2d7d46] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm flex items-center gap-1.5"
          >
            + Add Lesson
          </Link>
        </div>

        <div className="p-8 space-y-6">
          {/* Top Banner Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white border border-[#e2efe6] rounded-2xl p-6 shadow-sm">
              <span className="text-[#4a6b57] text-xs font-bold uppercase tracking-wider">Active Course Modules</span>
              <p className="text-3xl font-black text-[#143623] mt-2">3 Modules</p>
              <p className="text-[#6b8e78] text-xs mt-1 font-medium">13 video lessons total</p>
            </div>
            <div className="bg-white border border-[#e2efe6] rounded-2xl p-6 shadow-sm">
              <span className="text-[#4a6b57] text-xs font-bold uppercase tracking-wider">Enrolled Students</span>
              <p className="text-3xl font-black text-[#1e5631] mt-2">248 Students</p>
              <p className="text-[#6b8e78] text-xs mt-1 font-medium">From 18 Indian cities</p>
            </div>
            <div className="bg-white border border-[#e2efe6] rounded-2xl p-6 shadow-sm">
              <span className="text-[#4a6b57] text-xs font-bold uppercase tracking-wider">Certificates Issued</span>
              <p className="text-3xl font-black text-[#143623] mt-2">142 PDF Certificates</p>
              <p className="text-[#6b8e78] text-xs mt-1 font-medium">Certified Organic Growers</p>
            </div>
          </div>

          {/* Course Modules List */}
          <div className="space-y-4">
            <h2 className="text-[#143623] font-bold text-lg">Masterclass Modules & Video Content</h2>
            {MODULES.map((mod) => (
              <div key={mod.id} className="bg-white border border-[#e2efe6] rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#e2efe6] pb-4 mb-4">
                  <div>
                    <h3 className="text-lg font-black text-[#143623]">{mod.title}</h3>
                    <p className="text-[#4a6b57] text-xs font-medium mt-0.5">
                      {mod.duration} · {mod.lessonsCount} Video Lessons
                    </p>
                  </div>
                  <span
                    className={`px-3.5 py-1 rounded-full text-xs font-bold ${
                      mod.status === "Published"
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-amber-50 text-amber-800 border border-amber-200"
                    }`}
                  >
                    {mod.status}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {mod.lessons.map((les) => (
                    <div
                      key={les.id}
                      className="flex items-center justify-between p-3.5 bg-[#f8faf5] border border-[#e2efe6] rounded-xl hover:border-[#b8dbc3] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[#1e5631] font-bold text-base">▶</span>
                        <span className="text-[#143623] font-bold text-sm">{les.title}</span>
                      </div>
                      <a
                        href={`https://youtube.com/watch?v=${les.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1e5631] font-bold text-xs hover:underline"
                      >
                        Preview Video ↗
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

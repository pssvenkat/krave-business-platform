import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "../components/sidebar";

export const metadata = { title: "Academy | Krave Admin" };

const MODULES = [
  {
    id: "m1",
    number: "01",
    title: "Microgreens Basics & Seed Selection",
    description: "Non-GMO seed varieties, substrate selection, tray setup for home & commercial grow.",
    duration: "45 mins",
    lessons: 4,
    status: "published" as const,
    completions: 192,
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "m2",
    number: "02",
    title: "Germination, Blackout & Moisture Control",
    description: "Optimal watering schedules, mold prevention strategies, and ideal blackout periods.",
    duration: "55 mins",
    lessons: 5,
    status: "published" as const,
    completions: 148,
    color: "from-green-600 to-emerald-700",
  },
  {
    id: "m3",
    number: "03",
    title: "Harvesting, Packaging & Shelf Life",
    description: "Harvesting clean sprouts, eco-packaging, refrigeration to maximise fresh shelf life.",
    duration: "40 mins",
    lessons: 4,
    status: "published" as const,
    completions: 112,
    color: "from-lime-600 to-green-700",
  },
  {
    id: "m4",
    number: "04",
    title: "Selling: Restaurants, D2C & Social Media",
    description: "Pricing strategy, restaurant pitch scripts, Instagram marketing, and B2B sales.",
    duration: "60 mins",
    lessons: 6,
    status: "draft" as const,
    completions: 0,
    color: "from-amber-500 to-orange-600",
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

  const published = MODULES.filter((m) => m.status === "published").length;
  const totalLessons = MODULES.reduce((a, m) => a + m.lessons, 0);

  return (
    <div className="flex min-h-screen bg-[#f8faf5]">
      <Sidebar />
      <div className="flex-1 overflow-auto">

        {/* Header */}
        <div className="bg-white border-b border-[#e2efe6] px-8 py-5 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#143623]">Krave Academy</h1>
            <p className="text-[#4a6b57] text-sm mt-0.5 font-medium">
              Manage masterclass modules, video lessons & student completions
            </p>
          </div>
          <Link
            href="/academy/new"
            className="inline-flex items-center gap-2 bg-[#1e5631] hover:bg-[#163f24] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-green-900/20"
          >
            + New Module
          </Link>
        </div>

        <div className="p-8 space-y-6">

          {/* ── KPIs ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Course Modules",     value: MODULES.length,   icon: "📚", sub: `${published} published` },
              { label: "Total Lessons",      value: totalLessons,      icon: "▶️", sub: "Video lessons" },
              { label: "Enrolled Students",  value: 312,               icon: "👩‍🎓", sub: "Across all modules" },
              { label: "Certificates Issued",value: 186,               icon: "📜", sub: "Certified Growers" },
            ].map((k) => (
              <div key={k.label} className="bg-white border border-[#e2efe6] rounded-2xl p-5 shadow-sm space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[#6b8e78] text-[11px] font-bold uppercase tracking-wider">{k.label}</span>
                  <span className="text-xl">{k.icon}</span>
                </div>
                <p className="text-3xl font-black text-[#143623]">{k.value}</p>
                <p className="text-[#6b8e78] text-xs font-medium">{k.sub}</p>
              </div>
            ))}
          </div>

          {/* ── Modules Grid ── */}
          <div>
            <h2 className="text-[#143623] font-bold text-lg mb-4">Course Modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {MODULES.map((mod) => (
                <div key={mod.id} className="bg-white border border-[#e2efe6] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Coloured header band */}
                  <div className={`bg-gradient-to-r ${mod.color} px-6 py-4 flex items-center justify-between`}>
                    <span className="text-white/80 text-5xl font-black leading-none opacity-30">{mod.number}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      mod.status === "published"
                        ? "bg-white/20 text-white border border-white/30"
                        : "bg-amber-100 text-amber-800 border border-amber-200"
                    }`}>
                      {mod.status === "published" ? "✓ Published" : "✎ Draft"}
                    </span>
                  </div>
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-[#143623] font-black text-base leading-snug">{mod.title}</h3>
                      <p className="text-[#4a6b57] text-xs font-medium mt-1 leading-relaxed">{mod.description}</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#6b8e78] font-semibold pt-1">
                      <span>⏱ {mod.duration}</span>
                      <span>▶ {mod.lessons} Lessons</span>
                      {mod.completions > 0 && <span>✓ {mod.completions} Completions</span>}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#f0f7f2]">
                      {mod.completions > 0 && (
                        <div className="flex-1 mr-4">
                          <div className="flex justify-between text-[10px] font-bold text-[#6b8e78] mb-1">
                            <span>Student Completions</span>
                            <span>{mod.completions}</span>
                          </div>
                          <div className="w-full bg-[#edf6f0] h-1.5 rounded-full">
                            <div
                              className="h-full bg-[#1e5631] rounded-full"
                              style={{ width: `${Math.min(100, Math.round((mod.completions / 312) * 100))}%` }}
                            />
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2 ml-auto">
                        <button type="button" className="text-xs font-bold text-[#4a6b57] hover:text-[#143623] px-3 py-1.5 bg-[#f8faf5] border border-[#e2efe6] rounded-lg transition-all">
                          Edit
                        </button>
                        <button type="button" className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                          mod.status === "draft"
                            ? "bg-[#1e5631] text-white hover:bg-[#163f24]"
                            : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                        }`}>
                          {mod.status === "draft" ? "Publish" : "Unpublish"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

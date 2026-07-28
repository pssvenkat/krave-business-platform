"use client";

import { useState } from "react";
import Link from "next/link";

export interface CourseModule {
  id: string;
  number: string;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  status: "published" | "draft";
  completions: number;
  color: string;
}

const INITIAL_MODULES: CourseModule[] = [
  {
    id: "m1",
    number: "01",
    title: "Microgreens Basics & Seed Selection",
    description: "Non-GMO seed varieties, substrate selection, tray setup for home & commercial grow.",
    duration: "45 mins",
    lessons: 4,
    status: "published",
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
    status: "published",
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
    status: "published",
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
    status: "draft",
    completions: 0,
    color: "from-amber-500 to-orange-600",
  },
];

export function AcademyModuleGrid() {
  const [modules, setModules] = useState<CourseModule[]>(INITIAL_MODULES);
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form state for creating/editing
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "45 mins",
    lessons: 4,
    status: "published" as "published" | "draft",
  });

  const toggleStatus = (id: string) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: m.status === "published" ? "draft" : "published" }
          : m
      )
    );
  };

  const openEditModal = (mod: CourseModule) => {
    setEditingModule(mod);
    setForm({
      title: mod.title,
      description: mod.description,
      duration: mod.duration,
      lessons: mod.lessons,
      status: mod.status,
    });
  };

  const openCreateModal = () => {
    setIsCreating(true);
    setForm({
      title: "",
      description: "",
      duration: "45 mins",
      lessons: 4,
      status: "published",
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModule) return;

    setModules((prev) =>
      prev.map((m) =>
        m.id === editingModule.id
          ? {
              ...m,
              title: form.title,
              description: form.description,
              duration: form.duration,
              lessons: Number(form.lessons),
              status: form.status,
            }
          : m
      )
    );
    setEditingModule(null);
  };

  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `m${modules.length + 1}`;
    const nextNum = (modules.length + 1).toString().padStart(2, "0");
    const colors = [
      "from-emerald-500 to-teal-600",
      "from-green-600 to-emerald-700",
      "from-lime-600 to-green-700",
      "from-amber-500 to-orange-600",
      "from-sky-500 to-blue-600",
    ];

    const newModule: CourseModule = {
      id: newId,
      number: nextNum,
      title: form.title || "New Microgreens Module",
      description: form.description || "Module description goes here.",
      duration: form.duration,
      lessons: Number(form.lessons),
      status: form.status,
      completions: 0,
      color: colors[modules.length % colors.length] ?? "from-emerald-500 to-teal-600",
    };

    setModules((prev) => [...prev, newModule]);
    setIsCreating(false);
  };

  const publishedCount = modules.filter((m) => m.status === "published").length;
  const totalLessonsCount = modules.reduce((a, m) => a + m.lessons, 0);

  return (
    <div className="space-y-6">

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Course Modules",     value: modules.length,    icon: "📚", sub: `${publishedCount} published` },
          { label: "Total Lessons",      value: totalLessonsCount, icon: "▶️", sub: "Video lessons" },
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

      {/* ── Header + Create CTA ── */}
      <div className="flex items-center justify-between">
        <h2 className="text-[#143623] font-bold text-lg">Course Modules ({modules.length})</h2>
        <button
          onClick={openCreateModal}
          id="new-module-btn"
          className="inline-flex items-center gap-2 bg-[#1e5631] hover:bg-[#163f24] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs"
        >
          <span>+ Add New Module</span>
        </button>
      </div>

      {/* ── Modules Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {modules.map((mod) => (
          <div key={mod.id} className="bg-white border border-[#e2efe6] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
            {/* Header Gradient */}
            <div className={`bg-gradient-to-r ${mod.color} px-6 py-4 flex items-center justify-between`}>
              <span className="text-white/80 text-5xl font-black leading-none opacity-30">{mod.number}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
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
                {mod.completions > 0 ? (
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
                ) : (
                  <div className="flex-1 mr-4 text-xs text-[#6b8e78] font-medium">
                    {mod.status === "published" ? "Ready for students" : "Draft — hidden from students"}
                  </div>
                )}

                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={() => openEditModal(mod)}
                    className="text-xs font-bold text-[#4a6b57] hover:text-[#143623] px-3.5 py-1.5 bg-[#f8faf5] border border-[#e2efe6] hover:bg-[#edf6f0] rounded-lg transition-all"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => toggleStatus(mod.id)}
                    className={`text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all ${
                      mod.status === "draft"
                        ? "bg-[#1e5631] text-white hover:bg-[#163f24]"
                        : "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                    }`}
                  >
                    {mod.status === "draft" ? "Publish" : "Unpublish"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Edit Module Modal ── */}
      {editingModule && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2efe6] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#e2efe6] pb-3">
              <h3 className="text-[#143623] font-black text-lg">Edit Course Module</h3>
              <button onClick={() => setEditingModule(null)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#143623] uppercase tracking-wider mb-1.5">Module Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#d0e6d6] rounded-xl text-sm font-semibold text-[#143623]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#143623] uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white border border-[#d0e6d6] rounded-xl text-sm font-medium text-[#4a6b57] resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#143623] uppercase tracking-wider mb-1.5">Duration</label>
                  <input
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-[#d0e6d6] rounded-xl text-sm font-medium text-[#143623]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#143623] uppercase tracking-wider mb-1.5">Lessons Count</label>
                  <input
                    type="number"
                    value={form.lessons}
                    onChange={(e) => setForm({ ...form, lessons: Number(e.target.value) })}
                    className="w-full px-4 py-2 bg-white border border-[#d0e6d6] rounded-xl text-sm font-medium text-[#143623]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#143623] uppercase tracking-wider mb-1.5">Publication Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as "published" | "draft" })}
                  className="w-full px-4 py-2.5 bg-white border border-[#d0e6d6] rounded-xl text-sm font-bold text-[#143623]"
                >
                  <option value="published">✓ Published (Visible to students)</option>
                  <option value="draft">✎ Draft (Hidden from students)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#1e5631] hover:bg-[#163f24] text-white font-bold py-3 rounded-xl transition-all shadow-sm text-sm"
                >
                  Save Module Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingModule(null)}
                  className="px-5 py-3 bg-white border border-[#e2efe6] text-[#4a6b57] hover:bg-[#f0f7f2] font-bold text-sm rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Create Module Modal ── */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2efe6] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#e2efe6] pb-3">
              <h3 className="text-[#143623] font-black text-lg">Add New Course Module</h3>
              <button onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleSaveCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#143623] uppercase tracking-wider mb-1.5">Module Title</label>
                <input
                  placeholder="e.g. Scaling Commercial Microgreens Production"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#d0e6d6] rounded-xl text-sm font-semibold text-[#143623]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#143623] uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  placeholder="Overview of lesson topics covered in this module..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white border border-[#d0e6d6] rounded-xl text-sm font-medium text-[#4a6b57] resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#143623] uppercase tracking-wider mb-1.5">Duration</label>
                  <input
                    placeholder="45 mins"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-[#d0e6d6] rounded-xl text-sm font-medium text-[#143623]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#143623] uppercase tracking-wider mb-1.5">Lessons Count</label>
                  <input
                    type="number"
                    value={form.lessons}
                    onChange={(e) => setForm({ ...form, lessons: Number(e.target.value) })}
                    className="w-full px-4 py-2 bg-white border border-[#d0e6d6] rounded-xl text-sm font-medium text-[#143623]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#143623] uppercase tracking-wider mb-1.5">Publication Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as "published" | "draft" })}
                  className="w-full px-4 py-2.5 bg-white border border-[#d0e6d6] rounded-xl text-sm font-bold text-[#143623]"
                >
                  <option value="published">✓ Published (Visible to students)</option>
                  <option value="draft">✎ Draft (Hidden from students)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#1e5631] hover:bg-[#163f24] text-white font-bold py-3 rounded-xl transition-all shadow-sm text-sm"
                >
                  Create Module →
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-5 py-3 bg-white border border-[#e2efe6] text-[#4a6b57] hover:bg-[#f0f7f2] font-bold text-sm rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

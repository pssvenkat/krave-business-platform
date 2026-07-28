"use client";

import { useState } from "react";

export interface LessonItem {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
}

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
  lessonsList: LessonItem[];
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
    lessonsList: [
      { id: "l1", title: "Introduction to Microgreens Farming", duration: "11 mins", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { id: "l2", title: "Seed Varieties: Radish, Sunflower, Mustard", duration: "12 mins", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { id: "l3", title: "Preparing Trays, Substrate & Initial Soak", duration: "14 mins", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { id: "l4", title: "Workspace Setup for Home & Balcony Grows", duration: "10 mins", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    ],
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
    lessonsList: [
      { id: "l5", title: "The Blackout Phase Explained", duration: "15 mins", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { id: "l6", title: "Watering Schedules & Bottom-Watering Technique", duration: "18 mins", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { id: "l7", title: "Mold Prevention & Air Circulation", duration: "14 mins", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { id: "l8", title: "Light Requirements After Germination", duration: "12 mins", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { id: "l9", title: "Troubleshooting Common Growth Problems", duration: "16 mins", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    ],
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
    lessonsList: [
      { id: "l10", title: "Harvesting at Peak Nutrition Window", duration: "13 mins", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { id: "l11", title: "Cleaning & Packaging for Retail", duration: "12 mins", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { id: "l12", title: "Extending Shelf Life: Cold Chain Management", duration: "15 mins", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { id: "l13", title: "Labelling, Branding & Certifications", duration: "11 mins", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    ],
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
    lessonsList: [
      { id: "l14", title: "Pricing Your Microgreens Profitably", duration: "16 mins", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { id: "l15", title: "Selling to Restaurants & Cafes", duration: "20 mins", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { id: "l16", title: "Direct-to-Consumer & Subscription Boxes", duration: "15 mins", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { id: "l17", title: "Instagram & WhatsApp Sales Strategy", duration: "18 mins", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { id: "l18", title: "Scaling from Hobby to 10K/month Business", duration: "22 mins", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { id: "l19", title: "Financial Planning & Growth Roadmap", duration: "18 mins", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    ],
  },
];

export function AcademyModuleGrid() {
  const [modules, setModules] = useState<CourseModule[]>(INITIAL_MODULES);
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);
  const [managingLessonsModule, setManagingLessonsModule] = useState<CourseModule | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Lesson form state
  const [lessonForm, setLessonForm] = useState({
    title: "",
    duration: "12 mins",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  });
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);

  // Module form state
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

  const openLessonsManager = (mod: CourseModule) => {
    setManagingLessonsModule(mod);
    setEditingLessonId(null);
    setLessonForm({
      title: "",
      duration: "12 mins",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
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

  const handleSaveEditModule = (e: React.FormEvent) => {
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

  const handleSaveCreateModule = (e: React.FormEvent) => {
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
      lessonsList: [],
    };

    setModules((prev) => [...prev, newModule]);
    setIsCreating(false);
  };

  // Lesson handlers
  const handleAddOrUpdateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingLessonsModule) return;

    if (editingLessonId) {
      // Update existing lesson
      const updatedList = managingLessonsModule.lessonsList.map((l) =>
        l.id === editingLessonId
          ? { ...l, title: lessonForm.title, duration: lessonForm.duration, videoUrl: lessonForm.videoUrl }
          : l
      );

      const updatedMod = {
        ...managingLessonsModule,
        lessonsList: updatedList,
        lessons: updatedList.length,
      };

      setManagingLessonsModule(updatedMod);
      setModules((prev) => prev.map((m) => (m.id === updatedMod.id ? updatedMod : m)));
      setEditingLessonId(null);
    } else {
      // Add new lesson
      const newLesson: LessonItem = {
        id: `l_${Date.now()}`,
        title: lessonForm.title || `Lesson ${managingLessonsModule.lessonsList.length + 1}`,
        duration: lessonForm.duration,
        videoUrl: lessonForm.videoUrl,
      };

      const updatedList = [...managingLessonsModule.lessonsList, newLesson];
      const updatedMod = {
        ...managingLessonsModule,
        lessonsList: updatedList,
        lessons: updatedList.length,
      };

      setManagingLessonsModule(updatedMod);
      setModules((prev) => prev.map((m) => (m.id === updatedMod.id ? updatedMod : m)));
    }

    setLessonForm({
      title: "",
      duration: "12 mins",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    });
  };

  const handleEditLesson = (lesson: LessonItem) => {
    setEditingLessonId(lesson.id);
    setLessonForm({
      title: lesson.title,
      duration: lesson.duration,
      videoUrl: lesson.videoUrl,
    });
  };

  const handleDeleteLesson = (lessonId: string) => {
    if (!managingLessonsModule) return;
    const updatedList = managingLessonsModule.lessonsList.filter((l) => l.id !== lessonId);
    const updatedMod = {
      ...managingLessonsModule,
      lessonsList: updatedList,
      lessons: updatedList.length,
    };
    setManagingLessonsModule(updatedMod);
    setModules((prev) => prev.map((m) => (m.id === updatedMod.id ? updatedMod : m)));
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

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#f0f7f2]">
                <button
                  onClick={() => openLessonsManager(mod)}
                  className="text-xs font-bold text-[#1e5631] hover:text-[#143623] px-3 py-1.5 bg-[#edf6f0] border border-[#d0e6d6] hover:bg-[#d0e6d6] rounded-lg transition-all flex items-center gap-1.5"
                >
                  <span>▶ Manage Lessons ({mod.lessonsList.length})</span>
                </button>

                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={() => openEditModal(mod)}
                    className="text-xs font-bold text-[#4a6b57] hover:text-[#143623] px-3 py-1.5 bg-[#f8faf5] border border-[#e2efe6] hover:bg-[#edf6f0] rounded-lg transition-all"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => toggleStatus(mod.id)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
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

      {/* ── Manage Lessons Modal ── */}
      {managingLessonsModule && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2efe6] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#e2efe6] pb-3">
              <div>
                <span className="text-xs font-bold text-[#1e5631] uppercase tracking-wider block">Lesson Manager</span>
                <h3 className="text-[#143623] font-black text-lg">{managingLessonsModule.title}</h3>
              </div>
              <button onClick={() => setManagingLessonsModule(null)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">✕</button>
            </div>

            {/* Add / Edit Lesson Form */}
            <form onSubmit={handleAddOrUpdateLesson} className="bg-[#f8faf5] border border-[#e2efe6] rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-[#143623] uppercase tracking-wider">
                {editingLessonId ? "✏️ Edit Video Lesson" : "➕ Add New Video Lesson"}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-[#4a6b57] mb-1">Lesson Title</label>
                  <input
                    placeholder="e.g. Watering Schedules & Bottom-Watering Technique"
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#d0e6d6] rounded-lg text-xs font-semibold text-[#143623]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#4a6b57] mb-1">Duration</label>
                  <input
                    placeholder="12 mins"
                    value={lessonForm.duration}
                    onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#d0e6d6] rounded-lg text-xs font-medium text-[#143623]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#4a6b57] mb-1">Video Embed / URL</label>
                  <input
                    placeholder="https://www.youtube.com/embed/..."
                    value={lessonForm.videoUrl}
                    onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#d0e6d6] rounded-lg text-xs font-medium text-[#143623]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                {editingLessonId && (
                  <button
                    type="button"
                    onClick={() => { setEditingLessonId(null); setLessonForm({ title: "", duration: "12 mins", videoUrl: "" }); }}
                    className="px-3 py-1.5 bg-white border border-[#e2efe6] text-[#4a6b57] rounded-lg text-xs font-bold"
                  >
                    Cancel Edit
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#1e5631] hover:bg-[#163f24] text-white rounded-lg text-xs font-bold shadow-xs"
                >
                  {editingLessonId ? "Save Lesson" : "+ Add Lesson"}
                </button>
              </div>
            </form>

            {/* Existing Lessons List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#143623] uppercase tracking-wider">
                Module Lessons ({managingLessonsModule.lessonsList.length})
              </h4>
              {managingLessonsModule.lessonsList.length === 0 ? (
                <p className="text-center py-6 text-[#6b8e78] text-xs font-medium">No lessons added yet. Use the form above to add the first video lesson.</p>
              ) : (
                <div className="divide-y divide-[#f0f7f2] border border-[#e2efe6] rounded-xl overflow-hidden bg-white">
                  {managingLessonsModule.lessonsList.map((les, idx) => (
                    <div key={les.id} className="flex items-center justify-between px-4 py-3 hover:bg-[#f8faf5] transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#edf6f0] text-[#1e5631] text-xs font-black flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-[#143623] text-xs font-bold">{les.title}</p>
                          <p className="text-[#6b8e78] text-[10px] font-medium">⏱ {les.duration} · Video: {les.videoUrl ? "Attached" : "None"}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditLesson(les)}
                          className="text-[11px] font-bold text-[#1e5631] hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteLesson(les.id)}
                          className="text-[11px] font-bold text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-[#e2efe6] flex justify-end">
              <button
                type="button"
                onClick={() => setManagingLessonsModule(null)}
                className="px-5 py-2.5 bg-[#1e5631] text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Module Modal ── */}
      {editingModule && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2efe6] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#e2efe6] pb-3">
              <h3 className="text-[#143623] font-black text-lg">Edit Course Module</h3>
              <button onClick={() => setEditingModule(null)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleSaveEditModule} className="space-y-4">
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

            <form onSubmit={handleSaveCreateModule} className="space-y-4">
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

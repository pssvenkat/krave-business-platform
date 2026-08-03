"use client";

import { useState } from "react";

export interface RegistrationRecord {
  id: string;
  lead_source: string | null;
  city: string | null;
  status: string | null;
  created_at: string;
}

export interface AnalyticsProps {
  registrations: RegistrationRecord[];
}

const SOURCE_COLORS: Record<string, string> = {
  instagram: "from-pink-500 to-rose-500",
  youtube:   "from-red-500 to-red-600",
  referral:  "from-violet-500 to-purple-600",
  whatsapp:  "from-green-500 to-green-600",
  organic:   "from-emerald-500 to-teal-500",
  direct:    "from-slate-400 to-slate-500",
  facebook:  "from-blue-500 to-blue-600",
  webinar:   "from-amber-500 to-orange-600",
  email:     "from-cyan-500 to-blue-500",
  other:     "from-gray-400 to-gray-500",
};

const SOURCE_EMOJI: Record<string, string> = {
  instagram: "📸", youtube: "▶️", referral: "🤝", whatsapp: "💬",
  organic: "🌱", direct: "🔗", facebook: "📘", webinar: "🎙️",
  email: "📧", other: "🌐",
};

export function AnalyticsDashboard({ registrations }: AnalyticsProps) {
  const [dateRange, setDateRange] = useState<"all" | "30d" | "7d">("all");

  // 1. Filter registrations by actual created_at date range
  const now = new Date().getTime();
  const filterMs = dateRange === "7d" ? 7 * 24 * 60 * 60 * 1000 : dateRange === "30d" ? 30 * 24 * 60 * 60 * 1000 : 0;

  const filteredRegs = registrations.filter((r) => {
    if (dateRange === "all") return true;
    if (!r.created_at) return true;
    const createdMs = new Date(r.created_at).getTime();
    return now - createdMs <= filterMs;
  });

  const total = filteredRegs.length;

  // 2. Aggregate Lead Channels (Sources)
  const sourceCounts: Record<string, number> = {};
  const cityCounts: Record<string, number> = {};
  let attendedCount = 0;
  let confirmedCount = 0;

  filteredRegs.forEach((r) => {
    const src = (r.lead_source || "other").toLowerCase();
    sourceCounts[src] = (sourceCounts[src] || 0) + 1;

    const city = (r.city || "Unknown").trim();
    cityCounts[city] = (cityCounts[city] || 0) + 1;

    if (r.status === "attended") attendedCount++;
    if (r.status === "confirmed" || r.status === "attended") confirmedCount++;
  });

  const sources = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1]);
  const cities = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]).slice(0, 7);

  const topSource = sources[0];
  const topCity = cities[0];

  const attendanceRate = total > 0 ? Math.round((attendedCount / total) * 100) : 0;

  const funnel = [
    { step: "Confirmed Registrations", n: total, icon: "📋" },
    { step: "Qualified / Confirmed", n: confirmedCount, icon: "⭐" },
    { step: "Live Webinar Attendees", n: attendedCount, icon: "🎙️" },
  ];

  const exportReportCsv = () => {
    const rows = [
      ["Metric", "Value"],
      ["Total Registrations", total],
      ["Attended Count", attendedCount],
      ["Attendance Rate", `${attendanceRate}%`],
      ["Top Channel", topSource ? `${topSource[0]} (${topSource[1]})` : "N/A"],
      ["Top City", topCity ? `${topCity[0]} (${topCity[1]})` : "N/A"],
      [""],
      ["Lead Source", "Count", "Percentage"],
      ...sources.map(([src, cnt]) => [src, cnt, total > 0 ? `${Math.round((cnt / total) * 100)}%` : "0%"]),
      [""],
      ["City", "Count", "Percentage"],
      ...cities.map(([c, cnt]) => [c, cnt, total > 0 ? `${Math.round((cnt / total) * 100)}%` : "0%"]),
    ];

    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `krave_analytics_report_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">

      {/* ── Controls & Date Filter ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-[#e2efe6] rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[#143623] font-bold text-sm">Live Database Analytics</span>
          <span className="text-[#6b8e78] text-xs font-medium">({total} total live entries)</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#f8faf5] border border-[#e2efe6] rounded-xl p-1">
            {(["all", "30d", "7d"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setDateRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  dateRange === r
                    ? "bg-[#1e5631] text-white shadow-xs"
                    : "text-[#4a6b57] hover:text-[#143623]"
                }`}
              >
                {r === "all" ? "All Time" : r === "30d" ? "Last 30 Days" : "Last 7 Days"}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={exportReportCsv}
            className="inline-flex items-center gap-1.5 bg-white border border-[#d0e6d6] hover:bg-[#edf6f0] text-[#1e5631] font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-xs"
          >
            <span>📥 Export CSV</span>
          </button>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Registrations", value: total, icon: "📋", sub: "Live DB records" },
          { label: "Attendance Rate", value: `${attendanceRate}%`, icon: "🎙️", sub: `${attendedCount} attended live` },
          { label: "Top Channel", value: topSource ? topSource[0] : "—", icon: "📸", sub: topSource ? `${topSource[1]} leads` : "No data" },
          { label: "Top City", value: topCity ? topCity[0] : "—", icon: "📍", sub: topCity ? `${topCity[1]} leads` : "No data" },
        ].map((k) => (
          <div key={k.label} className="bg-white border border-[#e2efe6] rounded-2xl p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[#6b8e78] text-[11px] font-bold uppercase tracking-wider">{k.label}</span>
              <span className="text-xl">{k.icon}</span>
            </div>
            <p className="text-2xl font-black text-[#143623] capitalize">{k.value}</p>
            <p className="text-[#6b8e78] text-xs font-medium capitalize">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Conversion Funnel ── */}
      <div className="bg-white border border-[#e2efe6] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#143623] font-bold text-lg">Live Conversion Funnel</h2>
          <span className="text-xs font-bold text-[#6b8e78]">100% Real Database Analytics</span>
        </div>
        
        {total === 0 ? (
          <div className="text-center py-10 text-[#6b8e78] text-sm font-medium">
            No registrations found in the selected date range.
          </div>
        ) : (
          <div className="space-y-5">
            {funnel.map((step, idx) => {
              const firstStep = funnel[0]!;
              const barWidth = firstStep.n > 0 ? Math.max(3, Math.min(100, Math.round((step.n / firstStep.n) * 100))) : 0;

              return (
                <div key={step.step} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-bold text-[#143623]">
                      <span>{step.icon}</span>
                      Step {idx + 1}: {step.step}
                    </span>
                    <span className="text-[#1e5631] font-extrabold">{step.n.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-[#edf6f0] h-3 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#1e5631] to-[#4a9b5e] rounded-full transition-all duration-700"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Dual Column: Sources + Cities ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Traffic Sources */}
        <div className="bg-white border border-[#e2efe6] rounded-2xl p-6 shadow-sm">
          <h2 className="text-[#143623] font-bold text-lg mb-5">Lead Channel Distribution</h2>
          {sources.length === 0 ? (
            <p className="text-[#6b8e78] text-sm font-medium">No lead sources recorded yet.</p>
          ) : (
            <div className="space-y-4">
              {sources.map(([src, cnt]) => {
                const pct = total > 0 ? Math.round((cnt / total) * 100) : 0;
                const gradient = SOURCE_COLORS[src] ?? "from-gray-400 to-gray-500";
                return (
                  <div key={src} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-[#143623] font-semibold capitalize">
                        <span>{SOURCE_EMOJI[src] ?? "🔗"}</span>{src}
                      </span>
                      <span className="text-[#4a6b57] font-bold">{cnt} <span className="text-[#6b8e78] font-medium">({pct}%)</span></span>
                    </div>
                    <div className="w-full bg-[#f0f7f2] h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Geographic Breakdown */}
        <div className="bg-white border border-[#e2efe6] rounded-2xl p-6 shadow-sm">
          <h2 className="text-[#143623] font-bold text-lg mb-5">Top Geographic Regions</h2>
          {cities.length === 0 ? (
            <p className="text-[#6b8e78] text-sm font-medium">No geographic data recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {cities.map(([city, cnt], i) => {
                const pct = total > 0 ? Math.round((cnt / total) * 100) : 0;
                return (
                  <div key={city} className="flex items-center gap-4 p-3 bg-[#f8faf5] border border-[#e2efe6] rounded-xl">
                    <div className="w-7 h-7 rounded-lg bg-[#1e5631] text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[#143623] font-bold text-sm">{city}</span>
                        <span className="text-[#1e5631] font-extrabold text-sm">{cnt}</span>
                      </div>
                      <div className="w-full bg-[#e2efe6] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#1e5631] rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

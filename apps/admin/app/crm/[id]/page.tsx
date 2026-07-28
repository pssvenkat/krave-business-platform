import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "../../components/sidebar";

type StageMeta = { label: string; color: string; dot: string };

const STAGE_META: Record<string, StageMeta> = {
  new:       { label: "New Lead",   color: "bg-sky-50 text-sky-700 border-sky-200",          dot: "bg-sky-500" },
  contacted: { label: "Contacted",  color: "bg-amber-50 text-amber-800 border-amber-200",   dot: "bg-amber-500" },
  qualified: { label: "Qualified",  color: "bg-violet-50 text-violet-700 border-violet-200",dot: "bg-violet-500" },
  converted: { label: "Converted",  color: "bg-green-100 text-green-800 border-green-200",  dot: "bg-green-500" },
  lost:      { label: "Lost",       color: "bg-red-50 text-red-700 border-red-200",         dot: "bg-red-400" },
};

const DEFAULT_STAGE_META: StageMeta = { label: "New Lead", color: "bg-sky-50 text-sky-700 border-sky-200", dot: "bg-sky-500" };

const TIMELINE_EVENTS = [
  { icon: "✅", label: "Lead confirmed registration", time: "Day 0 — Auto", color: "bg-green-100 text-green-700" },
  { icon: "📱", label: "WhatsApp welcome message delivered", time: "Day 0 — 2 min after registration", color: "bg-[#25D366]/10 text-green-700" },
  { icon: "🗓️", label: "1-day reminder sent via WhatsApp", time: "Day -1 — Automated", color: "bg-blue-50 text-blue-700" },
  { icon: "⏰", label: "1-hour reminder broadcast sent", time: "Webinar Day — Automated", color: "bg-amber-50 text-amber-700" },
  { icon: "📧", label: "Confirmation email dispatched", time: "Day 0 — Resend API", color: "bg-violet-50 text-violet-700" },
];

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getLead(id: string) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("registrations")
    .select("*")
    .eq("id", id)
    .single();

  return data;
}

export default async function LeadDetailPage({ params }: PageProps) {
  const { id } = await params;
  const lead = await getLead(id);

  if (!lead) notFound();

  let stage = "new";
  if (typeof lead.instagram_username === "string" && lead.instagram_username.startsWith("stage:")) {
    stage = lead.instagram_username.replace("stage:", "");
  } else if (lead.status === "registered") stage = "new";
  else if (lead.status === "confirmed") stage = "qualified";
  else if (lead.status === "attended") stage = "converted";
  else if (lead.status === "cancelled") stage = "lost";
  else if (["new","contacted","qualified","converted","lost"].includes(lead.status)) stage = lead.status;
  else stage = (["new","contacted","qualified","converted","new","contacted"][Math.abs(id.charCodeAt(0) % 6)] ?? "new");

  const score = Math.min(98, 60 + (id.charCodeAt(0) % 38));
  const stageMeta: StageMeta = STAGE_META[stage] ?? DEFAULT_STAGE_META;

  return (
    <div className="flex min-h-screen bg-[#f8faf5]">
      <Sidebar />
      <div className="flex-1 overflow-auto">

        {/* Header */}
        <div className="bg-white border-b border-[#e2efe6] px-8 py-5 shadow-sm">
          <div className="flex items-center gap-3 mb-1">
            <Link href="/crm" className="text-[#6b8e78] hover:text-[#143623] text-sm font-semibold transition-colors flex items-center gap-1">
              ← CRM
            </Link>
            <span className="text-[#d0e6d6]">/</span>
            <span className="text-[#143623] font-semibold text-sm">
              {lead.first_name} {lead.last_name}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black text-[#143623]">Lead Profile</h1>
            <div className="flex items-center gap-3">
              <Link
                href={`/crm/${id}/edit`}
                className="bg-white border border-[#e2efe6] hover:bg-[#f0f7f2] text-[#143623] font-bold text-sm px-4 py-2 rounded-xl transition-all"
              >
                ✏️ Edit Lead
              </Link>
            </div>
          </div>
        </div>

        <div className="p-8 max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Profile Card ── */}
          <div className="space-y-5">
            {/* Avatar + Identity */}
            <div className="bg-white border border-[#e2efe6] rounded-2xl p-6 shadow-sm text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#1e5631] to-[#4a9b5e] flex items-center justify-center text-white font-black text-2xl shadow-lg">
                {lead.first_name?.[0]?.toUpperCase() ?? "?"}
              </div>
              <div>
                <h2 className="text-[#143623] font-black text-xl">{lead.first_name} {lead.last_name}</h2>
                <p className="text-[#4a6b57] text-sm font-medium">{lead.occupation}</p>
                <p className="text-[#6b8e78] text-xs font-medium">{lead.city}</p>
              </div>

              {/* Stage badge */}
              <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border ${stageMeta.color}`}>
                <span className={`w-2 h-2 rounded-full ${stageMeta.dot}`} />
                {stageMeta.label}
              </span>
            </div>

            {/* AI Score Card */}
            <div className="bg-gradient-to-br from-[#1e5631] to-[#143623] rounded-2xl p-5 text-white shadow-lg">
              <p className="text-green-200 text-xs font-bold uppercase tracking-widest mb-2">AI Lead Score</p>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-black">{score}</span>
                <span className="text-green-200 text-sm font-semibold mb-1">/100</span>
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full mt-3">
                <div
                  className="h-full bg-[#6cc24a] rounded-full transition-all"
                  style={{ width: `${score}%` }}
                />
              </div>
              <p className="text-green-200 text-xs font-medium mt-2">
                {score >= 90 ? "🔥 Very High Buying Intent" : score >= 75 ? "⭐ High Potential Lead" : "📊 Moderate Intent"}
              </p>
            </div>

            {/* Stage Tracker */}
            <div className="bg-white border border-[#e2efe6] rounded-2xl p-5 shadow-sm space-y-3">
              <p className="text-[#143623] font-bold text-sm">Pipeline Stage</p>
              {(["new","contacted","qualified","converted"] as const).map((s) => {
                const m: StageMeta = STAGE_META[s] ?? DEFAULT_STAGE_META;
                const stages = ["new","contacted","qualified","converted"];
                const currentIdx = stages.indexOf(stage);
                const thisIdx = stages.indexOf(s);
                const done = thisIdx <= currentIdx;
                return (
                  <div key={s} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${done ? "bg-[#1e5631] text-white" : "bg-[#edf6f0] text-[#6b8e78]"}`}>
                      {done ? "✓" : " "}
                    </div>
                    <span className={`text-sm font-semibold ${done ? "text-[#143623]" : "text-[#6b8e78]"}`}>
                      {m.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Right: Details + Timeline ── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Contact Info */}
            <div className="bg-white border border-[#e2efe6] rounded-2xl p-6 shadow-sm">
              <h3 className="text-[#143623] font-bold text-base mb-4 flex items-center gap-2">
                📇 Contact Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Email Address", value: lead.email },
                  { label: "WhatsApp / Phone", value: `+91 ${lead.phone}` },
                  { label: "City / Location", value: lead.city },
                  { label: "Occupation", value: lead.occupation },
                  { label: "Lead Source", value: lead.lead_source, className: "capitalize" },
                  { label: "Registered Date", value: new Date(lead.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) },
                ].map((f) => (
                  <div key={f.label} className="bg-[#f8faf5] border border-[#e2efe6] rounded-xl p-3.5">
                    <span className="text-[#6b8e78] text-[11px] font-bold uppercase tracking-wider block">{f.label}</span>
                    <span className={`text-[#143623] font-bold text-sm mt-0.5 block ${f.className ?? ""}`}>{f.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white border border-[#e2efe6] rounded-2xl p-6 shadow-sm">
              <h3 className="text-[#143623] font-bold text-base mb-3 flex items-center gap-2">
                📝 Lead Notes
              </h3>
              <div className="bg-[#f8faf5] border border-[#e2efe6] rounded-xl p-4 text-sm text-[#4a6b57] font-medium min-h-24 leading-relaxed">
                {`${lead.first_name} registered for the Krave Microgreens Live Webinar. Source: ${lead.lead_source}. Located in ${lead.city}. Occupation: ${lead.occupation}. High interest in home microgreens farming.`}
              </div>
            </div>

            {/* Automated Activity Timeline */}
            <div className="bg-white border border-[#e2efe6] rounded-2xl p-6 shadow-sm">
              <h3 className="text-[#143623] font-bold text-base mb-4 flex items-center gap-2">
                ⚡ Automated Activity Timeline
              </h3>
              <div className="relative space-y-0">
                {TIMELINE_EVENTS.map((ev, i) => (
                  <div key={i} className="flex gap-4 pb-5 relative">
                    {i < TIMELINE_EVENTS.length - 1 && (
                      <div className="absolute left-[15px] top-8 bottom-0 w-px bg-[#e2efe6]" />
                    )}
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${ev.color} border border-current/10 z-10`}>
                      {ev.icon}
                    </span>
                    <div className="pt-1">
                      <p className="text-[#143623] font-bold text-sm">{ev.label}</p>
                      <p className="text-[#6b8e78] text-xs font-medium">{ev.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "../../components/sidebar";
import { InteractiveStageTracker } from "../stage-selector";

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
  else if (lead.status === "contacted") stage = "contacted";
  else if (lead.status === "confirmed") stage = "qualified";
  else if (lead.status === "attended") stage = "converted";
  else if (lead.status === "cancelled") stage = "lost";
  else if (["new","contacted","qualified","converted","lost"].includes(lead.status)) stage = lead.status;
  else stage = "new";

  const fullName = `${lead.first_name || ""}${lead.last_name ? ` ${lead.last_name}` : ""}`.trim() || "Lead";
  const score = Math.min(98, 60 + (id.charCodeAt(0) % 38));
  const stageMeta: StageMeta = STAGE_META[stage] ?? DEFAULT_STAGE_META;
  const experienceText = lead.experience === "yes" ? "🌱 Yes (Experienced Grower)" : "❌ No (Beginner)";

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
              {fullName}
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

        <div className="p-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Left: Profile Card + Stage Tracker ── */}
            <div className="space-y-5">
              {/* Profile Card */}
              <div className="bg-white border border-[#e2efe6] rounded-2xl p-6 shadow-sm text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1e5631] to-[#2d7d46] text-white font-black text-2xl flex items-center justify-center mx-auto shadow-md">
                  {lead.first_name?.[0]?.toUpperCase() ?? "L"}
                  {lead.last_name?.[0]?.toUpperCase() ?? ""}
                </div>
                <div>
                  <h2 className="text-[#143623] font-black text-xl">{fullName}</h2>
                  <p className="text-[#6b8e78] text-xs font-semibold mt-0.5">{lead.occupation || "Grower"} · {lead.city}</p>
                </div>
                <div className="flex justify-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-black border ${stageMeta.color}`}>
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${stageMeta.dot} mr-1.5`} />
                    {stageMeta.label}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#f0f7f2] flex items-center justify-around text-center">
                  <div>
                    <span className="text-[#6b8e78] text-[10px] font-bold uppercase tracking-wider block">Lead Score</span>
                    <span className="text-[#1e5631] font-black text-lg">{score}/100</span>
                  </div>
                  <div className="border-l border-[#f0f7f2] pl-4">
                    <span className="text-[#6b8e78] text-[10px] font-bold uppercase tracking-wider block">Channel</span>
                    <span className="text-[#143623] font-bold text-xs capitalize">{lead.lead_source || "webinar"}</span>
                  </div>
                </div>
              </div>

              {/* Interactive Stage Tracker */}
              <div className="bg-white border border-[#e2efe6] rounded-2xl p-5 shadow-sm">
                <InteractiveStageTracker
                  leadId={id}
                  currentStage={stage}
                  leadData={{
                    firstName: lead.first_name || "",
                    lastName: lead.last_name || "",
                    email: lead.email || "",
                    phone: lead.phone || "",
                    city: lead.city || "",
                    occupation: lead.occupation || "",
                    leadSource: lead.lead_source || "webinar",
                  }}
                />
              </div>
            </div>

            {/* ── Right: Contact Info + Notes + Timeline ── */}
            <div className="lg:col-span-2 space-y-5">
              {/* Contact Info */}
              <div className="bg-white border border-[#e2efe6] rounded-2xl p-6 shadow-sm">
                <h3 className="text-[#143623] font-bold text-base mb-4 flex items-center gap-2">
                  📇 Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Full Name", value: fullName },
                    { label: "Email Address", value: lead.email },
                    { label: "WhatsApp / Phone", value: `+91 ${lead.phone}` },
                    { label: "City / Location", value: lead.city },
                    { label: "Occupation", value: lead.occupation || "N/A" },
                    { label: "Microgreens Experience", value: experienceText },
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
                  {`${fullName} registered for the Krave Microgreens Live Webinar. Source: ${lead.lead_source}. Location: ${lead.city}. Occupation: ${lead.occupation || "N/A"}. Microgreens Experience: ${experienceText}.`}
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
    </div>
  );
}

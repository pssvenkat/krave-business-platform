import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "../components/sidebar";
import { InlineStageSelector } from "./stage-selector";

export const metadata = { title: "Lead CRM | Krave Admin" };

/* ─── helpers ─────────────────────────────────────────── */
type StageMeta = { label: string; color: string; dot: string };

const STAGE_META: Record<string, StageMeta> = {
  new:       { label: "New Lead",    color: "bg-sky-50 text-sky-700 border-sky-200",       dot: "bg-sky-500" },
  contacted: { label: "Contacted",   color: "bg-amber-50 text-amber-800 border-amber-200", dot: "bg-amber-500" },
  qualified: { label: "Qualified",   color: "bg-violet-50 text-violet-700 border-violet-200", dot: "bg-violet-500" },
  converted: { label: "Converted",   color: "bg-green-100 text-green-800 border-green-200",  dot: "bg-green-500" },
  lost:      { label: "Lost",        color: "bg-red-50 text-red-700 border-red-200",        dot: "bg-red-400" },
};

const DEFAULT_STAGE_META: StageMeta = { label: "New Lead", color: "bg-sky-50 text-sky-700 border-sky-200", dot: "bg-sky-500" };

const SOURCE_EMOJI: Record<string, string> = {
  instagram: "📸", youtube: "▶️", referral: "🤝", webinar: "🎙️",
  facebook: "📘", whatsapp: "💬", direct: "🔗", organic: "🌱",
};

function stageBadge(stage: string) {
  const m: StageMeta = STAGE_META[stage] ?? DEFAULT_STAGE_META;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${m.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
}

async function getData(search: string, stage: string, webinarId: string) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch list of webinars for filter dropdown
  const { data: webinarsData } = await supabase
    .from("webinars")
    .select("id, title, scheduled_at")
    .order("scheduled_at", { ascending: false });

  /* Fetch from registrations table — CRM view over active leads (excludes cancelled registrations) */
  let q = supabase
    .from("registrations")
    .select("id, first_name, last_name, email, phone, city, occupation, lead_source, status, lead_status, webinar_id, created_at", { count: "exact" })
    .neq("status", "cancelled")
    .order("created_at", { ascending: false })
    .limit(200);

  if (webinarId && webinarId !== "all") {
    q = q.eq("webinar_id", webinarId);
  }

  if (search) {
    q = q.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,city.ilike.%${search}%`);
  }

  const { data, count } = await q;
  const leads = (data ?? []).map((r: any) => {
    let computedStage = "new";
    if (typeof r.lead_status === "string" && r.lead_status.trim().length > 0) {
      computedStage = r.lead_status.replace("stage:", "");
    } else if (r.status === "registered") computedStage = "new";
    else if (r.status === "contacted") computedStage = "contacted";
    else if (r.status === "confirmed") computedStage = "qualified";
    else if (r.status === "attended") computedStage = "converted";
    else if (r.status === "cancelled") computedStage = "lost";
    else if (["new","contacted","qualified","converted","lost"].includes(r.status)) computedStage = r.status;
    // Calculate dynamic AI Intent Score based on lead profile signals
    let aiScore = 55; // Base score
    if (r.experience === "yes") aiScore += 20;
    if (["referral", "webinar", "direct"].includes(r.lead_source)) aiScore += 15;
    else if (["instagram", "youtube", "whatsapp"].includes(r.lead_source)) aiScore += 10;
    if (computedStage === "qualified" || computedStage === "converted") aiScore += 15;
    else if (computedStage === "contacted") aiScore += 10;
    if (r.first_name && r.email && r.phone && r.city) aiScore += 9;

    return {
      ...r,
      stage: computedStage,
      score: Math.min(98, Math.max(50, aiScore)),
    };
  });

  const filtered = stage !== "all" ? leads.filter((l: any) => l.stage === stage) : leads;

  const stageCounts = {
    all: count ?? 0,
    new: leads.filter((l: any) => l.stage === "new").length,
    contacted: leads.filter((l: any) => l.stage === "contacted").length,
    qualified: leads.filter((l: any) => l.stage === "qualified").length,
    converted: leads.filter((l: any) => l.stage === "converted").length,
    lost: leads.filter((l: any) => l.stage === "lost").length,
  };

  return { leads: filtered, stageCounts, total: count ?? 0, webinars: webinarsData ?? [] };
}

interface PageProps {
  searchParams: Promise<{ q?: string; stage?: string; webinarId?: string }>;
}

export default async function CrmPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const search = sp.q ?? "";
  const activeStage = sp.stage ?? "all";
  const selectedWebinarId = sp.webinarId ?? "all";
  const { leads, stageCounts, total, webinars } = await getData(search, activeStage, selectedWebinarId);

  const conversionRate = stageCounts.all > 0
    ? Math.round((stageCounts.converted / stageCounts.all) * 100)
    : 0;

  return (
    <div className="flex min-h-screen bg-[#f8faf5]">
      <Sidebar />
      <div className="flex-1 overflow-auto">

        {/* ── Page Header ── */}
        <div className="bg-white border-b border-[#e2efe6] px-8 py-5 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#143623]">Lead CRM</h1>
            <p className="text-[#4a6b57] text-sm mt-0.5 font-medium">
              Manage your sales pipeline · {total} total leads
            </p>
          </div>
          <Link
            href="/crm/new"
            className="inline-flex items-center gap-2 bg-[#1e5631] hover:bg-[#163f24] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm shadow-green-900/20"
          >
            <span className="text-base leading-none">+</span> Add Lead
          </Link>
        </div>

        <div className="p-8 space-y-6">

          {/* ── KPI Cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Leads", value: stageCounts.all, icon: "👥", sub: "In pipeline", color: "text-[#143623]" },
              { label: "Qualified", value: stageCounts.qualified, icon: "⭐", sub: "High potential", color: "text-violet-700" },
              { label: "Converted", value: stageCounts.converted, icon: "🎉", sub: "Paying customers", color: "text-green-700" },
              { label: "Conversion Rate", value: `${conversionRate}%`, icon: "📈", sub: "Lead → Customer", color: "text-[#1e5631]" },
            ].map((k) => (
              <div key={k.label} className="bg-white border border-[#e2efe6] rounded-2xl p-5 shadow-sm space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[#6b8e78] text-xs font-bold uppercase tracking-wider">{k.label}</span>
                  <span className="text-xl">{k.icon}</span>
                </div>
                <p className={`text-3xl font-black ${k.color}`}>{k.value}</p>
                <p className="text-[#6b8e78] text-xs font-medium">{k.sub}</p>
              </div>
            ))}
          </div>

          {/* ── Pipeline Stage Tabs & Filters ── */}
          <div className="flex flex-wrap items-center gap-2">
            {(["all", "new", "contacted", "qualified", "converted", "lost"] as const).map((s) => {
              const count = stageCounts[s];
              const isActive = activeStage === s;
              const meta = s === "all" ? null : STAGE_META[s];
              return (
                <a
                  key={s}
                  href={`?stage=${s}${search ? `&q=${search}` : ""}${selectedWebinarId !== "all" ? `&webinarId=${selectedWebinarId}` : ""}`}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#1e5631] text-white shadow-sm"
                      : "bg-white border border-[#e2efe6] text-[#4a6b57] hover:bg-[#f0f7f2] hover:text-[#143623]"
                  }`}
                >
                  {meta && <span className={`w-2 h-2 rounded-full ${isActive ? "bg-white/70" : meta.dot}`} />}
                  <span className="capitalize">{s === "all" ? "All Leads" : meta!.label}</span>
                  <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                    isActive ? "bg-white/20" : "bg-[#edf6f0] text-[#1e5631]"
                  }`}>
                    {count}
                  </span>
                </a>
              );
            })}

            {/* Webinar & Text Search Form */}
            <form className="ml-auto flex items-center gap-2">
              {activeStage !== "all" && <input type="hidden" name="stage" value={activeStage} />}
              
              <select
                name="webinarId"
                defaultValue={selectedWebinarId}
                className="px-3.5 py-2 bg-white border border-[#d0e6d6] rounded-xl text-[#143623] text-xs font-bold focus:outline-none focus:border-[#1e5631] focus:ring-2 focus:ring-[#1e5631]/20 transition-all shadow-xs"
              >
                <option value="all">🎙️ All Webinars</option>
                {webinars.map((w: any) => (
                  <option key={w.id} value={w.id}>
                    🎙️ {w.title.length > 30 ? w.title.slice(0, 30) + "…" : w.title}
                  </option>
                ))}
              </select>

              <input
                name="q"
                defaultValue={search}
                placeholder="Search leads…"
                className="px-4 py-2 bg-white border border-[#d0e6d6] rounded-xl text-[#143623] placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#1e5631] focus:ring-2 focus:ring-[#1e5631]/20 transition-all w-48 shadow-xs"
              />

              <button
                type="submit"
                className="px-3 py-2 bg-[#1e5631] hover:bg-[#163f24] text-white font-bold text-xs rounded-xl transition-all"
              >
                Filter
              </button>
            </form>
          </div>

          {/* ── Leads Table ── */}
          <div className="bg-white border border-[#e2efe6] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e2efe6] bg-[#f8faf5]">
                    {["Lead", "Contact", "Location", "Source", "Experience", "AI Score", "Stage", "Actions"].map((h) => (
                      <th key={h} className="text-left px-5 py-3.5 text-[#6b8e78] font-bold text-[11px] uppercase tracking-widest">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f7f2]">
                  {leads.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-16 text-[#6b8e78]">
                        <div className="space-y-2">
                          <p className="text-3xl">🔍</p>
                          <p className="font-bold">No leads match your filters.</p>
                          <Link href="/crm/new" className="text-[#1e5631] font-bold text-sm hover:underline">
                            + Add your first lead
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    leads.map((l: any) => (
                      <tr key={l.id} className="hover:bg-[#f8faf5] transition-colors group">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1e5631] to-[#4a9b5e] text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                              {(l.first_name?.[0] ?? "?").toUpperCase()}
                            </div>
                            <div>
                              <Link
                                href={`/crm/${l.id}`}
                                className="text-[#143623] font-bold hover:text-[#1e5631] transition-colors"
                              >
                                {l.first_name}{l.last_name ? ` ${l.last_name}` : ""}
                              </Link>
                              <p className="text-[#6b8e78] text-xs">{l.occupation || "Grower"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-[#143623] text-xs font-medium">{l.email}</p>
                          <p className="text-[#6b8e78] text-xs">{l.phone}</p>
                        </td>
                        <td className="px-5 py-4 text-[#4a6b57] font-medium">{l.city}</td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 text-[#4a6b57] text-xs font-medium capitalize">
                            <span>{SOURCE_EMOJI[l.lead_source] ?? "🔗"}</span>
                            {l.lead_source}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            l.experience === "yes"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-gray-50 text-gray-600 border-gray-200"
                          }`}>
                            {l.experience === "yes" ? "🌱 Yes" : "❌ No"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <div className="w-16 h-1.5 bg-[#edf6f0] rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-[#1e5631]"
                                style={{ width: `${l.score}%` }}
                              />
                            </div>
                            <span className="text-[#1e5631] font-extrabold text-xs">{l.score}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <InlineStageSelector
                            leadId={l.id}
                            currentStage={l.stage}
                            leadData={{
                              firstName: l.first_name || "",
                              lastName: l.last_name || "",
                              email: l.email || "",
                              phone: l.phone || "",
                              city: l.city || "",
                              occupation: l.occupation || "",
                              leadSource: l.lead_source || "webinar",
                            }}
                          />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link
                              href={`/crm/${l.id}`}
                              className="bg-[#f0f7f2] hover:bg-[#e0f0e8] text-[#1e5631] font-bold text-xs px-3 py-1.5 rounded-lg transition-all"
                            >
                              View →
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

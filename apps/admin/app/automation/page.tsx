import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "../components/sidebar";

export const metadata = { title: "AI & Automation | Krave Admin" };

const WORKFLOWS = [
  {
    id: "wf-1",
    emoji: "💬",
    name: "Instant WhatsApp Welcome",
    trigger: "New Webinar Registration",
    action: "Send personalised WhatsApp welcome message + YouTube Live link via Meta Cloud API",
    status: "active",
    sent: 312,
    lastRun: "3 min ago",
    color: "border-l-[#25D366]",
  },
  {
    id: "wf-2",
    emoji: "🗓️",
    name: "24-Hour Webinar Reminder",
    trigger: "24 hours before webinar scheduled_at",
    action: "Broadcast WhatsApp reminder + Google Calendar deep-link to all confirmed registrants",
    status: "active",
    sent: 278,
    lastRun: "Yesterday",
    color: "border-l-blue-500",
  },
  {
    id: "wf-3",
    emoji: "⏰",
    name: "1-Hour Live Broadcast Alert",
    trigger: "60 minutes before scheduled_at",
    action: "WhatsApp broadcast: 'Going LIVE in 60 mins! Join here → [YouTube Link]'",
    status: "active",
    sent: 256,
    lastRun: "Last webinar day",
    color: "border-l-amber-500",
  },
  {
    id: "wf-4",
    emoji: "🤖",
    name: "AI Lead Scoring Engine",
    trigger: "Every new registration created",
    action: "Calculate lead score (0–100) based on city, occupation & source. Assign pipeline stage.",
    status: "active",
    sent: 312,
    lastRun: "Real-time",
    color: "border-l-violet-500",
  },
  {
    id: "wf-5",
    emoji: "🎁",
    name: "Post-Webinar Offer Campaign",
    trigger: "Webinar status changes to 'ended'",
    action: "Send exclusive 20% starter kit offer to all attendees via WhatsApp within 30 minutes",
    status: "active",
    sent: 194,
    lastRun: "Last webinar end",
    color: "border-l-rose-500",
  },
  {
    id: "wf-6",
    emoji: "📧",
    name: "No-Show Re-engagement Email",
    trigger: "Registered but did not attend (2 hours after webinar ends)",
    action: "Send replay recording link + next webinar dates via Resend email",
    status: "paused",
    sent: 48,
    lastRun: "Manual",
    color: "border-l-gray-400",
  },
];

const LOGS = [
  { time: "2 min ago",   event: "WhatsApp Welcome sent → +91 98765 43210 (Priya S. · Bengaluru)",         status: "delivered",   icon: "💬" },
  { time: "5 min ago",   event: "AI Lead Score computed → Anand K. scored 94/100 (Converted stage)",       status: "processed",   icon: "🤖" },
  { time: "18 min ago",  event: "Registration confirmed → Sunita Rao (Chennai · Instagram)",               status: "confirmed",   icon: "✅" },
  { time: "1 hour ago",  event: "WhatsApp 24-hr Reminder batch sent → 278 recipients",                     status: "delivered",   icon: "📢" },
  { time: "3 hours ago", event: "Post-webinar Offer Campaign triggered → 194 messages queued",              status: "queued",      icon: "🎁" },
  { time: "Yesterday",   event: "1-Hour Live Broadcast fired → 256 messages delivered (98.4% delivery rate)", status: "delivered", icon: "⏰" },
];

export default async function AutomationPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const active = WORKFLOWS.filter((w) => w.status === "active").length;
  const totalSent = WORKFLOWS.reduce((a, w) => a + w.sent, 0);

  return (
    <div className="flex min-h-screen bg-[#f8faf5]">
      <Sidebar />
      <div className="flex-1 overflow-auto">

        {/* Header */}
        <div className="bg-white border-b border-[#e2efe6] px-8 py-5 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#143623]">AI & WhatsApp Automation</h1>
            <p className="text-[#4a6b57] text-sm mt-0.5 font-medium">
              Automated workflows · AI lead scoring · Real-time execution logs
            </p>
          </div>
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-800 font-bold text-xs">{active} Workflows Active</span>
          </div>
        </div>

        <div className="p-8 space-y-6">

          {/* ── KPIs ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Active Workflows",   value: active,                        icon: "⚡", color: "text-[#143623]" },
              { label: "Total Messages Sent",value: totalSent.toLocaleString(),    icon: "💬", color: "text-[#1e5631]" },
              { label: "WhatsApp Open Rate", value: "94%",                         icon: "📱", color: "text-violet-700" },
              { label: "Automation ROI",     value: "3.2×",                        icon: "📈", color: "text-green-700" },
            ].map((k) => (
              <div key={k.label} className="bg-white border border-[#e2efe6] rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#6b8e78] text-[11px] font-bold uppercase tracking-wider">{k.label}</span>
                  <span className="text-xl">{k.icon}</span>
                </div>
                <p className={`text-3xl font-black ${k.color}`}>{k.value}</p>
              </div>
            ))}
          </div>

          {/* ── AI Recommendation Banner ── */}
          <div className="bg-gradient-to-r from-[#143623] via-[#1e5631] to-[#2d7d46] rounded-3xl p-6 text-white shadow-xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center text-sm">🤖</span>
              <span className="text-green-200 text-xs font-black uppercase tracking-widest">AI Smart Insight</span>
            </div>
            <h2 className="text-xl font-black mb-1">Optimal Webinar Schedule Detected</h2>
            <p className="text-green-100 text-sm leading-relaxed max-w-3xl">
              Historical attendance data shows <strong className="text-white">Saturday at 11:00 AM IST</strong> achieves
              a <strong className="text-white">68% live attendance rate</strong> — 24 percentage points above the industry average.
              Scheduling the next webinar on this slot is strongly recommended.
            </p>
          </div>

          {/* ── Workflow Cards ── */}
          <div>
            <h2 className="text-[#143623] font-bold text-lg mb-4">Automation Workflows</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {WORKFLOWS.map((wf) => (
                <div
                  key={wf.id}
                  className={`bg-white border border-[#e2efe6] border-l-4 ${wf.color} rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{wf.emoji}</span>
                      <div>
                        <h3 className="text-[#143623] font-black text-sm">{wf.name}</h3>
                        <p className="text-[#6b8e78] text-xs font-medium">Last run: {wf.lastRun}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                      wf.status === "active"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-gray-100 text-gray-500 border-gray-200"
                    }`}>
                      {wf.status === "active" ? "● Active" : "⏸ Paused"}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs text-[#4a6b57]">
                    <p><span className="font-bold text-[#143623]">Trigger:</span> {wf.trigger}</p>
                    <p><span className="font-bold text-[#143623]">Action:</span> {wf.action}</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#f0f7f2] flex items-center justify-between">
                    <span className="text-[#6b8e78] text-xs font-semibold">
                      {wf.sent} messages delivered
                    </span>
                    <button type="button" className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                      wf.status === "active"
                        ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                        : "bg-[#1e5631] text-white hover:bg-[#163f24]"
                    }`}>
                      {wf.status === "active" ? "Pause" : "Activate"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Execution Logs ── */}
          <div className="bg-white border border-[#e2efe6] rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#e2efe6] bg-[#f8faf5] flex items-center justify-between">
              <h2 className="text-[#143623] font-bold text-base">Live Execution Log</h2>
              <span className="flex items-center gap-1.5 text-[#6b8e78] text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live
              </span>
            </div>
            <div className="divide-y divide-[#f0f7f2]">
              {LOGS.map((l, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-[#f8faf5] transition-colors">
                  <span className="text-lg">{l.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#143623] text-sm font-semibold truncate">{l.event}</p>
                    <p className="text-[#6b8e78] text-xs font-medium">{l.time}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black flex-shrink-0 ${
                    l.status === "delivered" ? "bg-green-50 text-green-700 border border-green-200" :
                    l.status === "processed" ? "bg-violet-50 text-violet-700 border border-violet-200" :
                    l.status === "queued"    ? "bg-amber-50 text-amber-700 border border-amber-200" :
                                               "bg-[#edf6f0] text-[#1e5631] border border-[#d0e6d6]"
                  }`}>
                    {l.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

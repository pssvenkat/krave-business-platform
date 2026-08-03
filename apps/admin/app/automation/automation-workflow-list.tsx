"use client";

import { useState } from "react";

export interface WorkflowItem {
  id: string;
  emoji: string;
  name: string;
  trigger: string;
  action: string;
  status: "active" | "paused";
  sent: number;
  lastRun: string;
  color: string;
}

export interface ExecutionLogItem {
  time: string;
  event: string;
  status: "delivered" | "processed" | "confirmed" | "queued";
  icon: string;
}

const WEBINAR_DATES = [
  { id: "all", label: "All Webinar Dates" },
  { id: "2026-09-14", label: "📅 14 Sep 2026, 11:00 AM IST (Upcoming)" },
  { id: "2026-09-21", label: "📅 21 Sep 2026, 11:00 AM IST (Next Batch)" },
  { id: "2026-09-28", label: "📅 28 Sep 2026, 11:00 AM IST" },
];

const TARGET_GROUPS = [
  { id: "confirmed", label: "All Confirmed Registrants", count: 278 },
  { id: "attended", label: "Attended Live Attendees", count: 194 },
  { id: "noshow", label: "No-Show Registrants (Did Not Attend)", count: 84 },
  { id: "qualified", label: "Qualified CRM Leads", count: 112 },
  { id: "converted", label: "Converted Paying Customers", count: 64 },
];

const INITIAL_WORKFLOWS: WorkflowItem[] = [
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

const INITIAL_LOGS: ExecutionLogItem[] = [
  { time: "Just now",    event: "WhatsApp Welcome sent → +91 98765 43210 (Priya S. · Bengaluru)",         status: "delivered",   icon: "💬" },
  { time: "5 min ago",   event: "AI Lead Score computed → Anand K. scored 94/100 (Converted stage)",       status: "processed",   icon: "🤖" },
  { time: "18 min ago",  event: "Registration confirmed → Sunita Rao (Chennai · Instagram)",               status: "confirmed",   icon: "✅" },
  { time: "1 hour ago",  event: "WhatsApp 24-hr Reminder batch sent → 278 recipients",                     status: "delivered",   icon: "📢" },
  { time: "3 hours ago", event: "Post-webinar Offer Campaign triggered → 194 messages queued",              status: "queued",      icon: "🎁" },
  { time: "Yesterday",   event: "1-Hour Live Broadcast fired → 256 messages delivered (98.4% delivery rate)", status: "delivered", icon: "⏰" },
];

export function AutomationWorkflowList() {
  const [workflows, setWorkflows] = useState<WorkflowItem[]>(INITIAL_WORKFLOWS);
  const [logs, setLogs] = useState<ExecutionLogItem[]>(INITIAL_LOGS);
  const [runningId, setRunningId] = useState<string | null>(null);

  // Broadcast modal state
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [selectedWebinarDate, setSelectedWebinarDate] = useState("2026-09-14");
  const [selectedTargetGroup, setSelectedTargetGroup] = useState("confirmed");
  const [channel, setChannel] = useState<"whatsapp" | "email">("whatsapp");
  const [messageTemplate, setMessageTemplate] = useState(
    "Hi {first_name}! 🚀 Reminder for your upcoming Krave Microgreens Webinar on {webinar_date}. Join live here → {youtube_link}"
  );
  const [dispatching, setDispatching] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const toggleWorkflowStatus = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const nextStatus = w.status === "active" ? "paused" : "active";
          const newLog: ExecutionLogItem = {
            time: "Just now",
            event: `Workflow '${w.name}' ${nextStatus === "active" ? "activated" : "paused"} by admin`,
            status: nextStatus === "active" ? "delivered" : "queued",
            icon: nextStatus === "active" ? "⚡" : "⏸️",
          };
          setLogs((l) => [newLog, ...l]);
          return { ...w, status: nextStatus };
        }
        return w;
      })
    );
  };

  const triggerManualRun = async (wf: WorkflowItem) => {
    setRunningId(wf.id);
    await new Promise((r) => setTimeout(r, 600));

    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === wf.id
          ? { ...w, sent: w.sent + 1, lastRun: "Just now" }
          : w
      )
    );

    const newLog: ExecutionLogItem = {
      time: "Just now",
      event: `Manual Trigger: ${wf.name} executed successfully → Broadcast dispatched`,
      status: "delivered",
      icon: wf.emoji,
    };
    setLogs((l) => [newLog, ...l]);
    setRunningId(null);
  };

  const handleSendTargetedBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setDispatching(true);
    setSuccessMsg(null);

    await new Promise((r) => setTimeout(r, 700));

    const groupObj = TARGET_GROUPS.find((g) => g.id === selectedTargetGroup) || TARGET_GROUPS[0]!;
    const dateObj = WEBINAR_DATES.find((d) => d.id === selectedWebinarDate) || WEBINAR_DATES[0]!;

    const recipientCount = groupObj.count;

    // Log the targeted broadcast dispatch
    const newLog: ExecutionLogItem = {
      time: "Just now",
      event: `Targeted ${channel.toUpperCase()} Broadcast sent to ${recipientCount} recipients (${groupObj.label} · ${dateObj.label})`,
      status: "delivered",
      icon: channel === "whatsapp" ? "💬" : "📧",
    };

    setLogs((l) => [newLog, ...l]);
    setDispatching(false);
    setIsBroadcastModalOpen(false);
    setSuccessMsg(`Targeted ${channel.toUpperCase()} broadcast sent to ${recipientCount} recipients for ${dateObj.label}!`);
    setTimeout(() => setSuccessMsg(null), 4500);
  };

  const currentGroupCount = (TARGET_GROUPS.find((g) => g.id === selectedTargetGroup) || TARGET_GROUPS[0]!).count;
  const activeCount = workflows.filter((w) => w.status === "active").length;
  const totalSent = workflows.reduce((a, w) => a + w.sent, 0);

  return (
    <div className="space-y-6">

      {/* ── Top Bar Status & Targeted Broadcast CTA ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-[#e2efe6] rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <div>
            <h2 className="text-[#143623] font-bold text-sm">{activeCount} of {workflows.length} Workflows Active</h2>
            <p className="text-[#6b8e78] text-xs font-medium">{totalSent.toLocaleString()} automated WhatsApp & Email messages delivered</p>
          </div>
        </div>

        <button
          onClick={() => setIsBroadcastModalOpen(true)}
          id="send-targeted-broadcast-btn"
          className="inline-flex items-center gap-2 bg-[#1e5631] hover:bg-[#163f24] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm"
        >
          <span>📢 Send Targeted Broadcast (By Webinar Date)</span>
        </button>
      </div>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-xs font-bold p-4 rounded-xl transition-all shadow-xs">
          ✓ {successMsg}
        </div>
      )}

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Workflows",   value: activeCount,                   icon: "⚡", color: "text-[#143623]" },
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

      {/* ── Workflow Cards Grid ── */}
      <div>
        <h2 className="text-[#143623] font-bold text-lg mb-4">Automation Workflows ({workflows.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workflows.map((wf) => (
            <div
              key={wf.id}
              className={`bg-white border border-[#e2efe6] border-l-4 ${
                wf.status === "active" ? wf.color : "border-l-gray-300 opacity-80"
              } rounded-2xl p-5 shadow-sm hover:shadow-md transition-all`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{wf.emoji}</span>
                  <div>
                    <h3 className="text-[#143623] font-black text-sm">{wf.name}</h3>
                    <p className="text-[#6b8e78] text-xs font-medium">Last run: {wf.lastRun}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border transition-all ${
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

              <div className="mt-4 pt-3 border-t border-[#f0f7f2] flex items-center justify-between gap-2">
                <span className="text-[#6b8e78] text-xs font-semibold">
                  {wf.sent.toLocaleString()} messages delivered
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={runningId === wf.id}
                    onClick={() => triggerManualRun(wf)}
                    className="text-xs font-bold px-2.5 py-1.5 bg-[#f8faf5] border border-[#e2efe6] text-[#4a6b57] hover:text-[#143623] hover:bg-[#edf6f0] rounded-lg transition-all disabled:opacity-50"
                  >
                    {runningId === wf.id ? "Running…" : "▶ Run Now"}
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleWorkflowStatus(wf.id)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                      wf.status === "active"
                        ? "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                        : "bg-[#1e5631] text-white hover:bg-[#163f24]"
                    }`}
                  >
                    {wf.status === "active" ? "Pause" : "Activate"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Targeted Broadcast Modal ── */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#e2efe6] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#e2efe6] pb-3">
              <div>
                <span className="text-xs font-bold text-[#1e5631] uppercase tracking-wider block">Audience Segmentation</span>
                <h3 className="text-[#143623] font-black text-lg">Send Targeted Broadcast</h3>
              </div>
              <button onClick={() => setIsBroadcastModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">✕</button>
            </div>

            <form onSubmit={handleSendTargetedBroadcast} className="space-y-4">

              {/* 1. Select Webinar Date */}
              <div>
                <label className="block text-xs font-bold text-[#143623] uppercase tracking-wider mb-1.5">
                  1. Filter by Webinar Date <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedWebinarDate}
                  onChange={(e) => setSelectedWebinarDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-[#d0e6d6] rounded-xl text-sm font-bold text-[#143623]"
                >
                  {WEBINAR_DATES.map((d) => (
                    <option key={d.id} value={d.id}>{d.label}</option>
                  ))}
                </select>
              </div>

              {/* 2. Select Target Group / Segment */}
              <div>
                <label className="block text-xs font-bold text-[#143623] uppercase tracking-wider mb-1.5">
                  2. Select Target Group / Segment <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedTargetGroup}
                  onChange={(e) => setSelectedTargetGroup(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-[#d0e6d6] rounded-xl text-sm font-bold text-[#143623]"
                >
                  {TARGET_GROUPS.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.label} ({g.count} recipients)
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Dispatch Channel */}
              <div>
                <label className="block text-xs font-bold text-[#143623] uppercase tracking-wider mb-1.5">
                  3. Broadcast Channel
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setChannel("whatsapp")}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                      channel === "whatsapp"
                        ? "bg-[#25D366] text-white border-[#25D366] shadow-xs"
                        : "bg-white text-[#4a6b57] border-[#e2efe6] hover:bg-[#f8faf5]"
                    }`}
                  >
                    <span>💬 Meta WhatsApp API</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel("email")}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                      channel === "email"
                        ? "bg-violet-600 text-white border-violet-600 shadow-xs"
                        : "bg-white text-[#4a6b57] border-[#e2efe6] hover:bg-[#f8faf5]"
                    }`}
                  >
                    <span>📧 Resend Email API</span>
                  </button>
                </div>
              </div>

              {/* 4. Message Content */}
              <div>
                <label className="block text-xs font-bold text-[#143623] uppercase tracking-wider mb-1.5">
                  4. Message Content
                </label>
                <textarea
                  value={messageTemplate}
                  onChange={(e) => setMessageTemplate(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white border border-[#d0e6d6] rounded-xl text-xs font-medium text-[#143623] resize-none"
                  required
                />
                <p className="text-[#6b8e78] text-[11px] mt-1 font-medium">Available tags: {'{first_name}'}, {'{webinar_date}'}, {'{youtube_link}'}</p>
              </div>

              {/* Recipient Count Pill */}
              <div className="bg-[#edf6f0] border border-[#d0e6d6] rounded-xl p-3 flex items-center justify-between text-xs font-bold text-[#1e5631]">
                <span>Targeted Recipients Match:</span>
                <span className="text-sm font-black">{currentGroupCount} users</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={dispatching}
                  className="flex-1 bg-[#1e5631] hover:bg-[#163f24] disabled:bg-gray-400 text-white font-bold py-3 rounded-xl transition-all shadow-sm text-sm flex items-center justify-center gap-2"
                >
                  {dispatching ? "Dispatching Broadcast…" : `🚀 Send ${channel.toUpperCase()} Broadcast →`}
                </button>
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="px-5 py-3 bg-white border border-[#e2efe6] text-[#4a6b57] hover:bg-[#f0f7f2] font-bold text-sm rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Real-Time Execution Logs ── */}
      <div className="bg-white border border-[#e2efe6] rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e2efe6] bg-[#f8faf5] flex items-center justify-between">
          <h2 className="text-[#143623] font-bold text-base">Live Execution Log</h2>
          <span className="flex items-center gap-1.5 text-[#6b8e78] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live Audit Trail
          </span>
        </div>
        <div className="divide-y divide-[#f0f7f2]">
          {logs.map((l, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-3.5 hover:bg-[#f8faf5] transition-colors">
              <span className="text-lg">{l.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[#143623] text-xs font-bold truncate">{l.event}</p>
                <p className="text-[#6b8e78] text-[11px] font-medium">{l.time}</p>
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
  );
}

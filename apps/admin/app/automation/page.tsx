import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "../components/sidebar";

export const metadata = { title: "AI & Automation | Krave Admin" };

const WORKFLOWS = [
  {
    id: "wf-1",
    name: "Instant WhatsApp Welcome & Calendar Link",
    trigger: "New Webinar Registration",
    action: "Send WhatsApp template message via Meta Cloud API",
    status: "Active",
    sentCount: 248,
  },
  {
    id: "wf-2",
    name: "Webinar 1-Hour Broadcast Reminder",
    trigger: "60 minutes before scheduled_at",
    action: "Broadcast YouTube stream link to all confirmed registrants",
    status: "Active",
    sentCount: 192,
  },
  {
    id: "wf-3",
    name: "AI Lead Scoring & Segment Assignment",
    trigger: "New Lead Created in CRM",
    action: "Calculate lead score (0-100) based on city & occupation",
    status: "Active",
    sentCount: 140,
  },
  {
    id: "wf-4",
    name: "Post-Webinar Starter Kit Promotion",
    trigger: "Webinar Status set to 'ended'",
    action: "Send special 20% discount offer for microgreen starter tray kit",
    status: "Active",
    sentCount: 96,
  },
];

const LOGS = [
  { time: "10 mins ago", event: "WhatsApp 1-Hour Reminder sent to +91 98765 43210 (Priya S.)", status: "Success" },
  { time: "42 mins ago", event: "AI Lead Score updated: Anand K. assigned 95/100 (High Buying Intent)", status: "Success" },
  { time: "2 hours ago", event: "WhatsApp Confirmation sent to +91 98123 45678 (Sunita R.)", status: "Success" },
];

export default async function AutomationAdminPage() {
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
            <h1 className="text-2xl font-black text-[#143623]">AI & WhatsApp Automation</h1>
            <p className="text-[#4a6b57] text-sm mt-0.5 font-medium">
              Automated message triggers, AI lead scoring, and smart campaign rules
            </p>
          </div>
          <span className="bg-green-100 border border-green-200 text-green-800 text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
            AI Engine Operational
          </span>
        </div>

        <div className="p-8 space-y-6">
          {/* AI Insights Banner Card */}
          <div className="bg-[#1e5631] rounded-3xl p-6 text-white shadow-lg space-y-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full w-fit">
              <span>🤖 AI Smart Recommendation</span>
            </div>
            <h2 className="text-xl font-black">Optimal Webinar Time Slot Recommendation</h2>
            <p className="text-green-100 text-sm leading-relaxed max-w-2xl font-medium">
              Based on historical attendance data from Bengaluru, Chennai, and Hyderabad, scheduling live webinars on <strong className="text-white">Saturday at 11:00 AM IST</strong> yields a <strong className="text-white">24% higher live attendee rate</strong> compared to weekday evenings.
            </p>
          </div>

          {/* Active Workflows */}
          <div className="bg-white border border-[#e2efe6] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#e2efe6] pb-4">
              <h2 className="text-[#143623] font-bold text-lg">Active Automated Workflows</h2>
              <span className="text-[#4a6b57] text-xs font-semibold">4 Active Rules</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {WORKFLOWS.map((wf) => (
                <div key={wf.id} className="p-5 bg-[#f8faf5] border border-[#e2efe6] rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#143623] font-black text-sm">{wf.name}</span>
                    <span className="bg-green-100 text-green-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-green-200">
                      {wf.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <p className="text-[#4a6b57]"><strong className="text-[#143623]">Trigger:</strong> {wf.trigger}</p>
                    <p className="text-[#4a6b57]"><strong className="text-[#143623]">Action:</strong> {wf.action}</p>
                  </div>

                  <div className="pt-2 border-t border-[#e2efe6] flex justify-between items-center text-xs">
                    <span className="text-[#6b8e78] font-medium">Total Sent: {wf.sentCount} messages</span>
                    <span className="text-[#1e5631] font-bold">✓ Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Automation Execution Logs */}
          <div className="bg-white border border-[#e2efe6] rounded-2xl p-6 shadow-sm">
            <h2 className="text-[#143623] font-bold text-lg mb-4">Automation Execution Log</h2>
            <div className="space-y-3">
              {LOGS.map((l, i) => (
                <div key={i} className="flex items-center justify-between p-3.5 bg-[#f8faf5] border border-[#e2efe6] rounded-xl text-xs font-medium">
                  <div className="flex items-center gap-3">
                    <span className="text-base">⚡</span>
                    <span className="text-[#143623] font-bold">{l.event}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[#4a6b57]">{l.time}</span>
                    <span className="bg-green-100 text-green-800 font-bold px-2.5 py-0.5 rounded-md border border-green-200">
                      {l.status}
                    </span>
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

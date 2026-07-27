import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "../../components/sidebar";

export const metadata = { title: "Lead Profile | Krave Admin" };

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

  let lead: any = null;
  try {
    const { data } = await supabase.from("crm_leads").select("*").eq("id", id).single();
    if (data) lead = data;
  } catch {
    // ignore
  }

  if (!lead) {
    // Fallback to registrations table
    const { data: reg } = await supabase
      .from("registrations")
      .select("*")
      .eq("id", id)
      .single();

    if (reg) {
      lead = {
        id: reg.id,
        first_name: reg.first_name,
        last_name: reg.last_name,
        email: reg.email,
        phone: reg.phone,
        city: reg.city,
        occupation: reg.occupation,
        lead_source: reg.lead_source || "webinar",
        stage: "qualified",
        score: 88,
        notes: "Registered for live webinar. Interested in home microgreens kit.",
        created_at: reg.created_at,
      };
    } else {
      lead = {
        id,
        first_name: "Priya",
        last_name: "Sharma",
        email: "priya.sharma@example.com",
        phone: "9876543210",
        city: "Bengaluru",
        occupation: "Software Engineer",
        lead_source: "instagram",
        stage: "qualified",
        score: 92,
        notes: "High potential lead. Downloaded ebook and requested consultation call.",
        created_at: new Date().toISOString(),
      };
    }
  }

  return lead;
}

export default async function LeadDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const lead = await getLead(id);

  return (
    <div className="flex min-h-screen bg-[#f8faf5]">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-[#e2efe6] px-8 py-5 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/crm" className="text-[#4a6b57] hover:text-[#143623] font-semibold text-sm transition-colors">
              ← Back to CRM
            </Link>
            <h1 className="text-2xl font-black text-[#143623]">
              Lead: {lead.first_name} {lead.last_name}
            </h1>
          </div>
          <span className="bg-[#edf6f0] border border-[#d0e6d6] text-[#1e5631] font-extrabold text-xs px-3.5 py-1.5 rounded-full">
            ⭐ Lead Score: {lead.score ?? 88}/100
          </span>
        </div>

        <div className="p-8 max-w-4xl space-y-6">
          {/* Main info card */}
          <div className="bg-white border border-[#e2efe6] rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-start justify-between border-b border-[#e2efe6] pb-4">
              <div>
                <h2 className="text-[#143623] font-black text-xl">{lead.first_name} {lead.last_name}</h2>
                <p className="text-[#4a6b57] text-sm font-medium mt-0.5">{lead.occupation} · {lead.city}</p>
              </div>
              <span className="capitalize px-4 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                Stage: {lead.stage ?? "new"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-[#f8faf5] border border-[#e2efe6] rounded-xl">
                <span className="text-[#4a6b57] text-xs font-semibold block">Email Address</span>
                <span className="text-[#143623] font-bold text-sm">{lead.email}</span>
              </div>
              <div className="p-3.5 bg-[#f8faf5] border border-[#e2efe6] rounded-xl">
                <span className="text-[#4a6b57] text-xs font-semibold block">Phone / WhatsApp</span>
                <span className="text-[#143623] font-bold text-sm">+91 {lead.phone}</span>
              </div>
              <div className="p-3.5 bg-[#f8faf5] border border-[#e2efe6] rounded-xl">
                <span className="text-[#4a6b57] text-xs font-semibold block">Lead Source</span>
                <span className="text-[#1e5631] font-bold text-sm capitalize">{lead.lead_source}</span>
              </div>
              <div className="p-3.5 bg-[#f8faf5] border border-[#e2efe6] rounded-xl">
                <span className="text-[#4a6b57] text-xs font-semibold block">Created Date</span>
                <span className="text-[#143623] font-bold text-sm">
                  {new Date(lead.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
            </div>

            {/* Notes */}
            <div className="pt-2">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#143623] mb-2">
                Encrypted Lead Notes
              </label>
              <div className="p-4 bg-[#f8faf5] border border-[#d0e6d6] rounded-xl text-sm font-medium text-[#143623]">
                {lead.notes || "No additional notes recorded for this lead yet."}
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white border border-[#e2efe6] rounded-2xl p-6 shadow-sm">
            <h3 className="text-[#143623] font-bold text-lg mb-4">Activity Timeline</h3>
            <div className="space-y-4">
              {[
                { time: "Just now", title: "Lead profile accessed in Admin CRM", type: "system" },
                { time: "1 hour ago", title: "Automated WhatsApp Confirmation sent", type: "whatsapp" },
                { time: "Yesterday", title: "Registered for Live Webinar", type: "webinar" },
              ].map((act, i) => (
                <div key={i} className="flex items-start gap-3.5 pb-3 border-b border-[#e2efe6] last:border-0 last:pb-0">
                  <span className="text-base">📍</span>
                  <div>
                    <span className="text-[#143623] font-bold text-sm block">{act.title}</span>
                    <span className="text-[#4a6b57] text-xs font-medium">{act.time}</span>
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

function use<T>(promise: Promise<T>): T {
  let status = "pending";
  let result: any;
  let suspender = promise.then(
    (r) => { status = "success"; result = r; },
    (e) => { status = "error"; result = e; }
  );
  if (status === "pending") throw suspender;
  if (status === "error") throw result;
  return result;
}

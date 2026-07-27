import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "../components/sidebar";

export const metadata = {
  title: "Dashboard | Krave Admin",
};

async function getStats() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Parallel queries
  const [
    { count: totalRegistrations },
    { count: totalWebinars },
    { data: leadSources },
    { data: recentRegistrations },
  ] = await Promise.all([
    supabase.from("registrations").select("*", { count: "exact", head: true }),
    supabase.from("webinars").select("*", { count: "exact", head: true }),
    supabase.from("registrations").select("lead_source").limit(500),
    supabase
      .from("registrations")
      .select("first_name, last_name, email, city, lead_source, created_at, status")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  // Lead source breakdown
  const sourceMap: Record<string, number> = {};
  (leadSources ?? []).forEach((r: { lead_source: string }) => {
    const src = r.lead_source ?? "unknown";
    sourceMap[src] = (sourceMap[src] ?? 0) + 1;
  });
  const topSource = Object.entries(sourceMap).sort((a, b) => b[1] - a[1])[0];

  return {
    totalRegistrations: totalRegistrations ?? 0,
    totalWebinars: totalWebinars ?? 0,
    topSource: topSource ? `${topSource[0]} (${topSource[1]})` : "—",
    recentRegistrations: recentRegistrations ?? [],
  };
}

function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: string;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="bg-white border border-[#e2efe6] rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-[#4a6b57] text-sm font-semibold">{label}</span>
      </div>
      <p className="text-3xl font-black text-[#143623]">{value}</p>
      {sub && <p className="text-[#6b8e78] text-xs mt-1 font-medium">{sub}</p>}
    </div>
  );
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="flex min-h-screen bg-[#f8faf5]">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-[#e2efe6] px-8 py-5 shadow-sm">
          <h1 className="text-2xl font-black text-[#143623]">Dashboard</h1>
          <p className="text-[#4a6b57] text-sm mt-0.5 font-medium">Overview of your webinar platform</p>
        </div>

        <div className="p-8 space-y-6">
          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard icon="📋" label="Total Registrations" value={stats.totalRegistrations} sub="All webinars" />
            <StatCard icon="🎙️" label="Webinars" value={stats.totalWebinars} sub="Created so far" />
            <StatCard icon="🎯" label="Top Lead Source" value={stats.topSource} sub="Most registrations" />
            <StatCard icon="✅" label="Confirmed Rate" value="—" sub="Feature coming soon" />
          </div>

          {/* Recent registrations */}
          <div className="bg-white border border-[#e2efe6] rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2efe6] bg-[#f8faf5]/40">
              <h2 className="text-[#143623] font-bold text-lg">Recent Registrations</h2>
              <a href="/registrations" className="text-[#1e5631] font-semibold text-sm hover:underline">
                View all →
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e2efe6] bg-[#f8faf5]/80">
                    {["Name", "City", "Source", "Status", "Date"].map((h) => (
                      <th key={h} className="text-left px-6 py-3.5 text-[#4a6b57] font-bold text-xs uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2efe6]/60">
                  {stats.recentRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-[#6b8e78] font-medium">
                        No registrations yet. Share the webinar link to get started!
                      </td>
                    </tr>
                  ) : (
                    stats.recentRegistrations.map((reg: Record<string, string>, i: number) => (
                      <tr
                        key={i}
                        className="hover:bg-[#f0f7f2]/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-[#143623] font-bold">
                          {reg.first_name} {reg.last_name}
                        </td>
                        <td className="px-6 py-4 text-[#4a6b57]">{reg.city}</td>
                        <td className="px-6 py-4 text-[#4a6b57] capitalize">{reg.lead_source}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            reg.status === "attended"
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : reg.status === "registered"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}>
                            {reg.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#6b8e78] text-xs font-medium">
                          {reg.created_at
                            ? new Date(reg.created_at).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "—"}
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

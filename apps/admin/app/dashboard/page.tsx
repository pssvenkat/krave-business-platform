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
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-gray-400 text-sm font-medium">{label}</span>
      </div>
      <p className="text-3xl font-black text-white">{value}</p>
      {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
    </div>
  );
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="flex min-h-screen bg-[#080f0b]">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="border-b border-white/10 px-6 py-4">
          <h1 className="text-xl font-black text-white">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Overview of your webinar platform</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon="📋" label="Total Registrations" value={stats.totalRegistrations} sub="All webinars" />
            <StatCard icon="🎙️" label="Webinars" value={stats.totalWebinars} sub="Created so far" />
            <StatCard icon="🎯" label="Top Lead Source" value={stats.topSource} sub="Most registrations" />
            <StatCard icon="✅" label="Confirmed Rate" value="—" sub="Feature coming soon" />
          </div>

          {/* Recent registrations */}
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <h2 className="text-white font-bold">Recent Registrations</h2>
              <a href="/registrations" className="text-green-400 text-sm hover:underline">
                View all →
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {["Name", "City", "Source", "Status", "Date"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-gray-500 font-medium text-xs uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats.recentRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-600">
                        No registrations yet. Share the webinar link to get started!
                      </td>
                    </tr>
                  ) : (
                    stats.recentRegistrations.map((reg: Record<string, string>, i: number) => (
                      <tr
                        key={i}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-5 py-3 text-white font-medium">
                          {reg.first_name} {reg.last_name}
                        </td>
                        <td className="px-5 py-3 text-gray-400">{reg.city}</td>
                        <td className="px-5 py-3 text-gray-400 capitalize">{reg.lead_source}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            reg.status === "attended"
                              ? "bg-green-500/20 text-green-400"
                              : reg.status === "registered"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-gray-500/20 text-gray-400"
                          }`}>
                            {reg.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-gray-500 text-xs">
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

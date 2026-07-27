import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "../components/sidebar";

export const metadata = { title: "Analytics | Krave Admin" };

async function getAnalyticsData() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [
    { count: totalCount },
    { data: registrations },
  ] = await Promise.all([
    supabase.from("registrations").select("*", { count: "exact", head: true }),
    supabase.from("registrations").select("lead_source, city, status, created_at").limit(1000),
  ]);

  // Aggregate sources
  const sourceMap: Record<string, number> = {};
  const cityMap: Record<string, number> = {};
  const statusMap: Record<string, number> = {};

  (registrations ?? []).forEach((r) => {
    const src = r.lead_source || "Direct / Unknown";
    sourceMap[src] = (sourceMap[src] || 0) + 1;

    const c = r.city || "Other";
    cityMap[c] = (cityMap[c] || 0) + 1;

    const s = r.status || "registered";
    statusMap[s] = (statusMap[s] || 0) + 1;
  });

  const sortedSources = Object.entries(sourceMap).sort((a, b) => b[1] - a[1]);
  const sortedCities = Object.entries(cityMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return {
    totalRegistrations: totalCount ?? 0,
    sources: sortedSources,
    cities: sortedCities,
    statusMap,
  };
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  return (
    <div className="flex min-h-screen bg-[#f8faf5]">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-[#e2efe6] px-8 py-5 shadow-sm">
          <h1 className="text-2xl font-black text-[#143623]">Analytics & Insights</h1>
          <p className="text-[#4a6b57] text-sm mt-0.5 font-medium">
            Traffic channels, city breakdown, and conversion metrics
          </p>
        </div>

        <div className="p-8 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white border border-[#e2efe6] rounded-2xl p-6 shadow-sm">
              <span className="text-[#4a6b57] text-xs font-bold uppercase tracking-wider">Total Registrations</span>
              <p className="text-3xl font-black text-[#143623] mt-2">{data.totalRegistrations}</p>
              <p className="text-[#6b8e78] text-xs mt-1 font-medium">All time signups</p>
            </div>
            <div className="bg-white border border-[#e2efe6] rounded-2xl p-6 shadow-sm">
              <span className="text-[#4a6b57] text-xs font-bold uppercase tracking-wider">Top Source</span>
              <p className="text-2xl font-black text-[#1e5631] mt-2 capitalize">
                {data.sources[0] ? data.sources[0][0] : "—"}
              </p>
              <p className="text-[#6b8e78] text-xs mt-1 font-medium">
                {data.sources[0] ? `${data.sources[0][1]} registrations` : "No data yet"}
              </p>
            </div>
            <div className="bg-white border border-[#e2efe6] rounded-2xl p-6 shadow-sm">
              <span className="text-[#4a6b57] text-xs font-bold uppercase tracking-wider">Top City</span>
              <p className="text-2xl font-black text-[#143623] mt-2">
                {data.cities[0] ? data.cities[0][0] : "—"}
              </p>
              <p className="text-[#6b8e78] text-xs mt-1 font-medium">
                {data.cities[0] ? `${data.cities[0][1]} attendees` : "No data yet"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Traffic Sources */}
            <div className="bg-white border border-[#e2efe6] rounded-2xl p-6 shadow-sm">
              <h2 className="text-[#143623] font-bold text-lg mb-4">Traffic & Lead Channels</h2>
              {data.sources.length === 0 ? (
                <p className="text-[#6b8e78] text-sm py-4">No registration sources recorded yet.</p>
              ) : (
                <div className="space-y-4">
                  {data.sources.map(([source, count]) => {
                    const pct = data.totalRegistrations ? Math.round((count / data.totalRegistrations) * 100) : 0;
                    return (
                      <div key={source}>
                        <div className="flex justify-between text-sm font-semibold mb-1">
                          <span className="text-[#143623] capitalize">{source}</span>
                          <span className="text-[#4a6b57]">{count} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-[#edf6f0] h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#1e5631] h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Geographic Distribution */}
            <div className="bg-white border border-[#e2efe6] rounded-2xl p-6 shadow-sm">
              <h2 className="text-[#143623] font-bold text-lg mb-4">Top Cities</h2>
              {data.cities.length === 0 ? (
                <p className="text-[#6b8e78] text-sm py-4">No city data available yet.</p>
              ) : (
                <div className="space-y-3">
                  {data.cities.map(([city, count], i) => (
                    <div key={city} className="flex items-center justify-between p-3.5 bg-[#f8faf5] border border-[#e2efe6] rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#1e5631] text-white text-xs font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-[#143623] font-bold text-sm">{city}</span>
                      </div>
                      <span className="text-[#1e5631] font-bold text-sm">{count} registrants</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

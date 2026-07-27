import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "../../components/sidebar";

async function getWebinarData(id: string) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: webinar }, { data: registrations, count }] = await Promise.all([
    supabase.from("webinars").select("*").eq("id", id).single(),
    supabase
      .from("registrations")
      .select("id, first_name, last_name, email, phone, city, lead_source, status, created_at", { count: "exact" })
      .eq("webinar_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!webinar) notFound();
  return { webinar, registrations: registrations ?? [], count: count ?? 0 };
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    registered: "bg-blue-500/20 text-blue-400",
    confirmed: "bg-green-500/20 text-green-400",
    attended: "bg-emerald-500/20 text-emerald-400",
    "no-show": "bg-red-500/20 text-red-400",
    cancelled: "bg-gray-500/20 text-gray-400",
  };
  return map[status] ?? "bg-gray-500/20 text-gray-400";
}

interface Props { params: Promise<{ id: string }> }

export default async function WebinarDetailPage({ params }: Props) {
  const { id } = await params;
  const { webinar, registrations, count } = await getWebinarData(id);

  return (
    <div className="flex min-h-screen bg-[#080f0b]">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="border-b border-white/10 px-6 py-4 flex items-center gap-4">
          <Link href="/webinars" className="text-gray-500 hover:text-white text-sm transition-colors">
            ← Webinars
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-black text-white leading-tight">{webinar.title}</h1>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Webinar info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Status", value: webinar.status },
              {
                label: "Scheduled",
                value: new Date(webinar.scheduled_at).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric",
                }),
              },
              { label: "Registrations", value: `${count} / ${webinar.max_seats}` },
              { label: "Duration", value: `${webinar.duration_minutes} min` },
            ].map((item) => (
              <div key={item.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-gray-500 text-xs mb-1">{item.label}</p>
                <p className="text-white font-bold capitalize">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Registrations table */}
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <h2 className="text-white font-bold">Registrations ({count})</h2>
              <a
                href={`/api/admin/webinars/${id}/export`}
                className="text-green-400 text-sm hover:underline"
              >
                Export CSV ↓
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {["Name", "Email", "City", "Source", "Status", "Registered"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-gray-500 font-medium text-xs uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {registrations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-600">
                        No registrations yet for this webinar.
                      </td>
                    </tr>
                  ) : (
                    registrations.map((r: Record<string, string>) => (
                      <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-5 py-3 text-white font-medium">{r.first_name} {r.last_name}</td>
                        <td className="px-5 py-3 text-gray-400 text-xs">{r.email}</td>
                        <td className="px-5 py-3 text-gray-400">{r.city}</td>
                        <td className="px-5 py-3 text-gray-400 capitalize">{r.lead_source}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusBadge(r.status ?? "registered")}`}>
                            {r.status ?? "registered"}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-gray-500 text-xs">
                          {r.created_at ? new Date(r.created_at).toLocaleDateString("en-IN") : "—"}
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

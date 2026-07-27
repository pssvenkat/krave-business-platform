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
    registered: "bg-blue-50 text-blue-700 border border-blue-200",
    confirmed: "bg-green-100 text-green-800 border border-green-200",
    attended: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    "no-show": "bg-red-50 text-red-700 border border-red-200",
    cancelled: "bg-gray-100 text-gray-700 border border-gray-200",
  };
  return map[status] ?? "bg-gray-100 text-gray-700 border border-gray-200";
}

interface Props { params: Promise<{ id: string }> }

export default async function WebinarDetailPage({ params }: Props) {
  const { id } = await params;
  const { webinar, registrations, count } = await getWebinarData(id);

  return (
    <div className="flex min-h-screen bg-[#f8faf5]">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-[#e2efe6] px-8 py-5 shadow-sm flex items-center gap-4">
          <Link href="/webinars" className="text-[#4a6b57] hover:text-[#143623] font-semibold text-sm transition-colors">
            ← Back to Webinars
          </Link>
          <div className="flex-1">
            <h1 className="text-xl font-black text-[#143623] leading-tight">{webinar.title}</h1>
          </div>
        </div>

        <div className="p-8 space-y-6">
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
              { label: "Registrations", value: `${count} / ${webinar.max_registrations ?? 500}` },
              { label: "Duration", value: `${webinar.duration_minutes} min` },
            ].map((item) => (
              <div key={item.label} className="bg-white border border-[#e2efe6] rounded-2xl p-5 shadow-sm">
                <p className="text-[#4a6b57] text-xs font-bold uppercase tracking-wider mb-1">{item.label}</p>
                <p className="text-[#143623] font-black text-lg capitalize">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Registrations table */}
          <div className="bg-white border border-[#e2efe6] rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2efe6] bg-[#f8faf5]/40">
              <h2 className="text-[#143623] font-bold text-lg">Registrations ({count})</h2>
              <a
                href={`/api/admin/webinars/${id}/export`}
                className="text-[#1e5631] font-bold text-sm hover:underline flex items-center gap-1"
              >
                Export CSV ↓
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e2efe6] bg-[#f8faf5]/80">
                    {["Name", "Email", "City", "Source", "Status", "Registered"].map((h) => (
                      <th key={h} className="text-left px-6 py-3.5 text-[#4a6b57] font-bold text-xs uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2efe6]/60">
                  {registrations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-[#6b8e78] font-medium">
                        No registrations yet for this webinar.
                      </td>
                    </tr>
                  ) : (
                    registrations.map((r: Record<string, string>) => (
                      <tr key={r.id} className="hover:bg-[#f0f7f2]/50 transition-colors">
                        <td className="px-6 py-4 text-[#143623] font-bold">{r.first_name} {r.last_name}</td>
                        <td className="px-6 py-4 text-[#4a6b57] text-xs font-medium">{r.email}</td>
                        <td className="px-6 py-4 text-[#4a6b57] font-medium">{r.city}</td>
                        <td className="px-6 py-4 text-[#4a6b57] capitalize font-medium">{r.lead_source}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${statusBadge(r.status ?? "registered")}`}>
                            {r.status ?? "registered"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[#6b8e78] text-xs font-medium">
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

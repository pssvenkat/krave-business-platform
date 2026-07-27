import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "../components/sidebar";

export const metadata = { title: "Registrations | Krave Admin" };

async function getRegistrations(search: string, status: string) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let query = supabase
    .from("registrations")
    .select("id, first_name, last_name, email, phone, city, lead_source, status, created_at, webinar_id", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(200);

  if (status && status !== "all") query = query.eq("status", status);
  if (search) {
    query = query.or(
      `first_name.ilike.%${search}%,last_name.ilike.%${search}%,city.ilike.%${search}%`
    );
  }

  const { data, count } = await query;
  return { registrations: data ?? [], count: count ?? 0 };
}

const STATUS_OPTIONS = ["all", "registered", "confirmed", "attended", "no-show", "cancelled"];

function statusBadge(s: string) {
  const m: Record<string, string> = {
    registered: "bg-blue-500/20 text-blue-400",
    confirmed: "bg-green-500/20 text-green-400",
    attended: "bg-emerald-500/20 text-emerald-400",
    "no-show": "bg-red-500/20 text-red-400",
    cancelled: "bg-gray-500/20 text-gray-400",
  };
  return m[s] ?? "bg-gray-500/20 text-gray-400";
}

interface Props {
  searchParams: Promise<{ q?: string; status?: string }>;
}

export default async function RegistrationsPage({ searchParams }: Props) {
  const params = await searchParams;
  const search = params.q ?? "";
  const status = params.status ?? "all";
  const { registrations, count } = await getRegistrations(search, status);

  return (
    <div className="flex min-h-screen bg-[#080f0b]">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-white">Registrations</h1>
            <p className="text-gray-500 text-sm mt-0.5">{count} total registrations</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {/* Search */}
            <form className="flex-1 min-w-48">
              <input
                name="q"
                defaultValue={search}
                placeholder="Search by name or city…"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-green-500 transition-all"
              />
            </form>

            {/* Status filter */}
            <div className="flex gap-2 flex-wrap">
              {STATUS_OPTIONS.map((s) => (
                <a
                  key={s}
                  href={`?status=${s}${search ? `&q=${search}` : ""}`}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                    status === s
                      ? "bg-green-600 text-white"
                      : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {["Name", "Email", "Phone", "City", "Source", "Status", "Date"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-gray-500 font-medium text-xs uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {registrations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-gray-600">
                        No registrations found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    registrations.map((r: Record<string, string>) => (
                      <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-5 py-3 text-white font-medium">{r.first_name} {r.last_name}</td>
                        <td className="px-5 py-3 text-gray-400 text-xs">{r.email}</td>
                        <td className="px-5 py-3 text-gray-400 text-xs">{r.phone}</td>
                        <td className="px-5 py-3 text-gray-400">{r.city}</td>
                        <td className="px-5 py-3 text-gray-400 capitalize">{r.lead_source}</td>
                        <td className="px-5 py-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusBadge(r.status ?? "registered")}`}>
                            {r.status ?? "registered"}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-gray-500 text-xs">
                          {r.created_at
                            ? new Date(r.created_at).toLocaleDateString("en-IN", {
                                day: "numeric", month: "short",
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

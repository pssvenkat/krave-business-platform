import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "../components/sidebar";
import { ExportRegistrationsButton } from "./export-button";

export const metadata = { title: "Registrations | Krave Admin" };

async function getRegistrationsData(search: string, status: string, webinarId: string) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch available webinars for the Webinar Date filter dropdown
  const { data: webinars } = await supabase
    .from("webinars")
    .select("id, title, scheduled_at")
    .order("scheduled_at", { ascending: false });

  // Query registrations
  let query = supabase
    .from("registrations")
    .select("id, first_name, last_name, email, phone, city, lead_source, status, created_at, webinar_id, webinars(id, title, scheduled_at)", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(300);

  if (status && status !== "all") query = query.eq("status", status);
  if (webinarId && webinarId !== "all") query = query.eq("webinar_id", webinarId);
  if (search) {
    query = query.or(
      `first_name.ilike.%${search}%,last_name.ilike.%${search}%,city.ilike.%${search}%`
    );
  }

  const { data, count } = await query;
  return {
    registrations: data ?? [],
    count: count ?? 0,
    webinars: webinars ?? [],
  };
}

const STATUS_OPTIONS = ["all", "registered", "confirmed", "attended", "no-show", "cancelled"];

function statusBadge(s: string) {
  const m: Record<string, string> = {
    registered: "bg-blue-50 text-blue-700 border border-blue-200",
    confirmed: "bg-green-100 text-green-800 border border-green-200",
    attended: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    "no-show": "bg-red-50 text-red-700 border border-red-200",
    cancelled: "bg-gray-100 text-gray-700 border border-gray-200",
  };
  return m[s] ?? "bg-gray-100 text-gray-700 border border-gray-200";
}

function formatWebinarDate(scheduledAt?: string | null): string {
  if (!scheduledAt) return "Sep 14, 2026, 11:00 AM IST"; // Default fallback
  try {
    return new Date(scheduledAt).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return scheduledAt;
  }
}

interface Props {
  searchParams: Promise<{ q?: string; status?: string; webinar_id?: string }>;
}

export default async function RegistrationsPage({ searchParams }: Props) {
  const params = await searchParams;
  const search = params.q ?? "";
  const status = params.status ?? "all";
  const selectedWebinarId = params.webinar_id ?? "all";

  const { registrations, count, webinars } = await getRegistrationsData(search, status, selectedWebinarId);

  return (
    <div className="flex min-h-screen bg-[#f8faf5]">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-[#e2efe6] px-8 py-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#143623]">Registrations</h1>
            <p className="text-[#4a6b57] text-sm mt-0.5 font-medium">{count} total registrations</p>
          </div>
          <div className="flex items-center gap-3">
            <ExportRegistrationsButton registrations={registrations} />
          </div>
        </div>

        <div className="p-8 space-y-5">
          {/* Filters Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search */}
            <form className="md:col-span-4">
              <input
                name="q"
                defaultValue={search}
                placeholder="Search by name or city…"
                className="w-full px-4 py-2.5 bg-white border border-[#d0e6d6] rounded-xl text-[#143623] placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#1e5631] focus:ring-2 focus:ring-[#1e5631]/20 transition-all shadow-xs"
              />
            </form>

            {/* Filter by Webinar Date Dropdown */}
            <div className="md:col-span-4">
              <form method="GET" className="flex items-center gap-2">
                {search && <input type="hidden" name="q" value={search} />}
                {status !== "all" && <input type="hidden" name="status" value={status} />}
                <select
                  name="webinar_id"
                  defaultValue={selectedWebinarId}
                  onChange={(e) => e.target.form?.submit()}
                  id="webinar-date-filter"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#d0e6d6] rounded-xl text-[#143623] text-xs font-bold focus:outline-none focus:border-[#1e5631] focus:ring-2 focus:ring-[#1e5631]/20 transition-all shadow-xs"
                >
                  <option value="all">🗓️ All Webinar Dates</option>
                  {webinars.map((w: any) => (
                    <option key={w.id} value={w.id}>
                      📅 {formatWebinarDate(w.scheduled_at)} — {w.title}
                    </option>
                  ))}
                </select>
              </form>
            </div>

            {/* Status Filter Badges */}
            <div className="md:col-span-4 flex gap-1.5 flex-wrap justify-end">
              {STATUS_OPTIONS.map((s) => (
                <a
                  key={s}
                  href={`?status=${s}${search ? `&q=${search}` : ""}${selectedWebinarId !== "all" ? `&webinar_id=${selectedWebinarId}` : ""}`}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                    status === s
                      ? "bg-[#1e5631] text-white shadow-sm"
                      : "bg-white border border-[#e2efe6] text-[#4a6b57] hover:text-[#143623] hover:bg-[#f0f7f2]"
                  }`}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-[#e2efe6] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e2efe6] bg-[#f8faf5]/80">
                    {["Name", "Email", "Phone", "City", "Source", "Status", "Webinar Date", "Registered On"].map((h) => (
                      <th key={h} className="text-left px-6 py-3.5 text-[#4a6b57] font-bold text-xs uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2efe6]/60">
                  {registrations.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-[#6b8e78] font-medium">
                        No registrations found matching your selected filters.
                      </td>
                    </tr>
                  ) : (
                    registrations.map((r: any) => {
                      const webinar = Array.isArray(r.webinars) ? r.webinars[0] : r.webinars;
                      const scheduledAt = webinar?.scheduled_at;
                      return (
                        <tr key={r.id} className="hover:bg-[#f0f7f2]/50 transition-colors">
                          <td className="px-6 py-4 text-[#143623] font-bold">{r.first_name} {r.last_name}</td>
                          <td className="px-6 py-4 text-[#4a6b57] text-xs font-medium">{r.email}</td>
                          <td className="px-6 py-4 text-[#4a6b57] text-xs font-medium">{r.phone}</td>
                          <td className="px-6 py-4 text-[#4a6b57] font-medium">{r.city}</td>
                          <td className="px-6 py-4 text-[#4a6b57] capitalize font-medium">{r.lead_source}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${statusBadge(r.status ?? "registered")}`}>
                              {r.status ?? "registered"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[#1e5631] font-bold text-xs">
                            📅 {formatWebinarDate(scheduledAt)}
                          </td>
                          <td className="px-6 py-4 text-[#6b8e78] text-xs font-medium">
                            {r.created_at
                              ? new Date(r.created_at).toLocaleDateString("en-IN", {
                                  day: "numeric", month: "short",
                                })
                              : "—"}
                          </td>
                        </tr>
                      );
                    })
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

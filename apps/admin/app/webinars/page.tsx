import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "../components/sidebar";

export const metadata = { title: "Webinars | Krave Admin" };

async function getWebinars() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: webinars } = await supabase
    .from("webinars")
    .select("id, title, scheduled_at, status, max_registrations")
    .order("scheduled_at", { ascending: false });

  // Count registrations per webinar
  const { data: counts } = await supabase
    .from("registrations")
    .select("webinar_id");

  const countMap: Record<string, number> = {};
  (counts ?? []).forEach((r: { webinar_id: string }) => {
    countMap[r.webinar_id] = (countMap[r.webinar_id] ?? 0) + 1;
  });

  return { webinars: webinars ?? [], countMap };
}

function statusBadge(status: string) {
  const map: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700 border border-gray-200",
    published: "bg-blue-50 text-blue-700 border border-blue-200",
    live: "bg-red-50 text-red-700 border border-red-200",
    ended: "bg-green-100 text-green-800 border border-green-200",
    cancelled: "bg-orange-50 text-orange-700 border border-orange-200",
  };
  return map[status] ?? "bg-gray-100 text-gray-700 border border-gray-200";
}

export default async function WebinarsPage() {
  const { webinars, countMap } = await getWebinars();

  return (
    <div className="flex min-h-screen bg-[#f8faf5]">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-[#e2efe6] px-8 py-5 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-[#143623]">Webinars</h1>
            <p className="text-[#4a6b57] text-sm mt-0.5 font-medium">Manage your webinar events and streams</p>
          </div>
          <Link
            href="/webinars/new"
            className="bg-[#1e5631] hover:bg-[#2d7d46] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm flex items-center gap-1.5"
          >
            + New Webinar
          </Link>
        </div>

        <div className="p-8">
          {webinars.length === 0 ? (
            <div className="text-center py-20 bg-white border border-[#e2efe6] rounded-2xl p-8 shadow-sm">
              <div className="text-5xl mb-4">🎙️</div>
              <h2 className="text-[#143623] font-black text-xl mb-2">No webinars yet</h2>
              <p className="text-[#4a6b57] text-sm mb-6">Create your first webinar to get started.</p>
              <Link
                href="/webinars/new"
                className="bg-[#1e5631] hover:bg-[#2d7d46] text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 inline-block shadow-sm"
              >
                Create Webinar →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {webinars.map((w: Record<string, unknown>) => (
                <Link
                  key={w.id as string}
                  href={`/webinars/${w.id}`}
                  className="block bg-white border border-[#e2efe6] rounded-2xl p-6 hover:border-[#1e5631] hover:shadow-md transition-all duration-200 group shadow-xs"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold capitalize ${statusBadge(w.status as string)}`}>
                          {w.status as string}
                        </span>
                      </div>
                      <h3 className="text-[#143623] font-black text-lg group-hover:text-[#1e5631] transition-colors">
                        {w.title as string}
                      </h3>
                      <p className="text-[#4a6b57] text-sm mt-1 font-medium">
                        {new Date(w.scheduled_at as string).toLocaleDateString("en-IN", {
                          timeZone: "Asia/Kolkata",
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })} IST
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 bg-[#f8faf5] border border-[#e2efe6] px-4 py-2.5 rounded-xl">
                      <p className="text-2xl font-black text-[#143623]">
                        {countMap[w.id as string] ?? 0}
                      </p>
                      <p className="text-[#6b8e78] text-xs font-bold uppercase tracking-wider">
                        / {(w.max_registrations as number) ?? 500} seats
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

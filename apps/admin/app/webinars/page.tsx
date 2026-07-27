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
    .select("id, title, scheduled_at, status, max_seats, is_published")
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
    draft: "bg-gray-500/20 text-gray-400",
    published: "bg-blue-500/20 text-blue-400",
    live: "bg-red-500/20 text-red-400",
    ended: "bg-green-500/20 text-green-400",
    cancelled: "bg-orange-500/20 text-orange-400",
  };
  return map[status] ?? "bg-gray-500/20 text-gray-400";
}

export default async function WebinarsPage() {
  const { webinars, countMap } = await getWebinars();

  return (
    <div className="flex min-h-screen bg-[#080f0b]">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-white">Webinars</h1>
            <p className="text-gray-500 text-sm mt-0.5">Manage your webinar events</p>
          </div>
          <Link
            href="/webinars/new"
            className="bg-green-600 hover:bg-green-500 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-all duration-200"
          >
            + New Webinar
          </Link>
        </div>

        <div className="p-6">
          {webinars.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🎙️</div>
              <h2 className="text-white font-bold text-xl mb-2">No webinars yet</h2>
              <p className="text-gray-500 mb-6">Create your first webinar to get started.</p>
              <Link
                href="/webinars/new"
                className="bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200"
              >
                Create Webinar →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {webinars.map((w: Record<string, unknown>) => (
                <Link
                  key={w.id as string}
                  href={`/webinars/${w.id}`}
                  className="block bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 hover:border-green-500/30 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusBadge(w.status as string)}`}>
                          {w.status as string}
                        </span>
                        {!w.is_published && (
                          <span className="text-gray-500 text-xs">· Draft</span>
                        )}
                      </div>
                      <h3 className="text-white font-bold text-base group-hover:text-green-300 transition-colors">
                        {w.title as string}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">
                        {new Date(w.scheduled_at as string).toLocaleDateString("en-IN", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl font-black text-white">
                        {countMap[w.id as string] ?? 0}
                      </p>
                      <p className="text-gray-500 text-xs">
                        / {w.max_seats as number} seats
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

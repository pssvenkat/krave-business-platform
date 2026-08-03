import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "../components/sidebar";
import { AnalyticsDashboard, RegistrationRecord } from "./analytics-dashboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = { title: "Analytics & Insights | Krave Admin" };

async function getData() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: regs } = await supabase
    .from("registrations")
    .select("id, lead_source, city, status, created_at")
    .order("created_at", { ascending: false });

  return { registrations: (regs ?? []) as RegistrationRecord[] };
}

export default async function AnalyticsPage() {
  const { registrations } = await getData();

  return (
    <div className="flex min-h-screen bg-[#f8faf5]">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-[#e2efe6] px-8 py-5 shadow-sm">
          <h1 className="text-2xl font-black text-[#143623]">Analytics & Insights</h1>
          <p className="text-[#4a6b57] text-sm mt-0.5 font-medium">
            Live database conversion funnel · Channel breakdown · Geographic performance
          </p>
        </div>

        <div className="p-8">
          <AnalyticsDashboard registrations={registrations} />
        </div>
      </div>
    </div>
  );
}

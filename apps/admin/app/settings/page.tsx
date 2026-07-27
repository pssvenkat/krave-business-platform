import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Sidebar } from "../components/sidebar";

export const metadata = { title: "Settings | Krave Admin" };

async function checkServices() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return {
    userEmail: user.email ?? "Admin",
    supabaseConfigured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    resendConfigured: !!process.env.RESEND_API_KEY,
    posthogConfigured: !!process.env.NEXT_PUBLIC_POSTHOG_KEY,
    turnstileConfigured: !!process.env.TURNSTILE_SECRET_KEY,
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://webinar.kravemicrogreens.in",
  };
}

export default async function SettingsPage() {
  const services = await checkServices();

  return (
    <div className="flex min-h-screen bg-[#f8faf5]">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-[#e2efe6] px-8 py-5 shadow-sm">
          <h1 className="text-2xl font-black text-[#143623]">Platform Settings</h1>
          <p className="text-[#4a6b57] text-sm mt-0.5 font-medium">
            System configuration, integrations & environment health
          </p>
        </div>

        <div className="p-8 space-y-6 max-w-4xl">
          {/* Account Card */}
          <div className="bg-white border border-[#e2efe6] rounded-2xl p-6 shadow-sm">
            <h2 className="text-[#143623] font-bold text-lg mb-4">Account Information</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-[#f8faf5] border border-[#e2efe6] rounded-xl">
                <span className="text-[#4a6b57] text-sm font-semibold">Signed in as</span>
                <span className="text-[#143623] font-bold text-sm">{services.userEmail}</span>
              </div>
              <div className="flex items-center justify-between p-3.5 bg-[#f8faf5] border border-[#e2efe6] rounded-xl">
                <span className="text-[#4a6b57] text-sm font-semibold">Primary Site URL</span>
                <span className="text-[#1e5631] font-bold text-sm">{services.siteUrl}</span>
              </div>
            </div>
          </div>

          {/* Integrations Health */}
          <div className="bg-white border border-[#e2efe6] rounded-2xl p-6 shadow-sm">
            <h2 className="text-[#143623] font-bold text-lg mb-4">Integrations Status</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: "Supabase Database & Auth", active: services.supabaseConfigured },
                { name: "Resend Email Service", active: services.resendConfigured },
                { name: "PostHog Analytics", active: services.posthogConfigured },
                { name: "Cloudflare Turnstile", active: services.turnstileConfigured },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-4 bg-[#f8faf5] border border-[#e2efe6] rounded-xl"
                >
                  <span className="text-[#143623] font-bold text-sm">{item.name}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.active
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-amber-50 text-amber-800 border border-amber-200"
                    }`}
                  >
                    {item.active ? "✓ Configured" : "⚠ Not Set"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Environment Info */}
          <div className="bg-white border border-[#e2efe6] rounded-2xl p-6 shadow-sm">
            <h2 className="text-[#143623] font-bold text-lg mb-2">System Stack</h2>
            <p className="text-[#4a6b57] text-sm mb-4">
              Krave Business Platform Monorepo
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#1e5631]">
              <span className="bg-[#edf6f0] px-3 py-1.5 rounded-lg border border-[#d0e6d6]">Next.js 16 App Router</span>
              <span className="bg-[#edf6f0] px-3 py-1.5 rounded-lg border border-[#d0e6d6]">Turborepo 2.x</span>
              <span className="bg-[#edf6f0] px-3 py-1.5 rounded-lg border border-[#d0e6d6]">pnpm 10 Workspace</span>
              <span className="bg-[#edf6f0] px-3 py-1.5 rounded-lg border border-[#d0e6d6]">Tailwind CSS v4</span>
              <span className="bg-[#edf6f0] px-3 py-1.5 rounded-lg border border-[#d0e6d6]">Supabase SSR</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

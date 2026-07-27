import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Krave Admin",
};

/**
 * Admin Dashboard – Milestone 1 Placeholder
 * Full dashboard with metrics and webinar management in Milestone 2.
 */
export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">🌱</span>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Krave Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-sm">
              Milestone 1 – Foundation
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Registrations", value: "—", icon: "👥" },
            { label: "Upcoming Webinars", value: "—", icon: "📅" },
            { label: "Attendance Rate", value: "—", icon: "📊" },
            { label: "Total Leads", value: "—", icon: "🎯" },
          ].map((metric) => (
            <div
              key={metric.label}
              className="rounded-xl border bg-card p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{metric.icon}</span>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {metric.value}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {metric.label}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border bg-card p-8 text-center">
          <p className="text-muted-foreground">
            Full dashboard with real data coming in Milestone 2.
          </p>
        </div>
      </div>
    </main>
  );
}

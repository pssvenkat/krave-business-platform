"use client";

import { useState } from "react";

interface RegistrationItem {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  lead_source: string;
  status: string;
  created_at: string;
  webinars?: {
    title?: string;
    scheduled_at?: string;
  } | { title?: string; scheduled_at?: string }[];
}

interface Props {
  registrations: RegistrationItem[];
}

function formatWebinarDate(scheduledAt?: string | null): string {
  if (!scheduledAt) return "Sep 14, 2026, 11:00 AM IST";
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

export function ExportRegistrationsButton({ registrations }: Props) {
  const [exporting, setExporting] = useState(false);

  const handleExportCSV = () => {
    setExporting(true);
    try {
      const headers = [
        "First Name",
        "Last Name",
        "Email",
        "Phone",
        "City",
        "Lead Source",
        "Status",
        "Webinar Title",
        "Scheduled Webinar Date",
        "Registration Date",
      ];

      const rows = registrations.map((r) => {
        const webinar = Array.isArray(r.webinars) ? r.webinars[0] : r.webinars;
        const scheduledDate = formatWebinarDate(webinar?.scheduled_at);
        const registeredDate = r.created_at
          ? new Date(r.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "—";

        return [
          `"${(r.first_name || "").replace(/"/g, '""')}"`,
          `"${(r.last_name || "").replace(/"/g, '""')}"`,
          `"${(r.email || "").replace(/"/g, '""')}"`,
          `"${(r.phone || "").replace(/"/g, '""')}"`,
          `"${(r.city || "").replace(/"/g, '""')}"`,
          `"${(r.lead_source || "").replace(/"/g, '""')}"`,
          `"${(r.status || "registered").replace(/"/g, '""')}"`,
          `"${(webinar?.title || "How to start microgreens Business").replace(/"/g, '""')}"`,
          `"${scheduledDate.replace(/"/g, '""')}"`,
          `"${registeredDate.replace(/"/g, '""')}"`,
        ].join(",");
      });

      const csvContent = [headers.join(","), ...rows].join("\n");
      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const dateStr = new Date().toISOString().split("T")[0];
      
      link.setAttribute("href", url);
      link.setAttribute("download", `krave_registrations_export_${dateStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("CSV Export failed:", err);
    } finally {
      setTimeout(() => setExporting(false), 500);
    }
  };

  return (
    <button
      onClick={handleExportCSV}
      disabled={exporting || registrations.length === 0}
      id="export-csv-btn"
      className="inline-flex items-center gap-2 bg-white border border-[#d0e6d6] hover:bg-[#f0f7f2] hover:border-[#1e5631] text-[#143623] font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span className="text-base leading-none">📥</span>
      <span>{exporting ? "Exporting CSV..." : "Export CSV / Excel"}</span>
    </button>
  );
}

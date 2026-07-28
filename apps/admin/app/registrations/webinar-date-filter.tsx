"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface WebinarItem {
  id: string;
  title?: string;
  scheduled_at?: string;
}

interface Props {
  webinars: WebinarItem[];
  selectedWebinarId: string;
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

export function WebinarDateFilter({ webinars, selectedWebinarId }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (val && val !== "all") {
      params.set("webinar_id", val);
    } else {
      params.delete("webinar_id");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <select
      value={selectedWebinarId}
      onChange={handleChange}
      id="webinar-date-filter"
      className="w-full px-3.5 py-2.5 bg-white border border-[#d0e6d6] rounded-xl text-[#143623] text-xs font-bold focus:outline-none focus:border-[#1e5631] focus:ring-2 focus:ring-[#1e5631]/20 transition-all shadow-xs"
    >
      <option value="all">🗓️ All Webinar Dates</option>
      {webinars.map((w) => (
        <option key={w.id} value={w.id}>
          📅 {formatWebinarDate(w.scheduled_at)} — {w.title}
        </option>
      ))}
    </select>
  );
}

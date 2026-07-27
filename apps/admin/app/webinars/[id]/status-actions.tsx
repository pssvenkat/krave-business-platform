"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";

interface Props {
  webinarId: string;
  currentStatus: string;
}

export function StatusActions({ webinarId, currentStatus }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase
      .from("webinars")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", webinarId);

    if (!error) {
      setStatus(newStatus);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Edit button */}
      <Link
        href={`/webinars/${webinarId}/edit`}
        className="bg-white border border-[#d0e6d6] hover:bg-[#edf6f0] text-[#1e5631] font-bold text-sm px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
      >
        ✏️ Edit Webinar
      </Link>

      {status === "draft" && (
        <button
          onClick={() => updateStatus("published")}
          disabled={loading}
          className="bg-[#1e5631] hover:bg-[#2d7d46] disabled:opacity-50 text-white font-bold text-sm px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
        >
          {loading ? "Publishing…" : "🚀 Publish Webinar"}
        </button>
      )}

      {status === "published" && (
        <>
          <button
            onClick={() => updateStatus("live")}
            disabled={loading}
            className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-sm px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            {loading ? "Updating…" : "🔴 Go Live"}
          </button>
          <button
            onClick={() => updateStatus("draft")}
            disabled={loading}
            className="bg-white border border-[#e2efe6] text-[#4a6b57] hover:text-[#143623] hover:bg-[#f0f7f2] font-semibold text-sm px-3.5 py-2 rounded-xl transition-all"
          >
            Unpublish (Draft)
          </button>
        </>
      )}

      {status === "live" && (
        <button
          onClick={() => updateStatus("ended")}
          disabled={loading}
          className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white font-bold text-sm px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
        >
          {loading ? "Updating…" : "🏁 End Webinar"}
        </button>
      )}

      {status === "ended" && (
        <span className="text-gray-500 text-xs font-bold uppercase bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200">
          Webinar Concluded
        </span>
      )}
    </div>
  );
}

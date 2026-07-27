"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";

interface Props {
  trainerId: string;
  trainerName: string;
}

export function TrainerActions({ trainerId, trainerName }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete the trainer profile for "${trainerName}"?`)) {
      return;
    }

    setLoading(true);
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase
      .from("trainers")
      .delete()
      .eq("id", trainerId);

    if (error) {
      alert("Failed to delete trainer: " + error.message);
    } else {
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/trainers/${trainerId}/edit`}
        className="bg-white border border-[#e2efe6] hover:bg-[#f0f7f2] text-[#1e5631] font-bold text-xs px-3.5 py-2 rounded-xl transition-all"
      >
        ✏️ Edit
      </Link>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold text-xs px-3.5 py-2 rounded-xl transition-all disabled:opacity-50"
      >
        {loading ? "Deleting…" : "🗑️ Delete"}
      </button>
    </div>
  );
}

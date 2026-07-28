"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f8faf5] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-3 border-[#1e5631] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-[#4a6b57] text-sm font-semibold">Redirecting to Krave Admin Portal…</p>
      </div>
    </div>
  );
}

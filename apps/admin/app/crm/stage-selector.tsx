"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export const STAGE_OPTIONS = [
  { value: "new", label: "New Lead", color: "bg-sky-50 text-sky-700 border-sky-200", dot: "bg-sky-500" },
  { value: "contacted", label: "Contacted", color: "bg-amber-50 text-amber-800 border-amber-200", dot: "bg-amber-500" },
  { value: "qualified", label: "Qualified", color: "bg-violet-50 text-violet-700 border-violet-200", dot: "bg-violet-500" },
  { value: "converted", label: "Converted", color: "bg-green-100 text-green-800 border-green-200", dot: "bg-green-500" },
  { value: "lost", label: "Lost", color: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-400" },
];

export function InlineStageSelector({
  leadId,
  currentStage,
  leadData,
}: {
  leadId: string;
  currentStage: string;
  leadData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: string;
    occupation: string;
    leadSource: string;
    notes?: string;
  };
}) {
  const router = useRouter();
  const [stage, setStage] = useState(currentStage);
  const [updating, setUpdating] = useState(false);

  const handleStageChange = async (newStage: string) => {
    if (newStage === stage || updating) return;
    setUpdating(true);
    setStage(newStage);

    try {
      const res = await fetch(`/api/crm/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: leadData.firstName,
          lastName: leadData.lastName,
          email: leadData.email,
          phone: leadData.phone,
          city: leadData.city,
          occupation: leadData.occupation || "Grower",
          leadSource: leadData.leadSource || "webinar",
          stage: newStage,
          notes: leadData.notes || "",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update stage");
      }

      router.refresh();
    } catch {
      setStage(stage); // revert on error
    } finally {
      setUpdating(false);
    }
  };

  const currentOption = STAGE_OPTIONS.find((s) => s.value === stage) || STAGE_OPTIONS[0]!;

  return (
    <div className="relative inline-block">
      <select
        value={stage}
        disabled={updating}
        onChange={(e) => handleStageChange(e.target.value)}
        className={`appearance-none cursor-pointer pl-3 pr-7 py-1 rounded-full text-xs font-bold border transition-all ${currentOption.color} focus:outline-none focus:ring-2 focus:ring-[#1e5631]/20 disabled:opacity-50`}
      >
        {STAGE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-white text-gray-800 font-semibold py-1">
            {opt.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] opacity-70">
        ▼
      </span>
    </div>
  );
}

export function InteractiveStageTracker({
  leadId,
  currentStage,
  leadData,
}: {
  leadId: string;
  currentStage: string;
  leadData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: string;
    occupation: string;
    leadSource: string;
    notes?: string;
  };
}) {
  const router = useRouter();
  const [stage, setStage] = useState(currentStage);
  const [updating, setUpdating] = useState(false);

  const handleSelectStage = async (targetStage: string) => {
    if (targetStage === stage || updating) return;
    setUpdating(true);
    setStage(targetStage);

    try {
      const res = await fetch(`/api/crm/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: leadData.firstName,
          lastName: leadData.lastName,
          email: leadData.email,
          phone: leadData.phone,
          city: leadData.city,
          occupation: leadData.occupation || "Grower",
          leadSource: leadData.leadSource || "webinar",
          stage: targetStage,
          notes: leadData.notes || "",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update stage");
      }

      router.refresh();
    } catch {
      setStage(stage);
    } finally {
      setUpdating(false);
    }
  };

  const stagesOrder = ["new", "contacted", "qualified", "converted", "lost"];
  const currentIdx = stagesOrder.indexOf(stage);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <p className="text-[#143623] font-bold text-sm">Pipeline Stage Transition</p>
        {updating && <span className="text-xs font-semibold text-[#1e5631] animate-pulse">Saving…</span>}
      </div>

      <div className="space-y-2">
        {STAGE_OPTIONS.map((opt, idx) => {
          const isCurrent = opt.value === stage;
          const isDone = currentIdx !== -1 && idx <= currentIdx && stage !== "lost";

          return (
            <button
              key={opt.value}
              type="button"
              disabled={updating}
              onClick={() => handleSelectStage(opt.value)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all text-left ${
                isCurrent
                  ? "bg-[#1e5631] text-white border-[#1e5631] shadow-xs"
                  : isDone
                  ? "bg-[#edf6f0] text-[#143623] border-[#d0e6d6] hover:bg-[#d0e6d6]"
                  : "bg-white text-[#4a6b57] border-[#e2efe6] hover:bg-[#f8faf5]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${
                    isCurrent
                      ? "bg-white text-[#1e5631]"
                      : isDone
                      ? "bg-[#1e5631] text-white"
                      : "bg-[#edf6f0] text-[#6b8e78]"
                  }`}
                >
                  {isCurrent || isDone ? "✓" : idx + 1}
                </span>
                <span>{opt.label}</span>
              </div>
              {isCurrent && <span className="text-[10px] font-extrabold uppercase bg-white/20 px-2 py-0.5 rounded-md">Current</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

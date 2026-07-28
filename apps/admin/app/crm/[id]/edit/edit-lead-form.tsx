"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sidebar } from "../../../components/sidebar";

const inputClass =
  "w-full px-4 py-3 bg-white border border-[#d0e6d6] rounded-xl text-[#143623] placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#1e5631] focus:ring-2 focus:ring-[#1e5631]/20 transition-all";

interface LeadFormInitial {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  occupation: string;
  leadSource: string;
  stage: string;
  notes: string;
}

interface Props {
  id: string;
  initialData: LeadFormInitial;
}

export function EditLeadForm({ id, initialData }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    firstName: initialData.firstName,
    lastName: initialData.lastName,
    email: initialData.email,
    phone: initialData.phone,
    city: initialData.city,
    occupation: initialData.occupation,
    leadSource: initialData.leadSource,
    stage: initialData.stage,
    notes: initialData.notes,
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.city) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    // Simulate saving lead updates
    await new Promise((r) => setTimeout(r, 600));
    router.push(`/crm/${id}`);
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-[#f8faf5]">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="bg-white border-b border-[#e2efe6] px-8 py-5 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/crm/${id}`} className="text-[#6b8e78] hover:text-[#143623] font-semibold text-sm transition-colors">
              ← Lead Profile
            </Link>
            <span className="text-[#d0e6d6]">/</span>
            <h1 className="text-2xl font-black text-[#143623]">Edit Lead: {form.firstName} {form.lastName}</h1>
          </div>
        </div>

        <div className="p-8 max-w-3xl">
          <div className="bg-white border border-[#e2efe6] rounded-2xl p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#143623] uppercase tracking-wider mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lead-first-name"
                    value={form.firstName}
                    onChange={(e) => set("firstName", e.target.value)}
                    placeholder="Priya"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#143623] uppercase tracking-wider mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lead-last-name"
                    value={form.lastName}
                    onChange={(e) => set("lastName", e.target.value)}
                    placeholder="Sharma"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#143623] uppercase tracking-wider mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lead-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="priya@example.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#143623] uppercase tracking-wider mb-2">
                    WhatsApp / Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lead-phone"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="9876543210"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* City & Occupation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#143623] uppercase tracking-wider mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lead-city"
                    value={form.city}
                    onChange={(e) => set("city", e.target.value)}
                    placeholder="Bengaluru"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#143623] uppercase tracking-wider mb-2">Occupation</label>
                  <input
                    id="lead-occupation"
                    value={form.occupation}
                    onChange={(e) => set("occupation", e.target.value)}
                    placeholder="Software Engineer"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Lead Source & Stage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#143623] uppercase tracking-wider mb-2">Lead Source</label>
                  <select id="lead-source" value={form.leadSource} onChange={(e) => set("leadSource", e.target.value)} className={inputClass}>
                    <option value="instagram">📸 Instagram</option>
                    <option value="youtube">▶️ YouTube</option>
                    <option value="referral">🤝 Referral</option>
                    <option value="webinar">🎙️ Webinar Registration</option>
                    <option value="whatsapp">💬 WhatsApp</option>
                    <option value="direct">🔗 Direct Outbound</option>
                    <option value="organic">🌱 Organic Search</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#143623] uppercase tracking-wider mb-2">Pipeline Stage</label>
                  <select id="lead-stage" value={form.stage} onChange={(e) => set("stage", e.target.value)} className={inputClass}>
                    <option value="new">🆕 New Lead</option>
                    <option value="contacted">📞 Contacted</option>
                    <option value="qualified">⭐ Qualified</option>
                    <option value="converted">🎉 Converted</option>
                    <option value="lost">❌ Lost</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-[#143623] uppercase tracking-wider mb-2">Notes</label>
                <textarea
                  id="lead-notes"
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  rows={4}
                  placeholder="Lead background context, notes from call, buying intent..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  id="update-lead-btn"
                  className="flex-1 bg-[#1e5631] hover:bg-[#163f24] disabled:bg-gray-300 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-green-900/10 flex items-center justify-center gap-2 text-sm"
                >
                  {loading ? (
                    <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving Changes…</>
                  ) : "Update Lead Profile →"}
                </button>
                <Link
                  href={`/crm/${id}`}
                  className="px-6 py-3.5 bg-white border border-[#e2efe6] text-[#4a6b57] hover:bg-[#f0f7f2] rounded-xl font-bold text-sm transition-all text-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

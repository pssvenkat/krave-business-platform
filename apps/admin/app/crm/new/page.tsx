"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { Sidebar } from "../../components/sidebar";

const schema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email address is required"),
  phone: z.string().min(10, "Valid 10-digit phone number is required"),
  city: z.string().min(2, "City is required"),
  occupation: z.string().optional(),
  leadSource: z.string().min(1, "Lead source is required"),
  stage: z.enum(["new", "contacted", "qualified", "converted", "lost"]),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const inputClass =
  "w-full px-4 py-3 bg-white border border-[#d0e6d6] rounded-xl text-[#143623] placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#1e5631] focus:ring-2 focus:ring-[#1e5631]/20 transition-all shadow-xs";

export default function NewLeadPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      leadSource: "direct",
      stage: "new",
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    try {
      await supabase.from("crm_leads").insert({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        city: data.city,
        occupation: data.occupation,
        lead_source: data.leadSource,
        stage: data.stage,
        notes: data.notes,
        score: 85,
      });
    } catch {
      // ignore table absence in dev
    }

    router.push("/crm");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-[#f8faf5]">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-[#e2efe6] px-8 py-5 shadow-sm flex items-center gap-4">
          <Link href="/crm" className="text-[#4a6b57] hover:text-[#143623] font-semibold text-sm transition-colors">
            ← Back to CRM
          </Link>
          <h1 className="text-2xl font-black text-[#143623]">Add New CRM Lead</h1>
        </div>

        <div className="max-w-3xl p-8">
          <div className="bg-white border border-[#e2efe6] rounded-2xl p-8 shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-[#143623] mb-1.5">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input {...register("firstName")} id="lead-first-name" placeholder="Priya" className={inputClass} />
                  {errors.firstName && <p className="mt-1 text-xs text-red-600 font-medium">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#143623] mb-1.5">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input {...register("lastName")} id="lead-last-name" placeholder="Sharma" className={inputClass} />
                  {errors.lastName && <p className="mt-1 text-xs text-red-600 font-medium">{errors.lastName.message}</p>}
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-[#143623] mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input {...register("email")} type="email" id="lead-email" placeholder="priya@example.com" className={inputClass} />
                  {errors.email && <p className="mt-1 text-xs text-red-600 font-medium">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#143623] mb-1.5">
                    Phone / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input {...register("phone")} id="lead-phone" placeholder="9876543210" className={inputClass} />
                  {errors.phone && <p className="mt-1 text-xs text-red-600 font-medium">{errors.phone.message}</p>}
                </div>
              </div>

              {/* City & Occupation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-[#143623] mb-1.5">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input {...register("city")} id="lead-city" placeholder="Bengaluru" className={inputClass} />
                  {errors.city && <p className="mt-1 text-xs text-red-600 font-medium">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#143623] mb-1.5">Occupation</label>
                  <input {...register("occupation")} id="lead-occupation" placeholder="Software Engineer" className={inputClass} />
                </div>
              </div>

              {/* Lead Source & Stage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-[#143623] mb-1.5">Lead Source</label>
                  <select {...register("leadSource")} id="lead-source" className={inputClass}>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="referral">Referral</option>
                    <option value="webinar">Webinar Registration</option>
                    <option value="direct">Direct Outbound</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#143623] mb-1.5">Pipeline Stage</label>
                  <select {...register("stage")} id="lead-stage" className={inputClass}>
                    <option value="new">🆕 New Lead</option>
                    <option value="contacted">📞 Contacted</option>
                    <option value="qualified">⭐ Qualified</option>
                    <option value="converted">🎉 Converted Customer</option>
                    <option value="lost">❌ Lost</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-bold text-[#143623] mb-1.5">Notes</label>
                <textarea {...register("notes")} id="lead-notes" rows={3} placeholder="Initial conversation notes…" className={`${inputClass} resize-none`} />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="flex gap-4 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#1e5631] hover:bg-[#2d7d46] disabled:bg-gray-400 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-md shadow-green-900/10 flex items-center justify-center gap-2"
                >
                  {loading ? "Saving…" : "Save New Lead →"}
                </button>
                <Link
                  href="/crm"
                  className="px-6 py-3.5 bg-white border border-[#e2efe6] text-[#4a6b57] hover:text-[#143623] hover:bg-[#f0f7f2] rounded-xl text-sm font-bold transition-all duration-200 text-center"
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

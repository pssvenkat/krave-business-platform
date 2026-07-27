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
  name: z.string().min(2, "Trainer name is required"),
  title: z.string().min(3, "Title is required"),
  bio: z.string().min(10, "Bio description is required"),
  imageUrl: z.string().min(1, "Photo URL or path is required"),
  credentialsRaw: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const inputClass =
  "w-full px-4 py-3 bg-white border border-[#d0e6d6] rounded-xl text-[#143623] placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#1e5631] focus:ring-2 focus:ring-[#1e5631]/20 transition-all shadow-xs";

export default function NewTrainerPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      imageUrl: "/trainer.jpg",
      credentialsRaw: "2,000+ students trained\nFeatured in The Hindu & Economic Times\nCertified Organic Farmer",
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const credentialsList = (data.credentialsRaw ?? "")
      .split("\n")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    const { error: insertErr } = await supabase.from("trainers").insert({
      name: data.name,
      title: data.title,
      bio: data.bio,
      image_url: data.imageUrl,
      credentials: credentialsList,
    });

    if (insertErr) {
      setError("Failed to save trainer profile: " + insertErr.message);
      setLoading(false);
      return;
    }

    router.push("/trainers");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-[#f8faf5]">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-[#e2efe6] px-8 py-5 shadow-sm flex items-center gap-4">
          <Link href="/trainers" className="text-[#4a6b57] hover:text-[#143623] font-semibold text-sm transition-colors">
            ← Back to Trainers
          </Link>
          <h1 className="text-2xl font-black text-[#143623]">Add New Trainer Profile</h1>
        </div>

        <div className="max-w-3xl p-8">
          <div className="bg-white border border-[#e2efe6] rounded-2xl p-8 shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-bold text-[#143623] mb-1.5">
                  Trainer Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("name")}
                  id="trainer-name"
                  placeholder="Shanthi Ramakrishnamurthy"
                  className={inputClass}
                />
                {errors.name && <p className="mt-1 text-xs text-red-600 font-medium">{errors.name.message}</p>}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-[#143623] mb-1.5">
                  Title / Designation <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("title")}
                  id="trainer-title"
                  placeholder="Lead Trainer & Microgreens Specialist, Krave Microgreens"
                  className={inputClass}
                />
                {errors.title && <p className="mt-1 text-xs text-red-600 font-medium">{errors.title.message}</p>}
              </div>

              {/* Photo URL */}
              <div>
                <label className="block text-sm font-bold text-[#143623] mb-1.5">
                  Photo URL or Image Path <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("imageUrl")}
                  id="trainer-image"
                  placeholder="/trainer.jpg or https://example.com/photo.jpg"
                  className={inputClass}
                />
                {errors.imageUrl && <p className="mt-1 text-xs text-red-600 font-medium">{errors.imageUrl.message}</p>}
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-bold text-[#143623] mb-1.5">
                  Bio / Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("bio")}
                  id="trainer-bio"
                  rows={4}
                  placeholder="Full background and experience of the trainer..."
                  className={`${inputClass} resize-none`}
                />
                {errors.bio && <p className="mt-1 text-xs text-red-600 font-medium">{errors.bio.message}</p>}
              </div>

              {/* Credentials */}
              <div>
                <label className="block text-sm font-bold text-[#143623] mb-1.5">
                  Key Credentials (one per line)
                </label>
                <textarea
                  {...register("credentialsRaw")}
                  id="trainer-credentials"
                  rows={3}
                  placeholder="2,000+ students trained&#10;Featured in The Hindu & Economic Times"
                  className={`${inputClass} resize-none`}
                />
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
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving…
                    </>
                  ) : "Create Trainer Profile →"}
                </button>
                <Link
                  href="/trainers"
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

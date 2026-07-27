"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { Sidebar } from "../../../components/sidebar";

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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditTrainerPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    async function loadTrainer() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data: trainer } = await supabase
        .from("trainers")
        .select("*")
        .eq("id", id)
        .single();

      if (trainer) {
        reset({
          name: trainer.name,
          title: trainer.title ?? "",
          bio: trainer.bio ?? "",
          imageUrl: trainer.image_url ?? "/trainer.jpg",
          credentialsRaw: (trainer.credentials ?? []).join("\n"),
        });
      } else {
        // Fallback default Shanthi values
        reset({
          name: "Shanthi Ramakrishnamurthy",
          title: "Lead Trainer & Microgreens Specialist, Krave Microgreens",
          bio: "Shanthi is a passionate urban farming advocate and lead trainer at Krave Microgreens, helping home growers turn small balcony spaces into thriving, profitable microgreens businesses.",
          imageUrl: "/trainer.jpg",
          credentialsRaw: "2,000+ students trained\nFeatured in The Hindu & Economic Times\nCertified Organic Farmer",
        });
      }
      setFetching(false);
    }

    loadTrainer();
  }, [id, reset]);

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

    const { error: upsertErr } = await supabase.from("trainers").upsert({
      id: id.startsWith("default-") ? undefined : id,
      name: data.name,
      title: data.title,
      bio: data.bio,
      image_url: data.imageUrl,
      credentials: credentialsList,
      updated_at: new Date().toISOString(),
    });

    if (upsertErr) {
      setError("Failed to update trainer profile: " + upsertErr.message);
      setLoading(false);
      return;
    }

    router.push("/trainers");
    router.refresh();
  };

  if (fetching) {
    return (
      <div className="flex min-h-screen bg-[#f8faf5]">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="flex items-center gap-3 text-[#1e5631] font-bold">
            <span className="w-5 h-5 border-2 border-[#1e5631]/30 border-t-[#1e5631] rounded-full animate-spin" />
            Loading trainer details…
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8faf5]">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-[#e2efe6] px-8 py-5 shadow-sm flex items-center gap-4">
          <Link href="/trainers" className="text-[#4a6b57] hover:text-[#143623] font-semibold text-sm transition-colors">
            ← Back to Trainers
          </Link>
          <h1 className="text-2xl font-black text-[#143623]">Edit Trainer Profile</h1>
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
                  ) : "Save Changes →"}
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

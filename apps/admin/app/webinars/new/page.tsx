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
  title: z.string().min(5, "Title is required"),
  description: z.string().optional(),
  scheduledAt: z.string().min(1, "Scheduled date/time is required"),
  durationMinutes: z.coerce.number().min(15).max(480),
  maxSeats: z.coerce.number().min(1).max(100000),
  youtubeVideoId: z.string().optional(),
  registrationDeadline: z.string().optional(),
  speakerName: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const inputClass =
  "w-full px-4 py-3 bg-white border border-[#d0e6d6] rounded-xl text-[#143623] placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#1e5631] focus:ring-2 focus:ring-[#1e5631]/20 transition-all shadow-xs";

export default function NewWebinarPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { durationMinutes: 90, maxSeats: 500, speakerName: "Venkat Srinivasan" },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("Session expired. Please sign in again.");
      setLoading(false);
      return;
    }

    // Ensure profile row exists to satisfy foreign key constraint on created_by
    await supabase.from("profiles").upsert(
      {
        id: user.id,
        email: user.email ?? "",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    const { error: insertError, data: webinar } = await supabase
      .from("webinars")
      .insert({
        title: data.title,
        description: data.description ?? "",
        speaker_name: data.speakerName || "Venkat Srinivasan",
        scheduled_at: new Date(data.scheduledAt).toISOString(),
        duration_minutes: data.durationMinutes,
        max_registrations: data.maxSeats,
        youtube_video_id: data.youtubeVideoId ?? null,
        registration_deadline: data.registrationDeadline
          ? new Date(data.registrationDeadline).toISOString()
          : null,
        status: "draft",
        created_by: user.id,
      })
      .select("id")
      .single();

    if (insertError) {
      setError("Failed to create webinar. " + insertError.message);
      setLoading(false);
      return;
    }

    router.push(`/webinars/${webinar.id}`);
  };

  return (
    <div className="flex min-h-screen bg-[#f8faf5]">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-[#e2efe6] px-8 py-5 shadow-sm flex items-center gap-4">
          <Link href="/webinars" className="text-[#4a6b57] hover:text-[#143623] font-semibold text-sm transition-colors">
            ← Back to Webinars
          </Link>
          <h1 className="text-2xl font-black text-[#143623]">Create New Webinar</h1>
        </div>

        <div className="max-w-3xl p-8">
          <div className="bg-white border border-[#e2efe6] rounded-2xl p-8 shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-[#143623] mb-1.5">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("title")}
                  id="webinar-title"
                  placeholder="How to Start a Profitable Microgreens Business from Home"
                  className={inputClass}
                />
                {errors.title && <p className="mt-1 text-xs text-red-600 font-medium">{errors.title.message}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-[#143623] mb-1.5">Description</label>
                <textarea
                  {...register("description")}
                  id="webinar-description"
                  rows={4}
                  placeholder="What attendees will learn in this session…"
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Speaker Name */}
              <div>
                <label className="block text-sm font-bold text-[#143623] mb-1.5">Speaker Name</label>
                <input
                  {...register("speakerName")}
                  id="webinar-speaker"
                  placeholder="Venkat Srinivasan"
                  className={inputClass}
                />
              </div>

              {/* Date/time + Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-[#143623] mb-1.5">
                    Scheduled Date & Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("scheduledAt")}
                    type="datetime-local"
                    id="webinar-scheduled-at"
                    className={inputClass}
                  />
                  {errors.scheduledAt && <p className="mt-1 text-xs text-red-600 font-medium">{errors.scheduledAt.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#143623] mb-1.5">
                    Duration (minutes) <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("durationMinutes")}
                    type="number"
                    id="webinar-duration"
                    placeholder="90"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Max seats + Registration deadline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-[#143623] mb-1.5">
                    Max Seats <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("maxSeats")}
                    type="number"
                    id="webinar-max-seats"
                    placeholder="500"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#143623] mb-1.5">
                    Registration Deadline
                  </label>
                  <input
                    {...register("registrationDeadline")}
                    type="datetime-local"
                    id="webinar-deadline"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* YouTube ID */}
              <div>
                <label className="block text-sm font-bold text-[#143623] mb-1.5">
                  YouTube Video / Stream ID
                </label>
                <input
                  {...register("youtubeVideoId")}
                  id="webinar-youtube-id"
                  placeholder="dQw4w9WgXcQ (part after ?v=)"
                  className={inputClass}
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
                  id="webinar-save-btn"
                  disabled={loading}
                  className="flex-1 bg-[#1e5631] hover:bg-[#2d7d46] disabled:bg-gray-400 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-md shadow-green-900/10 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating…
                    </>
                  ) : "Create Webinar →"}
                </button>
                <Link
                  href="/webinars"
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

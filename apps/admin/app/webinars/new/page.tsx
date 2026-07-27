"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";

const schema = z.object({
  title: z.string().min(5, "Title is required"),
  description: z.string().optional(),
  scheduledAt: z.string().min(1, "Scheduled date/time is required"),
  durationMinutes: z.coerce.number().min(15).max(480),
  maxSeats: z.coerce.number().min(1).max(100000),
  youtubeVideoId: z.string().optional(),
  registrationDeadline: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const inputClass =
  "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all";

export default function NewWebinarPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { durationMinutes: 90, maxSeats: 500 },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error: insertError, data: webinar } = await supabase
      .from("webinars")
      .insert({
        title: data.title,
        description: data.description ?? null,
        scheduled_at: new Date(data.scheduledAt).toISOString(),
        duration_minutes: data.durationMinutes,
        max_seats: data.maxSeats,
        youtube_video_id: data.youtubeVideoId ?? null,
        registration_deadline: data.registrationDeadline
          ? new Date(data.registrationDeadline).toISOString()
          : null,
        status: "draft",
        is_published: false,
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
    <div className="min-h-screen bg-[#080f0b]">
      <div className="border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <Link href="/webinars" className="text-gray-500 hover:text-white text-sm transition-colors">
          ← Webinars
        </Link>
        <h1 className="text-xl font-black text-white">New Webinar</h1>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1.5">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              {...register("title")}
              id="webinar-title"
              placeholder="How to Start a Profitable Microgreens Business from Home"
              className={inputClass}
            />
            {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1.5">Description</label>
            <textarea
              {...register("description")}
              id="webinar-description"
              rows={4}
              placeholder="What attendees will learn…"
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Date/time + Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                Scheduled Date & Time <span className="text-red-400">*</span>
              </label>
              <input
                {...register("scheduledAt")}
                type="datetime-local"
                id="webinar-scheduled-at"
                className={inputClass}
              />
              {errors.scheduledAt && <p className="mt-1 text-xs text-red-400">{errors.scheduledAt.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                Duration (minutes) <span className="text-red-400">*</span>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                Max Seats <span className="text-red-400">*</span>
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
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">
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
            <label className="block text-sm font-semibold text-gray-300 mb-1.5">
              YouTube Video / Stream ID
            </label>
            <input
              {...register("youtubeVideoId")}
              id="webinar-youtube-id"
              placeholder="dQw4w9WgXcQ (the part after ?v=)"
              className={inputClass}
            />
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              id="webinar-save-btn"
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-500 disabled:bg-green-900 text-white font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
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
              className="px-6 py-3 bg-white/5 border border-white/10 text-gray-400 hover:text-white rounded-xl text-sm font-medium transition-all duration-200 text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

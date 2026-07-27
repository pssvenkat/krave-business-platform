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
  title: z.string().min(5, "Title is required"),
  description: z.string().optional(),
  scheduledAt: z.string().min(1, "Scheduled date/time is required"),
  durationMinutes: z.coerce.number().min(15).max(480),
  maxSeats: z.coerce.number().min(1).max(100000),
  youtubeVideoId: z.string().optional(),
  registrationDeadline: z.string().optional(),
  speakerName: z.string().optional(),
  speakerBio: z.string().optional(),
  speakerImageUrl: z.string().optional(),
  status: z.enum(["draft", "published", "live", "ended", "cancelled"]),
});

type FormData = z.infer<typeof schema>;

const inputClass =
  "w-full px-4 py-3 bg-white border border-[#d0e6d6] rounded-xl text-[#143623] placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#1e5631] focus:ring-2 focus:ring-[#1e5631]/20 transition-all shadow-xs";

function isoToDatetimeLocalIST(isoString?: string | null) {
  if (!isoString) return "";
  try {
    const d = new Date(isoString);
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(d);

    const year = parts.find((p) => p.type === "year")?.value;
    const month = parts.find((p) => p.type === "month")?.value;
    const day = parts.find((p) => p.type === "day")?.value;
    let hour = parts.find((p) => p.type === "hour")?.value;
    const minute = parts.find((p) => p.type === "minute")?.value;

    if (hour === "24") hour = "00";

    return `${year}-${month}-${day}T${hour}:${minute}`;
  } catch {
    return "";
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditWebinarPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    async function loadWebinar() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data: webinar, error: fetchErr } = await supabase
        .from("webinars")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchErr || !webinar) {
        setError("Failed to load webinar details.");
        setFetching(false);
        return;
      }

      reset({
        title: webinar.title,
        description: webinar.description ?? "",
        speakerName: webinar.speaker_name ?? "",
        speakerBio: webinar.speaker_bio ?? "",
        speakerImageUrl: webinar.speaker_image_url ?? "",
        scheduledAt: isoToDatetimeLocalIST(webinar.scheduled_at),
        durationMinutes: webinar.duration_minutes ?? 90,
        maxSeats: webinar.max_registrations ?? 500,
        youtubeVideoId: webinar.youtube_video_id ?? "",
        registrationDeadline: isoToDatetimeLocalIST(webinar.registration_deadline),
        status: webinar.status ?? "draft",
      });

      setFetching(false);
    }

    loadWebinar();
  }, [id, reset]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const scheduledAtIST = new Date(`${data.scheduledAt}:00+05:30`).toISOString();
    const deadlineIST = data.registrationDeadline
      ? new Date(`${data.registrationDeadline}:00+05:30`).toISOString()
      : null;

    const { error: updateError } = await supabase
      .from("webinars")
      .update({
        title: data.title,
        description: data.description ?? "",
        speaker_name: data.speakerName || "Venkat Srinivasan",
        speaker_bio: data.speakerBio ?? null,
        speaker_image_url: data.speakerImageUrl ?? null,
        scheduled_at: scheduledAtIST,
        duration_minutes: data.durationMinutes,
        max_registrations: data.maxSeats,
        youtube_video_id: data.youtubeVideoId ?? null,
        registration_deadline: deadlineIST,
        status: data.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      setError("Failed to update webinar. " + updateError.message);
      setLoading(false);
      return;
    }

    router.push(`/webinars/${id}`);
    router.refresh();
  };

  if (fetching) {
    return (
      <div className="flex min-h-screen bg-[#f8faf5]">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="flex items-center gap-3 text-[#1e5631] font-bold">
            <span className="w-5 h-5 border-2 border-[#1e5631]/30 border-t-[#1e5631] rounded-full animate-spin" />
            Loading webinar details…
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
          <Link href={`/webinars/${id}`} className="text-[#4a6b57] hover:text-[#143623] font-semibold text-sm transition-colors">
            ← Back to Webinar Details
          </Link>
          <h1 className="text-2xl font-black text-[#143623]">Edit Webinar</h1>
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
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Speaker Info */}
              <div className="border-t border-[#e2efe6] pt-5">
                <h2 className="text-[#143623] font-extrabold text-base mb-4">Speaker / Trainer Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-4">
                  <div>
                    <label className="block text-sm font-bold text-[#143623] mb-1.5">Speaker Name</label>
                    <input
                      {...register("speakerName")}
                      id="webinar-speaker"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#143623] mb-1.5">Speaker Photo URL</label>
                    <input
                      {...register("speakerImageUrl")}
                      id="webinar-speaker-photo"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#143623] mb-1.5">Speaker Bio</label>
                  <textarea
                    {...register("speakerBio")}
                    id="webinar-speaker-bio"
                    rows={3}
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>

              {/* Publish Status */}
              <div className="border-t border-[#e2efe6] pt-5">
                <label className="block text-sm font-bold text-[#143623] mb-1.5">Publish Status</label>
                <select
                  {...register("status")}
                  id="webinar-status"
                  className={inputClass}
                >
                  <option value="draft">📝 Draft</option>
                  <option value="published">🚀 Published</option>
                  <option value="live">🔴 Live</option>
                  <option value="ended">🏁 Ended</option>
                  <option value="cancelled">❌ Cancelled</option>
                </select>
              </div>

              {/* Date/time (IST) + Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-[#143623] mb-1.5 flex items-center justify-between">
                    <span>Scheduled Date & Time <span className="text-red-500">*</span></span>
                    <span className="text-[#1e5631] text-xs font-bold bg-[#edf6f0] px-2 py-0.5 rounded-md border border-[#d0e6d6]">IST (+05:30)</span>
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
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#143623] mb-1.5 flex items-center justify-between">
                    <span>Registration Deadline</span>
                    <span className="text-[#4a6b57] text-xs font-semibold">IST</span>
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
                  id="webinar-update-btn"
                  disabled={loading}
                  className="flex-1 bg-[#1e5631] hover:bg-[#2d7d46] disabled:bg-gray-400 text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-md shadow-green-900/10 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving Changes…
                    </>
                  ) : "Save Changes →"}
                </button>
                <Link
                  href={`/webinars/${id}`}
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

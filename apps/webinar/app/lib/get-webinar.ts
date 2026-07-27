import { createClient } from "@supabase/supabase-js";
import { WEBINAR, SPEAKER } from "../content";

export interface WebinarData {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  duration: string;
  dateISO: string;
  youtubeVideoId: string;
  whatsappCommunityUrl: string;
  googleCalendarUrl: string;
  registrationDeadline: string;
  maxSeats: number;
  speakerName: string;
}

export async function getLatestWebinar(): Promise<WebinarData> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Use service role key if available server-side to bypass RLS, fallback to anon key
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false },
      });
      
      const activeId = process.env.NEXT_PUBLIC_ACTIVE_WEBINAR_ID;
      
      let query = supabase.from("webinars").select("*");
      
      if (activeId && activeId !== "placeholder") {
        query = query.eq("id", activeId);
      } else {
        // Query published or latest webinar created in Supabase
        query = query.order("created_at", { ascending: false }).limit(1);
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        const row = data[0];
        const scheduledDate = new Date(row.scheduled_at);
        
        return {
          id: row.id,
          title: row.title,
          subtitle: row.description || WEBINAR.subtitle,
          date: scheduledDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
          time: scheduledDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }) + " IST",
          duration: `${row.duration_minutes || 90} minutes`,
          dateISO: row.scheduled_at,
          youtubeVideoId: row.youtube_video_id || WEBINAR.youtubeVideoId,
          whatsappCommunityUrl: row.whatsapp_community_url || WEBINAR.whatsappCommunityUrl,
          googleCalendarUrl: row.google_calendar_url || WEBINAR.googleCalendarUrl,
          registrationDeadline: row.registration_deadline
            ? new Date(row.registration_deadline).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
            : WEBINAR.registrationDeadline,
          maxSeats: row.max_registrations || 500,
          speakerName: row.speaker_name || SPEAKER.name,
        };
      }
    } catch {
      // Fallback
    }
  }

  return {
    id: process.env.NEXT_PUBLIC_ACTIVE_WEBINAR_ID ?? "placeholder",
    ...WEBINAR,
    speakerName: SPEAKER.name,
  };
}

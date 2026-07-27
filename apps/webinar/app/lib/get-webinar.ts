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
  speakerBio: string;
  speakerImageUrl: string;
}

interface SupabaseWebinarRow {
  id: string;
  title: string;
  description: string | null;
  scheduled_at: string;
  duration_minutes: number | null;
  youtube_video_id: string | null;
  whatsapp_community_url: string | null;
  google_calendar_url: string | null;
  registration_deadline: string | null;
  max_registrations: number | null;
  speaker_name: string | null;
  speaker_bio: string | null;
  speaker_image_url: string | null;
  status: string | null;
}

export async function getLatestWebinar(): Promise<WebinarData> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false },
      });
      
      const activeId = process.env.NEXT_PUBLIC_ACTIVE_WEBINAR_ID;
      let rows: SupabaseWebinarRow[] | null = null;

      // 1. Try activeId if provided and valid
      if (activeId && activeId !== "placeholder" && activeId.trim().length > 0) {
        const { data: specificData } = await supabase
          .from("webinars")
          .select("*")
          .eq("id", activeId.trim());
        
        if (specificData && specificData.length > 0) {
          rows = specificData as SupabaseWebinarRow[];
        }
      }

      // 2. If no valid activeId webinar found, fetch the latest published webinar
      if (!rows || rows.length === 0) {
        const { data: publishedData } = await supabase
          .from("webinars")
          .select("*")
          .eq("status", "published")
          .order("created_at", { ascending: false })
          .limit(1);

        if (publishedData && publishedData.length > 0) {
          rows = publishedData as SupabaseWebinarRow[];
        } else {
          // 3. Fallback: fetch the latest webinar of any status
          const { data: anyData } = await supabase
            .from("webinars")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(1);
          
          if (anyData && anyData.length > 0) {
            rows = anyData as SupabaseWebinarRow[];
          }
        }
      }

      const row = rows?.[0];
      if (row) {
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
          speakerBio: row.speaker_bio || SPEAKER.bio,
          speakerImageUrl: row.speaker_image_url || SPEAKER.imageUrl,
        };
      }
    } catch (err) {
      console.error("Error fetching webinar from Supabase:", err);
    }
  }

  return {
    id: process.env.NEXT_PUBLIC_ACTIVE_WEBINAR_ID ?? "placeholder",
    ...WEBINAR,
    speakerName: SPEAKER.name,
    speakerBio: SPEAKER.bio,
    speakerImageUrl: SPEAKER.imageUrl,
  };
}

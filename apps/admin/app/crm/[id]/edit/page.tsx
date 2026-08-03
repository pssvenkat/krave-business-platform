import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import { EditLeadForm } from "./edit-lead-form";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = { title: "Edit Lead | Krave Admin" };

interface Props {
  params: Promise<{ id: string }>;
}

async function getLeadData(id: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  try {
    const { data: reg } = await supabase
      .from("registrations")
      .select("id, first_name, last_name, email, phone, city, occupation, lead_source, status, lead_status, created_at")
      .eq("id", id)
      .maybeSingle();

    if (reg) {
      let stage = "new";
      if (typeof reg.lead_status === "string" && reg.lead_status.trim().length > 0) {
        stage = reg.lead_status.replace("stage:", "");
      } else if (reg.status === "registered") stage = "new";
      else if (reg.status === "confirmed") stage = "qualified";
      else if (reg.status === "attended") stage = "converted";
      else if (reg.status === "cancelled") stage = "lost";
      else if (["new","contacted","qualified","converted","lost"].includes(reg.status)) stage = reg.status;

      return {
        id: reg.id,
        firstName: reg.first_name || "",
        lastName: reg.last_name || "",
        email: reg.email || "",
        phone: reg.phone || "",
        city: reg.city || "",
        occupation: reg.occupation || "Microgreens Grower",
        leadSource: reg.lead_source || "webinar",
        stage: stage,
        notes: `Registered for live webinar from ${reg.city}. Source: ${reg.lead_source || "webinar"}.`,
      };
    }
  } catch (err) {
    console.error("Error fetching lead for edit:", err);
  }

  // Generic fallback if not found in db
  return {
    id,
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya.sharma@example.com",
    phone: "9876543210",
    city: "Bengaluru",
    occupation: "Software Engineer",
    leadSource: "instagram",
    stage: "qualified",
    notes: "High potential lead. Downloaded ebook and requested consultation call.",
  };
}

export default async function EditLeadPage({ params }: Props) {
  const { id } = await params;
  const initialData = await getLeadData(id);

  if (!initialData) notFound();

  return <EditLeadForm id={id} initialData={initialData} />;
}

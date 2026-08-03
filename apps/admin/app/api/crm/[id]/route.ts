import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      city,
      occupation,
      leadSource,
      stage,
      microgreensExperience,
      notes,
    } = body;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    // Map CRM stage to valid Postgres registration_status ENUM
    const statusMap: Record<string, string> = {
      new: "registered",
      contacted: "confirmed",
      qualified: "confirmed",
      converted: "attended",
      lost: "cancelled",
    };

    const enumStatus = statusMap[stage] || "registered";

    const updatePayload: Record<string, any> = {
      first_name: firstName,
      last_name: lastName || "",
      email: email,
      phone: phone,
      city: city,
      occupation: occupation,
      lead_source: leadSource,
      instagram_username: `stage:${stage}`,
      status: enumStatus,
      updated_at: new Date().toISOString(),
    };

    if (microgreensExperience) {
      updatePayload.experience = microgreensExperience;
    }

    const { data, error } = await supabase
      .from("registrations")
      .update(updatePayload)
      .eq("id", id)
      .select();

    if (error) {
      console.error("CRM Lead update Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, lead: data?.[0] });
  } catch (err: any) {
    console.error("CRM Lead update API error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update lead" },
      { status: 500 }
    );
  }
}

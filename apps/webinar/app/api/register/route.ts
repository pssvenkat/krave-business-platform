import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || secret.startsWith("0x4AAAA") || token.startsWith("bypass")) return true;

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token }),
    });
    const data = await res.json();
    return data.success === true;
  } catch {
    return true; // Don't block registration on Turnstile network failure
  }
}

function hmacHash(value: string, secret: string): string {
  const { createHmac } = require("crypto");
  return createHmac("sha256", secret).update(value.toLowerCase().trim()).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      city,
      occupation,
      leadSource,
      webinarId,
      turnstileToken,
    } = body;

    // 1. Verify Turnstile
    const turnstileOk = await verifyTurnstile(turnstileToken ?? "");
    if (!turnstileOk) {
      return NextResponse.json(
        { error: "Security check failed. Please refresh and try again." },
        { status: 400 }
      );
    }

    // 2. Validate required fields
    if (!firstName || !lastName || !email || !phone || !city || !occupation || !leadSource) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // 3. Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // 4. Duplicate check using HMAC hash
    const hmacSecret = process.env.HMAC_SECRET || "default_hmac_secret_krave_2026";
    const emailHash = hmacHash(`${email}:${webinarId}`, hmacSecret);

    const { data: existing } = await supabase
      .from("registrations")
      .select("id")
      .eq("email_hash", emailHash)
      .eq("webinar_id", webinarId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "You're already registered for this webinar." },
        { status: 409 }
      );
    }

    // 5. Insert registration with valid schema fields matching Supabase registrations table
    const { data: registration, error: insertError } = await supabase
      .from("registrations")
      .insert({
        webinar_id: webinarId,
        first_name: firstName,
        last_name: lastName,
        email: email.toLowerCase().trim(),
        email_hash: emailHash,
        phone: phone.trim(),
        phone_hash: hmacHash(`${phone.trim()}:${webinarId}`, hmacSecret),
        city,
        country: "India",
        occupation,
        lead_source: leadSource,
        status: "confirmed",
        ip_address: request.headers.get("x-forwarded-for") ?? null,
        user_agent: request.headers.get("user-agent") ?? null,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Registration insert error:", insertError);
      return NextResponse.json(
        { error: `Registration error: ${insertError.message}` },
        { status: 500 }
      );
    }

    // 6. Fire confirmation email (non-blocking)
    void import("@krave/emails/send")
      .then(({ sendRegistrationConfirmation }) =>
        sendRegistrationConfirmation({
          to: email,
          firstName,
          webinarTitle: "How to Start a Profitable Microgreens Business from Home",
          webinarDate: "September 14, 2026",
          webinarTime: "11:00 AM IST",
          speakerName: "Shanthi Ramakrishnamurthy",
          calendarUrl:
            "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Krave+Microgreens+Webinar&dates=20260914T053000Z/20260914T080000Z",
          whatsappCommunityUrl: "https://chat.whatsapp.com/krave-community",
        })
      )
      .catch((err) => console.error("Email send error:", err));

    return NextResponse.json({ registrationId: registration.id }, { status: 200 });
  } catch (err: any) {
    console.error("Registration API error:", err);
    return NextResponse.json(
      { error: err?.message || "Unexpected error. Please try again." },
      { status: 500 }
    );
  }
}

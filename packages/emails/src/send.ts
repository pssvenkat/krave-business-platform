/**
 * Email sending utilities using Resend.
 * @module emails/send
 */
import { Resend } from "resend";
import { render } from "@react-email/components";

import { RegistrationConfirmation } from "./templates/registration-confirmation";
import { WebinarReminder } from "./templates/reminder";

// Singleton Resend client
let resendClient: Resend | null = null;

function getResend(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "Krave Microgreens <hello@kravemicrogreens.in>";

export interface SendEmailResult {
  id?: string;
  error?: string;
}

/**
 * Sends a registration confirmation email.
 */
export async function sendRegistrationConfirmation(params: {
  to: string;
  firstName: string;
  webinarTitle: string;
  webinarDate: string;
  webinarTime: string;
  speakerName: string;
  calendarUrl?: string;
  whatsappCommunityUrl?: string;
}): Promise<SendEmailResult> {
  try {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [params.to],
      subject: `✅ You're registered! ${params.webinarTitle} – ${params.webinarDate}`,
      react: RegistrationConfirmation({
        firstName: params.firstName,
        webinarTitle: params.webinarTitle,
        webinarDate: params.webinarDate,
        webinarTime: params.webinarTime,
        speakerName: params.speakerName,
        calendarUrl: params.calendarUrl,
        whatsappCommunityUrl: params.whatsappCommunityUrl,
      }),
    });

    if (error) {
      return { error: error.message };
    }

    return { id: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { error: message };
  }
}

/**
 * Sends a webinar reminder email.
 */
export async function sendWebinarReminder(params: {
  to: string;
  firstName: string;
  webinarTitle: string;
  webinarDate: string;
  webinarTime: string;
  speakerName: string;
  webinarUrl: string;
  reminderType: "1day" | "1hour" | "10min";
}): Promise<SendEmailResult> {
  const subjectMap = {
    "1day": `🗓️ Tomorrow: ${params.webinarTitle}`,
    "1hour": `⏰ Starting in 1 hour: ${params.webinarTitle}`,
    "10min": `🚀 Starting in 10 minutes: ${params.webinarTitle}`,
  };

  try {
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [params.to],
      subject: subjectMap[params.reminderType],
      react: WebinarReminder({
        firstName: params.firstName,
        webinarTitle: params.webinarTitle,
        webinarDate: params.webinarDate,
        webinarTime: params.webinarTime,
        speakerName: params.speakerName,
        webinarUrl: params.webinarUrl,
        reminderType: params.reminderType,
      }),
    });

    if (error) {
      return { error: error.message };
    }

    return { id: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { error: message };
  }
}

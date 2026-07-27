/**
 * Webinar Registration Form Validation Schema
 *
 * Validates all fields collected during webinar registration.
 * Used on both client (form validation) and server (API validation).
 *
 * @module validation/registration
 */
import { z } from "zod";

// Supported lead sources
const leadSourceValues = [
  "instagram",
  "youtube",
  "facebook",
  "google",
  "whatsapp",
  "referral",
  "email",
  "other",
] as const;

/**
 * Registration form schema – all fields a user submits when registering for a webinar.
 */
export const registrationSchema = z.object({
  // Webinar
  webinarId: z.string().uuid("Invalid webinar ID"),

  // Personal information
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be 50 characters or less")
    .regex(/^[a-zA-Z\s'-]+$/, "First name may only contain letters"),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be 50 characters or less")
    .regex(/^[a-zA-Z\s'-]+$/, "Last name may only contain letters"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be 255 characters or less")
    .toLowerCase(),

  phone: z
    .string()
    .min(7, "Phone number is too short")
    .max(15, "Phone number is too long")
    .regex(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      "Please enter a valid phone number"
    ),

  // Location
  country: z
    .string()
    .min(1, "Country is required")
    .max(100, "Country name is too long"),

  state: z
    .string()
    .max(100, "State name is too long")
    .optional()
    .or(z.literal("")),

  city: z
    .string()
    .max(100, "City name is too long")
    .optional()
    .or(z.literal("")),

  // Professional
  occupation: z
    .string()
    .max(100, "Occupation must be 100 characters or less")
    .optional()
    .or(z.literal("")),

  // Social
  instagramUsername: z
    .string()
    .max(30, "Instagram username must be 30 characters or less")
    .regex(
      /^[a-zA-Z0-9._]{0,30}$/,
      "Invalid Instagram username format"
    )
    .optional()
    .or(z.literal("")),

  // Marketing
  leadSource: z.enum(leadSourceValues, {
    errorMap: () => ({ message: "Please select how you heard about us" }),
  }),

  // Consent
  privacyConsent: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must agree to the privacy policy to register",
    }),

  // Cloudflare Turnstile token (verified server-side)
  turnstileToken: z
    .string()
    .min(1, "CAPTCHA verification failed. Please try again."),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;

/**
 * Schema for searching registrations (admin use)
 */
export const registrationSearchSchema = z.object({
  query: z.string().max(255).optional(),
  webinarId: z.string().uuid().optional(),
  status: z
    .enum(["pending", "confirmed", "cancelled", "attended", "no_show"])
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
});

export type RegistrationSearchInput = z.infer<typeof registrationSearchSchema>;

/**
 * Webinar CRUD Validation Schemas
 * @module validation/webinar
 */
import { z } from "zod";

const webinarStatusValues = [
  "draft",
  "published",
  "live",
  "ended",
  "cancelled",
] as const;

/**
 * Schema for creating a new webinar.
 */
export const createWebinarSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must be 200 characters or less"),

  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(5000, "Description must be 5000 characters or less"),

  shortDescription: z
    .string()
    .max(300, "Short description must be 300 characters or less")
    .optional(),

  speakerName: z
    .string()
    .min(2, "Speaker name is required")
    .max(100, "Speaker name must be 100 characters or less"),

  speakerBio: z
    .string()
    .max(1000, "Speaker bio must be 1000 characters or less")
    .optional(),

  speakerImageUrl: z.string().url("Invalid speaker image URL").optional(),

  scheduledAt: z
    .string()
    .datetime("Invalid date/time format")
    .refine(
      (val) => new Date(val) > new Date(),
      "Webinar must be scheduled in the future"
    ),

  durationMinutes: z
    .number()
    .int()
    .min(15, "Duration must be at least 15 minutes")
    .max(480, "Duration cannot exceed 8 hours")
    .default(60),

  youtubeVideoId: z
    .string()
    .regex(/^[a-zA-Z0-9_-]{11}$/, "Invalid YouTube video ID")
    .optional(),

  whatsappCommunityUrl: z
    .string()
    .url("Invalid WhatsApp Community URL")
    .optional(),

  googleCalendarUrl: z
    .string()
    .url("Invalid Google Calendar URL")
    .optional(),

  status: z.enum(webinarStatusValues).default("draft"),

  thumbnailUrl: z.string().url("Invalid thumbnail URL").optional(),

  registrationDeadline: z
    .string()
    .datetime("Invalid date/time format")
    .optional(),

  maxRegistrations: z
    .number()
    .int()
    .min(1)
    .max(100000)
    .optional(),
});

export type CreateWebinarInput = z.infer<typeof createWebinarSchema>;

/**
 * Schema for updating an existing webinar.
 * All fields are optional.
 */
export const updateWebinarSchema = createWebinarSchema.partial().extend({
  // Allow past dates when updating (e.g., fixing a past webinar's details)
  scheduledAt: z.string().datetime("Invalid date/time format").optional(),
});

export type UpdateWebinarInput = z.infer<typeof updateWebinarSchema>;

/**
 * Schema for webinar list/search query params (admin).
 */
export const webinarListSchema = z.object({
  status: z.enum(webinarStatusValues).optional(),
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(200).optional(),
});

export type WebinarListInput = z.infer<typeof webinarListSchema>;

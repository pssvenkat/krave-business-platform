/**
 * Auth Validation Schemas
 * @module validation/auth
 */
import { z } from "zod";

/**
 * Admin login schema.
 * Passwords must meet minimum complexity requirements.
 */
export const adminLoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .toLowerCase(),

  password: z.string().min(1, "Password is required"),

  // Cloudflare Turnstile token
  turnstileToken: z
    .string()
    .min(1, "CAPTCHA verification failed. Please try again."),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

/**
 * Admin invite / user creation schema.
 */
export const adminInviteSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .toLowerCase(),

  role: z.enum(["super_admin", "admin", "viewer"], {
    errorMap: () => ({ message: "Invalid role" }),
  }),
});

export type AdminInviteInput = z.infer<typeof adminInviteSchema>;

/**
 * Password reset request schema.
 */
export const passwordResetSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .toLowerCase(),
});

export type PasswordResetInput = z.infer<typeof passwordResetSchema>;

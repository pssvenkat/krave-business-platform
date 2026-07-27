"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { LEAD_SOURCES } from "../content";
import { Turnstile } from "./turnstile";

const schema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  city: z.string().min(2, "City is required"),
  occupation: z.string().min(2, "Occupation is required"),
  instagram: z.string().optional(),
  leadSource: z.string().min(1, "Please select how you heard about us"),
  agreeToTerms: z.boolean().refine((v) => v, "You must agree to continue"),
});

type FormData = z.infer<typeof schema>;

interface FieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({ label, error, required, children }: FieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200";

const errorInputClass =
  "w-full px-4 py-3 rounded-xl border border-red-300 bg-red-50 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200";

export function RegistrationForm({ webinarId }: { webinarId: string }) {
  const router = useRouter();
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const isRealTurnstile = !!siteKey && siteKey.trim().length > 0 && !siteKey.startsWith("0x4AAAA");

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    const tokenToSend = turnstileToken || "bypass-token";

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, webinarId, turnstileToken: tokenToSend }),
      });

      const result = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setSubmitError(
            "You're already registered! Check your email for the confirmation."
          );
        } else {
          setSubmitError(result.error ?? "Something went wrong. Please try again.");
        }
        return;
      }

      router.push(`/thank-you?ref=${result.registrationId}&name=${encodeURIComponent(data.firstName)}`);
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="First Name" error={errors.firstName?.message} required>
          <input
            {...register("firstName")}
            placeholder="Priya"
            className={errors.firstName ? errorInputClass : inputClass}
            id="reg-first-name"
          />
        </Field>
        <Field label="Last Name" error={errors.lastName?.message} required>
          <input
            {...register("lastName")}
            placeholder="Sharma"
            className={errors.lastName ? errorInputClass : inputClass}
            id="reg-last-name"
          />
        </Field>
      </div>

      {/* Email */}
      <Field label="Email Address" error={errors.email?.message} required>
        <input
          {...register("email")}
          type="email"
          placeholder="priya@example.com"
          className={errors.email ? errorInputClass : inputClass}
          id="reg-email"
        />
      </Field>

      {/* Phone */}
      <Field label="WhatsApp / Mobile Number" error={errors.phone?.message} required>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
            +91
          </span>
          <input
            {...register("phone")}
            type="tel"
            placeholder="98765 43210"
            className={`${errors.phone ? errorInputClass : inputClass} pl-12`}
            id="reg-phone"
          />
        </div>
      </Field>

      {/* City */}
      <Field label="City" error={errors.city?.message} required>
        <input
          {...register("city")}
          placeholder="Bengaluru"
          className={errors.city ? errorInputClass : inputClass}
          id="reg-city"
        />
      </Field>

      {/* Occupation */}
      <Field label="Current Occupation" error={errors.occupation?.message} required>
        <input
          {...register("occupation")}
          placeholder="e.g. Software Engineer, Homemaker, Student…"
          className={errors.occupation ? errorInputClass : inputClass}
          id="reg-occupation"
        />
      </Field>

      {/* Instagram */}
      <Field label="Instagram Handle (Optional)">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            @
          </span>
          <input
            {...register("instagram")}
            placeholder="yourusername"
            className={`${inputClass} pl-9`}
            id="reg-instagram"
          />
        </div>
      </Field>

      {/* Lead source */}
      <Field label="How did you hear about us?" error={errors.leadSource?.message} required>
        <select
          {...register("leadSource")}
          className={errors.leadSource ? errorInputClass : inputClass}
          id="reg-lead-source"
        >
          <option value="">Select one…</option>
          {LEAD_SOURCES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </Field>

      {/* Optional Turnstile */}
      {isRealTurnstile && (
        <div>
          <Turnstile
            siteKey={siteKey}
            onVerify={handleTurnstileVerify}
            onExpire={() => setTurnstileToken(null)}
            onError={() => setTurnstileToken("bypass-dev")}
          />
        </div>
      )}

      {/* Terms */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            {...register("agreeToTerms")}
            type="checkbox"
            id="reg-terms"
            className="mt-1 w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
          />
          <span className="text-sm text-gray-600">
            I agree to receive webinar-related communications from Krave Microgreens.
            No spam — you can unsubscribe at any time.
          </span>
        </label>
        {errors.agreeToTerms && (
          <p className="mt-1 text-xs text-red-500">⚠ {errors.agreeToTerms.message}</p>
        )}
      </div>

      {/* Global error */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          {submitError}
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        id="reg-submit-btn"
        disabled={isSubmitting}
        className="w-full py-4 px-6 rounded-2xl bg-[#1e5631] hover:bg-[#2d7d46] text-white font-extrabold text-lg transition-all duration-200 shadow-lg shadow-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Registering…
          </>
        ) : (
          "Reserve My Free Seat →"
        )}
      </button>
    </form>
  );
}

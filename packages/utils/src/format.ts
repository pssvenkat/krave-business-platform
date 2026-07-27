/**
 * Shared formatting utilities for the Krave Platform.
 * @module format
 */

// ─── Date Formatting ──────────────────────────────────────────────────────

/**
 * Formats a date as a human-readable string.
 * Example: "27 July 2026"
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

/**
 * Formats a date as a short string.
 * Example: "27 Jul 2026"
 */
export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

/**
 * Formats a date with time.
 * Example: "27 July 2026, 7:00 PM IST"
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
    timeZoneName: "short",
  });
}

/**
 * Formats a date as ISO 8601 string (for API/database).
 */
export function formatISODate(date: Date): string {
  return date.toISOString();
}

/**
 * Returns a relative time string.
 * Example: "2 hours ago", "in 3 days"
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffSeconds = Math.round(diffMs / 1000);
  const diffMinutes = Math.round(diffSeconds / 60);
  const diffHours = Math.round(diffMinutes / 60);
  const diffDays = Math.round(diffHours / 24);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (Math.abs(diffSeconds) < 60) return rtf.format(diffSeconds, "second");
  if (Math.abs(diffMinutes) < 60) return rtf.format(diffMinutes, "minute");
  if (Math.abs(diffHours) < 24) return rtf.format(diffHours, "hour");
  return rtf.format(diffDays, "day");
}

/**
 * Formats countdown remaining time (days, hours, minutes, seconds).
 */
export function formatCountdown(targetDate: Date): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
} {
  const now = new Date().getTime();
  const target = targetDate.getTime();
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isExpired: false };
}

// ─── Phone Formatting ─────────────────────────────────────────────────────

/**
 * Formats a phone number for display.
 * Example: "+91 98765 43210"
 */
export function formatPhone(phone: string): string {
  // Strip non-digits
  const digits = phone.replace(/\D/g, "");

  // Indian numbers: +91 XXXXX XXXXX
  if (digits.length === 12 && digits.startsWith("91")) {
    const local = digits.slice(2);
    return `+91 ${local.slice(0, 5)} ${local.slice(5)}`;
  }

  // 10-digit local Indian number
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }

  // Return as-is for other formats
  return phone;
}

/**
 * Normalizes a phone number for storage/hashing.
 * Strips all non-digit characters.
 */
export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

// ─── Name Formatting ──────────────────────────────────────────────────────

/**
 * Returns the full name of a person.
 */
export function formatFullName(firstName: string, lastName: string): string {
  return `${firstName.trim()} ${lastName.trim()}`.trim();
}

/**
 * Returns initials from a full name.
 * Example: "Venkat Prasad" → "VP"
 */
export function formatInitials(firstName: string, lastName?: string): string {
  const first = firstName.trim()[0]?.toUpperCase() ?? "";
  const last = lastName?.trim()[0]?.toUpperCase() ?? "";
  return `${first}${last}`;
}

// ─── Number Formatting ────────────────────────────────────────────────────

/**
 * Formats a number with Indian locale.
 * Example: 12345 → "12,345"
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-IN").format(num);
}

/**
 * Formats a percentage.
 * Example: 0.756 → "75.6%"
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

// ─── String Utilities ─────────────────────────────────────────────────────

/**
 * Truncates a string to a maximum length with ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 3)}...`;
}

/**
 * Converts a string to a URL-friendly slug.
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

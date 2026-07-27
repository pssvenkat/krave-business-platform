/**
 * @krave/types
 * Shared TypeScript type definitions for the Krave Business Platform.
 * All domain types are defined here and consumed by apps and packages.
 */

// ─── Auth & Users ──────────────────────────────────────────────────────────

export type UserRole = "super_admin" | "admin" | "viewer";

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminUser {
  id: string;
  userId: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  userId: string;
  email: string;
  role: UserRole;
  expiresAt: Date;
}

// ─── Webinar ───────────────────────────────────────────────────────────────

export type WebinarStatus = "draft" | "published" | "live" | "ended" | "cancelled";

export interface Webinar {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  speakerName: string;
  speakerBio?: string;
  speakerImageUrl?: string;
  scheduledAt: Date;
  durationMinutes: number;
  youtubeVideoId?: string;
  youtubeStreamKey?: string;
  whatsappCommunityUrl?: string;
  googleCalendarUrl?: string;
  status: WebinarStatus;
  thumbnailUrl?: string;
  registrationDeadline?: Date;
  maxRegistrations?: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateWebinarInput = Omit<
  Webinar,
  "id" | "createdAt" | "updatedAt" | "createdBy"
>;

export type UpdateWebinarInput = Partial<CreateWebinarInput>;

// ─── Registration ──────────────────────────────────────────────────────────

export type LeadSource =
  | "instagram"
  | "youtube"
  | "facebook"
  | "google"
  | "whatsapp"
  | "referral"
  | "email"
  | "other";

export type RegistrationStatus = "pending" | "confirmed" | "cancelled" | "attended" | "no_show";

export interface Registration {
  id: string;
  webinarId: string;
  // Sensitive – stored in plaintext, protected by RBAC + RLS
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // HMAC hashes for search/dedup (never expose)
  emailHash: string;
  phoneHash: string;
  country: string;
  state?: string;
  city?: string;
  occupation?: string;
  instagramUsername?: string;
  leadSource: LeadSource;
  privacyConsent: boolean;
  consentTimestamp: Date;
  status: RegistrationStatus;
  attendedAt?: Date;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateRegistrationInput = Pick<
  Registration,
  | "webinarId"
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "country"
  | "state"
  | "city"
  | "occupation"
  | "instagramUsername"
  | "leadSource"
  | "privacyConsent"
>;

// ─── CRM / Lead ────────────────────────────────────────────────────────────

export type LeadStatus =
  | "new"
  | "engaged"
  | "warm"
  | "hot"
  | "converted"
  | "lost"
  | "churned";

export interface Lead {
  id: string;
  registrationId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  emailHash: string;
  phoneHash: string;
  status: LeadStatus;
  tags: string[];
  // Encrypted fields
  notesEncrypted?: string;
  remarksEncrypted?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeadNote {
  id: string;
  leadId: string;
  contentEncrypted: string; // AES-256-GCM encrypted
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeadActivity {
  id: string;
  leadId: string;
  type:
    | "registered"
    | "attended"
    | "email_sent"
    | "note_added"
    | "status_changed"
    | "tag_added"
    | "tag_removed";
  metadata: Record<string, unknown>;
  createdAt: Date;
}

// ─── Email ─────────────────────────────────────────────────────────────────

export type EmailType =
  | "registration_confirmation"
  | "reminder_1day"
  | "reminder_1hour"
  | "reminder_10min"
  | "replay"
  | "certificate"
  | "course_offer";

export type EmailStatus = "pending" | "sent" | "failed" | "bounced";

export interface EmailLog {
  id: string;
  registrationId: string;
  type: EmailType;
  status: EmailStatus;
  resendId?: string;
  error?: string;
  sentAt?: Date;
  createdAt: Date;
}

// ─── Audit Logs ────────────────────────────────────────────────────────────

export type AuditAction =
  | "login"
  | "logout"
  | "login_failed"
  | "webinar_created"
  | "webinar_updated"
  | "webinar_deleted"
  | "registration_deleted"
  | "user_deleted"
  | "data_exported"
  | "attendance_marked";

export interface AuditLog {
  id: string;
  userId?: string;
  action: AuditAction;
  resourceType?: string;
  resourceId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// ─── API Response ──────────────────────────────────────────────────────────

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, string[]>;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

// ─── Pagination ────────────────────────────────────────────────────────────

export interface PaginationParams {
  page: number;
  perPage: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  hasMore: boolean;
}

// ─── File Storage ──────────────────────────────────────────────────────────

export interface UploadedFile {
  id: string;
  name: string;
  path: string;
  url: string;
  size: number;
  mimeType: string;
  bucket: string;
  createdAt: Date;
}

// ─── WhatsApp (Provider Abstraction) ───────────────────────────────────────

export type WhatsAppProvider = "meta_cloud_api" | "interakt" | "wati";

export interface WhatsAppMessage {
  to: string; // Phone number with country code
  templateName: string;
  templateParams: Record<string, string>;
  provider?: WhatsAppProvider;
}

// ─── Analytics ─────────────────────────────────────────────────────────────

export interface WebinarAnalytics {
  webinarId: string;
  totalRegistrations: number;
  totalAttended: number;
  attendanceRate: number;
  registrationsBySource: Record<LeadSource, number>;
  registrationsByCountry: Record<string, number>;
  registrationsByDay: Array<{ date: string; count: number }>;
}

export interface DashboardMetrics {
  totalRegistrations: number;
  totalWebinars: number;
  upcomingWebinars: number;
  averageAttendanceRate: number;
  totalLeads: number;
  convertedLeads: number;
}

/**
 * Supabase Database Types
 *
 * This file is the canonical type source for all database tables.
 * In production, generate this file with:
 *   npx supabase gen types typescript --project-id <your-project-id> > packages/database/src/types.ts
 *
 * The types below are the manually maintained initial scaffold.
 * Replace with generated types once the Supabase project is created.
 *
 * @module database/types
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      // ─── profiles ─────────────────────────────────────────────────────
      profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };

      // ─── admin_users ──────────────────────────────────────────────────
      admin_users: {
        Row: {
          id: string;
          user_id: string;
          role: "super_admin" | "admin" | "viewer";
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: "super_admin" | "admin" | "viewer";
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: "super_admin" | "admin" | "viewer";
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "admin_users_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };

      // ─── webinars ─────────────────────────────────────────────────────
      webinars: {
        Row: {
          id: string;
          title: string;
          description: string;
          short_description: string | null;
          speaker_name: string;
          speaker_bio: string | null;
          speaker_image_url: string | null;
          scheduled_at: string;
          duration_minutes: number;
          youtube_video_id: string | null;
          youtube_stream_key: string | null;
          whatsapp_community_url: string | null;
          google_calendar_url: string | null;
          status: "draft" | "published" | "live" | "ended" | "cancelled";
          thumbnail_url: string | null;
          registration_deadline: string | null;
          max_registrations: number | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          short_description?: string | null;
          speaker_name: string;
          speaker_bio?: string | null;
          speaker_image_url?: string | null;
          scheduled_at: string;
          duration_minutes?: number;
          youtube_video_id?: string | null;
          youtube_stream_key?: string | null;
          whatsapp_community_url?: string | null;
          google_calendar_url?: string | null;
          status?: "draft" | "published" | "live" | "ended" | "cancelled";
          thumbnail_url?: string | null;
          registration_deadline?: string | null;
          max_registrations?: number | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          short_description?: string | null;
          speaker_name?: string;
          speaker_bio?: string | null;
          speaker_image_url?: string | null;
          scheduled_at?: string;
          duration_minutes?: number;
          youtube_video_id?: string | null;
          youtube_stream_key?: string | null;
          whatsapp_community_url?: string | null;
          google_calendar_url?: string | null;
          status?: "draft" | "published" | "live" | "ended" | "cancelled";
          thumbnail_url?: string | null;
          registration_deadline?: string | null;
          max_registrations?: number | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "webinars_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };

      // ─── registrations ────────────────────────────────────────────────
      registrations: {
        Row: {
          id: string;
          webinar_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          email_hash: string;
          phone_hash: string;
          country: string;
          state: string | null;
          city: string | null;
          occupation: string | null;
          lead_status: string | null;
          lead_source:
            | "instagram"
            | "youtube"
            | "facebook"
            | "google"
            | "whatsapp"
            | "referral"
            | "email"
            | "other";
          privacy_consent: boolean;
          consent_timestamp: string;
          status:
            | "pending"
            | "confirmed"
            | "cancelled"
            | "attended"
            | "no_show";
          attended_at: string | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          webinar_id: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          email_hash: string;
          phone_hash: string;
          country: string;
          state?: string | null;
          city?: string | null;
          occupation?: string | null;
          lead_status?: string | null;
          lead_source:
            | "instagram"
            | "youtube"
            | "facebook"
            | "google"
            | "whatsapp"
            | "referral"
            | "email"
            | "other";
          privacy_consent: boolean;
          consent_timestamp?: string;
          status?: "pending" | "confirmed" | "cancelled" | "attended" | "no_show";
          attended_at?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          webinar_id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string;
          email_hash?: string;
          phone_hash?: string;
          country?: string;
          state?: string | null;
          city?: string | null;
          occupation?: string | null;
          lead_status?: string | null;
          lead_source?:
            | "instagram"
            | "youtube"
            | "facebook"
            | "google"
            | "whatsapp"
            | "referral"
            | "email"
            | "other";
          privacy_consent?: boolean;
          consent_timestamp?: string;
          status?: "pending" | "confirmed" | "cancelled" | "attended" | "no_show";
          attended_at?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "registrations_webinar_id_fkey";
            columns: ["webinar_id"];
            isOneToOne: false;
            referencedRelation: "webinars";
            referencedColumns: ["id"];
          },
        ];
      };

      // ─── audit_logs ───────────────────────────────────────────────────
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action:
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
          resource_type: string | null;
          resource_id: string | null;
          metadata: Json | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action:
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
          resource_type?: string | null;
          resource_id?: string | null;
          metadata?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          // Audit logs are immutable – no updates allowed
          id?: never;
        };
        Relationships: [];
      };

      // ─── email_logs ───────────────────────────────────────────────────
      email_logs: {
        Row: {
          id: string;
          registration_id: string;
          type:
            | "registration_confirmation"
            | "reminder_1day"
            | "reminder_1hour"
            | "reminder_10min"
            | "replay"
            | "certificate"
            | "course_offer";
          status: "pending" | "sent" | "failed" | "bounced";
          resend_id: string | null;
          error: string | null;
          sent_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          registration_id: string;
          type:
            | "registration_confirmation"
            | "reminder_1day"
            | "reminder_1hour"
            | "reminder_10min"
            | "replay"
            | "certificate"
            | "course_offer";
          status?: "pending" | "sent" | "failed" | "bounced";
          resend_id?: string | null;
          error?: string | null;
          sent_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          status?: "pending" | "sent" | "failed" | "bounced";
          resend_id?: string | null;
          error?: string | null;
          sent_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "email_logs_registration_id_fkey";
            columns: ["registration_id"];
            isOneToOne: false;
            referencedRelation: "registrations";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: "super_admin" | "admin" | "viewer";
      webinar_status: "draft" | "published" | "live" | "ended" | "cancelled";
      registration_status:
        | "pending"
        | "confirmed"
        | "cancelled"
        | "attended"
        | "no_show";
      lead_source:
        | "instagram"
        | "youtube"
        | "facebook"
        | "google"
        | "whatsapp"
        | "referral"
        | "email"
        | "other";
      email_type:
        | "registration_confirmation"
        | "reminder_1day"
        | "reminder_1hour"
        | "reminder_10min"
        | "replay"
        | "certificate"
        | "course_offer";
      email_status: "pending" | "sent" | "failed" | "bounced";
      audit_action:
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
    };
    CompositeTypes: Record<string, never>;
  };
}

// Convenience type helpers
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];

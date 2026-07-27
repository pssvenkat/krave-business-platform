-- ============================================================
-- Krave Business Platform – Initial Database Schema
-- Migration: 001_initial_schema.sql
-- 
-- Tables created:
--   - profiles (linked to Supabase Auth users)
--   - admin_users (RBAC roles)
--   - webinars
--   - registrations (with HMAC hashes for searchable fields)
--   - audit_logs (append-only)
--   - email_logs
--
-- Security:
--   - Row Level Security (RLS) enabled on ALL tables
--   - Sensitive data protected by RBAC policies
--   - Indexes on HMAC hash fields for O(1) search
-- ============================================================

-- ─── Extensions ──────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Enums ───────────────────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'viewer');

CREATE TYPE webinar_status AS ENUM ('draft', 'published', 'live', 'ended', 'cancelled');

CREATE TYPE registration_status AS ENUM ('pending', 'confirmed', 'cancelled', 'attended', 'no_show');

CREATE TYPE lead_source AS ENUM (
  'instagram', 'youtube', 'facebook', 'google',
  'whatsapp', 'referral', 'email', 'other'
);

CREATE TYPE email_type AS ENUM (
  'registration_confirmation', 'reminder_1day', 'reminder_1hour',
  'reminder_10min', 'replay', 'certificate', 'course_offer'
);

CREATE TYPE email_status AS ENUM ('pending', 'sent', 'failed', 'bounced');

CREATE TYPE audit_action AS ENUM (
  'login', 'logout', 'login_failed',
  'webinar_created', 'webinar_updated', 'webinar_deleted',
  'registration_deleted', 'user_deleted', 'data_exported', 'attendance_marked'
);

-- ─── profiles ─────────────────────────────────────────────────────────────
-- Extends Supabase auth.users with application-specific profile data.
-- Created automatically via trigger when a user signs up.

CREATE TABLE public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  first_name  TEXT,
  last_name   TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── admin_users ──────────────────────────────────────────────────────────

CREATE TABLE public.admin_users (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  role        user_role NOT NULL DEFAULT 'viewer',
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_admin_users_user_id ON public.admin_users(user_id);
CREATE INDEX idx_admin_users_active ON public.admin_users(user_id) WHERE is_active = TRUE;

-- ─── webinars ─────────────────────────────────────────────────────────────

CREATE TABLE public.webinars (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title                   TEXT NOT NULL,
  description             TEXT NOT NULL,
  short_description       TEXT,
  speaker_name            TEXT NOT NULL,
  speaker_bio             TEXT,
  speaker_image_url       TEXT,
  scheduled_at            TIMESTAMPTZ NOT NULL,
  duration_minutes        INTEGER NOT NULL DEFAULT 60,
  youtube_video_id        TEXT,
  youtube_stream_key      TEXT,  -- Encrypted in application layer
  whatsapp_community_url  TEXT,
  google_calendar_url     TEXT,
  status                  webinar_status NOT NULL DEFAULT 'draft',
  thumbnail_url           TEXT,
  registration_deadline   TIMESTAMPTZ,
  max_registrations       INTEGER,
  created_by              UUID NOT NULL REFERENCES public.profiles(id),
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER webinars_updated_at
  BEFORE UPDATE ON public.webinars
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_webinars_status ON public.webinars(status);
CREATE INDEX idx_webinars_scheduled_at ON public.webinars(scheduled_at DESC);
CREATE INDEX idx_webinars_created_by ON public.webinars(created_by);

-- ─── registrations ────────────────────────────────────────────────────────
-- Stores webinar registrations.
-- 
-- IMPORTANT SECURITY NOTES:
-- - email and phone are stored in plaintext, protected by RLS (admin-only)
-- - email_hash and phone_hash are HMAC-SHA256 hashes for search/dedup
-- - Hashes are computed in application layer using HMAC_SECRET
-- - Hashes are indexed for O(1) lookup

CREATE TABLE public.registrations (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  webinar_id          UUID NOT NULL REFERENCES public.webinars(id) ON DELETE RESTRICT,
  
  -- Personal information (plaintext, RBAC-protected)
  first_name          TEXT NOT NULL,
  last_name           TEXT NOT NULL,
  email               TEXT NOT NULL,
  phone               TEXT NOT NULL,
  
  -- HMAC-SHA256 hashes for search and duplicate detection
  -- Computed server-side using HMAC_SECRET env var
  -- NEVER expose these to the frontend
  email_hash          TEXT NOT NULL,
  phone_hash          TEXT NOT NULL,
  
  -- Location
  country             TEXT NOT NULL,
  state               TEXT,
  city                TEXT,
  
  -- Professional
  occupation          TEXT,
  instagram_username  TEXT,
  lead_source         lead_source NOT NULL,
  
  -- Consent
  privacy_consent     BOOLEAN NOT NULL DEFAULT FALSE,
  consent_timestamp   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Status tracking
  status              registration_status NOT NULL DEFAULT 'pending',
  attended_at         TIMESTAMPTZ,
  
  -- Request metadata (for fraud detection)
  ip_address          INET,
  user_agent          TEXT,
  
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER registrations_updated_at
  BEFORE UPDATE ON public.registrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for hash-based lookups (dedup + search)
CREATE UNIQUE INDEX idx_registrations_email_hash_webinar 
  ON public.registrations(email_hash, webinar_id);
  
CREATE INDEX idx_registrations_phone_hash ON public.registrations(phone_hash);
CREATE INDEX idx_registrations_webinar_id ON public.registrations(webinar_id);
CREATE INDEX idx_registrations_status ON public.registrations(status);
CREATE INDEX idx_registrations_created_at ON public.registrations(created_at DESC);
CREATE INDEX idx_registrations_lead_source ON public.registrations(lead_source);

-- ─── audit_logs ───────────────────────────────────────────────────────────
-- Append-only audit trail. No UPDATE or DELETE allowed via RLS.

CREATE TABLE public.audit_logs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action        audit_action NOT NULL,
  resource_type TEXT,
  resource_id   TEXT,
  metadata      JSONB,
  ip_address    INET,
  user_agent    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);

-- ─── email_logs ───────────────────────────────────────────────────────────

CREATE TABLE public.email_logs (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  registration_id   UUID NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
  type              email_type NOT NULL,
  status            email_status NOT NULL DEFAULT 'pending',
  resend_id         TEXT,
  error             TEXT,
  sent_at           TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_email_logs_registration_id ON public.email_logs(registration_id);
CREATE INDEX idx_email_logs_type ON public.email_logs(type);
CREATE INDEX idx_email_logs_status ON public.email_logs(status);

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webinars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- ─── Helper function: is_admin ────────────────────────────────────────────
-- Returns true if the current user is an active admin of any role.
-- Used in RLS policies for admin-only tables.

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = auth.uid()
    AND is_active = TRUE
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- ─── Helper function: is_super_admin ─────────────────────────────────────

CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = auth.uid()
    AND role = 'super_admin'
    AND is_active = TRUE
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- ─── profiles policies ────────────────────────────────────────────────────

-- Users can read their own profile
CREATE POLICY "profiles_self_read" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "profiles_self_update" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "profiles_admin_read" ON public.profiles
  FOR SELECT USING (is_admin());

-- ─── admin_users policies ─────────────────────────────────────────────────

-- Admins can read admin_users
CREATE POLICY "admin_users_read" ON public.admin_users
  FOR SELECT USING (is_admin());

-- Only super_admins can insert/update/delete admin_users
CREATE POLICY "admin_users_super_admin_write" ON public.admin_users
  FOR ALL USING (is_super_admin());

-- ─── webinars policies ────────────────────────────────────────────────────

-- Published/live/ended webinars are publicly readable
CREATE POLICY "webinars_public_read" ON public.webinars
  FOR SELECT USING (status IN ('published', 'live', 'ended'));

-- Admins can read all webinars (including drafts)
CREATE POLICY "webinars_admin_read" ON public.webinars
  FOR SELECT USING (is_admin());

-- Admins can create webinars
CREATE POLICY "webinars_admin_insert" ON public.webinars
  FOR INSERT WITH CHECK (is_admin());

-- Admins can update webinars
CREATE POLICY "webinars_admin_update" ON public.webinars
  FOR UPDATE USING (is_admin());

-- Only super_admins can delete webinars
CREATE POLICY "webinars_super_admin_delete" ON public.webinars
  FOR DELETE USING (is_super_admin());

-- ─── registrations policies ───────────────────────────────────────────────

-- Registrations are NOT publicly readable (sensitive data)
-- Public registration inserts are allowed (open registration)
CREATE POLICY "registrations_public_insert" ON public.registrations
  FOR INSERT WITH CHECK (TRUE);

-- Admins can read all registrations
CREATE POLICY "registrations_admin_read" ON public.registrations
  FOR SELECT USING (is_admin());

-- Admins can update registration status (mark attendance, etc.)
CREATE POLICY "registrations_admin_update" ON public.registrations
  FOR UPDATE USING (is_admin());

-- Only super_admins can delete registrations
CREATE POLICY "registrations_super_admin_delete" ON public.registrations
  FOR DELETE USING (is_super_admin());

-- ─── audit_logs policies ──────────────────────────────────────────────────

-- Admins can read audit logs
CREATE POLICY "audit_logs_admin_read" ON public.audit_logs
  FOR SELECT USING (is_admin());

-- Anyone (including service role) can insert audit logs
-- But NO updates or deletes are allowed (append-only enforced by missing policies)
CREATE POLICY "audit_logs_insert" ON public.audit_logs
  FOR INSERT WITH CHECK (TRUE);

-- ─── email_logs policies ──────────────────────────────────────────────────

-- Admins can read email logs
CREATE POLICY "email_logs_admin_read" ON public.email_logs
  FOR SELECT USING (is_admin());

-- Service role inserts (from API routes)
CREATE POLICY "email_logs_insert" ON public.email_logs
  FOR INSERT WITH CHECK (TRUE);

-- Admins can update email log status
CREATE POLICY "email_logs_admin_update" ON public.email_logs
  FOR UPDATE USING (is_admin());

-- ============================================================
-- COMMENTS / DOCUMENTATION
-- ============================================================

COMMENT ON TABLE public.registrations IS
  'Webinar registrations. Email/phone stored in plaintext (RBAC-protected). '
  'email_hash/phone_hash are HMAC-SHA256 hashes for O(1) search/dedup. '
  'Hashes are computed in the application layer using HMAC_SECRET. '
  'NEVER expose hashes to the frontend.';

COMMENT ON COLUMN public.registrations.email_hash IS
  'HMAC-SHA256(email, HMAC_SECRET). Used for duplicate detection and search. Never expose to frontend.';

COMMENT ON COLUMN public.registrations.phone_hash IS
  'HMAC-SHA256(phone, HMAC_SECRET). Used for duplicate detection and search. Never expose to frontend.';

COMMENT ON TABLE public.audit_logs IS
  'Append-only audit trail. No UPDATE or DELETE allowed via RLS policies.';

COMMENT ON COLUMN public.webinars.youtube_stream_key IS
  'Stream key encrypted at application layer using AES-256-GCM before storage.';

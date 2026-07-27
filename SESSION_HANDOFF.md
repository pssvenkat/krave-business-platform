# Session Handoff – Krave Business Platform

## Last Updated
2026-07-27

## Current Status
**Milestone 1 – Foundation: COMPLETE**

## What Was Completed This Session

### Milestone 1 – Foundation
All foundation infrastructure has been built and committed.

**Root Configuration**
- Turborepo 2.x monorepo with pnpm 9.x workspaces
- `turbo.json` pipeline for build, dev, lint, type-check, test
- ESLint, Prettier, TypeScript configurations
- GitHub Actions CI/CD workflow

**Shared Packages (8 total)**
1. `packages/config` – ESLint, TypeScript, Tailwind shared configs
2. `packages/types` – TypeScript interfaces (User, Webinar, Registration, Lead, etc.)
3. `packages/utils` – AES-256-GCM encryption, HMAC-SHA256 hashing, formatters
4. `packages/validation` – Zod schemas for all forms
5. `packages/database` – Supabase client (browser + server via `@supabase/ssr`)
6. `packages/auth` – RBAC, session utilities, middleware
7. `packages/analytics` – PostHog wrapper (browser + server)
8. `packages/emails` – react-email templates (confirmation, reminders)
9. `packages/ui` – shadcn/ui shared components (New York style)

**Applications**
- `apps/webinar` – Next.js 15 App Router, placeholder pages, security headers
- `apps/admin` – Next.js 15 App Router, login page stub, RBAC middleware

**Database**
- Supabase SQL migrations (profiles, webinars, registrations, admin_users, audit_logs)
- Row Level Security policies for all tables

**Security**
- Security headers in both Next.js apps
- Encryption utilities (AES-256-GCM)
- HMAC hashing for searchable fields

## Next Session: Milestone 2 – Webinar Platform

### Webinar App
1. **Landing page** – Hero with countdown, Benefits, Trainer profile, Testimonials, FAQ, Register CTA
2. **Registration page** – Full form (name, email, phone, country, state, city, occupation, Instagram, lead source, consent)
3. **Thank You page** – Confirmation email sent, Google Calendar button, WhatsApp Community join
4. **Webinar Live page** – YouTube Live embed, countdown timer, speaker info
5. **SEO** – Metadata, sitemap.ts, robots.ts, OpenGraph, Twitter Cards, JSON-LD structured data

### Admin App
1. **Dashboard** – Metrics cards (total registrations, attended, upcoming webinars)
2. **Webinar CRUD** – Create/edit/delete webinars, set date/time/YouTube ID
3. **Registrations list** – Paginated table, search, filter by webinar/date/status
4. **Attendance** – Mark attended/absent, CSV export
5. **Email logs** – View sent emails per registration

### Backend / API
1. Register API route (validate, check duplicate, encrypt, hash, insert, send email)
2. Webinar API routes (CRUD, protected by admin auth)
3. Attendance API routes
4. Email queue / scheduled sends via Resend

### Email Templates (Resend)
1. Registration confirmation
2. 1-day reminder
3. 1-hour reminder  
4. 10-minute reminder
5. Replay link
6. Certificate

## Architecture Decisions Made

### Security Model
- Sensitive fields (name, email, phone) stored in plaintext, protected by RBAC + RLS
- HMAC-SHA256 hash stored alongside email/phone for O(1) duplicate detection and search
- Internal notes/remarks encrypted with AES-256-GCM + unique IVs
- Encryption keys stored ONLY in environment variables (never in code)
- Supabase Auth used exclusively – no passwords stored in our database

### Package Manager
- **pnpm 9.x** – fastest, strictest, best Turborepo support

### Component Library
- **shadcn/ui (New York style)** – Components copied into `packages/ui`, not a dependency
- Shared across all apps via workspace imports

### Auth Strategy
- `@supabase/ssr` package (NOT the deprecated `auth-helpers-nextjs`)
- HTTP-only cookies for session management
- Middleware-based session refresh in all apps

### Database Strategy
- All Supabase queries via typed client (`packages/database`)
- Never use raw SQL in UI components
- All sensitive queries use parameterized SQL (Supabase default)

## Known Issues / Pending Items
- Supabase project must be created and env vars filled in `.env.local` files
- Vercel project must be created for each app (`webinar`, `admin`)
- GitHub repo must be set up at `https://github.com/pssvenkat/krave-business-platform.git`
- Cloudflare DNS records for subdomains need to be configured after Vercel deployment

## Environment Variables Required

### All Apps
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### Encryption / Security
```
ENCRYPTION_SECRET=        # 32-byte AES-256-GCM key (hex)
HMAC_SECRET=              # 32-byte HMAC-SHA256 secret (hex)
```

### Email (apps/webinar, apps/admin)
```
RESEND_API_KEY=
RESEND_FROM_EMAIL=hello@kravemicrogreens.in
```

### Analytics
```
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://us.posthog.com
```

### Admin
```
NEXT_PUBLIC_TURNSTILE_SITE_KEY=    # Cloudflare Turnstile
TURNSTILE_SECRET_KEY=
```

## File Structure Reference

```
krave-platform/
├── apps/
│   ├── webinar/     → webinar.kravemicrogreens.in
│   └── admin/       → admin.kravemicrogreens.in
├── packages/
│   ├── config/      → ESLint, TS, Tailwind configs
│   ├── types/       → Shared TypeScript types
│   ├── utils/       → Crypto, hash, formatters
│   ├── validation/  → Zod schemas
│   ├── database/    → Supabase clients
│   ├── auth/        → RBAC, sessions
│   ├── analytics/   → PostHog
│   ├── emails/      → react-email templates
│   └── ui/          → shadcn/ui components
├── docs/
│   └── architecture.md
├── CHANGELOG.md
├── ROADMAP.md
└── SESSION_HANDOFF.md
```

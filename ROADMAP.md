# Krave Business Platform – Roadmap

## Vision

A modular, scalable business platform for Krave Microgreens built on a Turborepo monorepo.
Each application is independently deployable on Vercel under subdomains of `kravemicrogreens.in`.

---

## Architecture

| App | Subdomain | Status |
|-----|-----------|--------|
| Webinar | `webinar.kravemicrogreens.in` | ✅ Live |
| Admin | `admin.kravemicrogreens.in` | ✅ Live |
| CRM | `crm.kravemicrogreens.in` | ⏳ Milestone 3 |
| Analytics | `analytics.kravemicrogreens.in` | ⏳ Milestone 4 |
| Academy | `academy.kravemicrogreens.in` | ⏳ Milestone 5 |

---

## Milestones

### ✅ Milestone 1 – Foundation (Complete)
**Goal**: Production-ready monorepo scaffold that builds and deploys successfully.

- [x] Turborepo + pnpm workspaces
- [x] Next.js 16 App Router (webinar + admin apps)
- [x] TypeScript strict mode
- [x] Tailwind CSS + shadcn/ui
- [x] Supabase (Auth, Database, Storage)
- [x] Resend + react-email templates
- [x] PostHog analytics
- [x] Shared packages (ui, auth, database, emails, analytics, validation, types, utils, config)
- [x] Security headers + encryption utilities
- [x] RBAC implementation
- [x] GitHub Actions CI/CD
- [x] Vercel deployment config

---

### ✅ Milestone 2 – Webinar Platform (Complete)
**Goal**: Fully functional webinar registration, trainer management, and admin platform.

**Webinar App (`apps/webinar`)**
- [x] Landing page: Hero, Benefits, Dynamic Trainer, Testimonials, FAQ, Countdown, Register CTA
- [x] Registration page: Full form with validation + Turnstile fallback
- [x] Thank You page: Dynamic Confirmation + Localized Date/Time + Calendar + WhatsApp Community buttons
- [x] Webinar Live page: Title, Description, Speaker, Countdown, YouTube Live embed
- [x] Dynamic visitor local timezone detection (`<LocalizedTime />`)
- [x] Email automation: Registration confirmation

**Admin App (`apps/admin`)**
- [x] Dashboard: Key metrics, upcoming webinars, recent registrations
- [x] Webinar CRUD: Create, read, edit, status actions (Publish, Go Live, End)
- [x] Trainer Profile Management (`/trainers`): Add, edit, delete trainers, local image file picker + database Base64 image storage
- [x] Website Color Theme Selector (`/settings`): Interactive HEX code inputs + live branding injection
- [x] Registration management: List, search, filter registrations
- [x] Both apps build clean & deployed to Vercel

---

### ⏳ Milestone 3 – CRM
**Goal**: Complete lead management system.

- [ ] Lead profiles with encrypted sensitive data
- [ ] Lead status workflow
- [ ] Notes (encrypted)
- [ ] Tags
- [ ] Search by email/phone (via HMAC hash)
- [ ] Activity timeline
- [ ] Filters and segments
- [ ] Export (CSV, JSON)

---

### ⏳ Milestone 4 – Analytics
**Goal**: Actionable business intelligence dashboard.

- [ ] Attendance reports
- [ ] Conversion funnel
- [ ] Lead source tracking
- [ ] Geographic insights
- [ ] PostHog custom events

---

### ⏳ Milestone 5 – Academy
**Goal**: Online learning platform.

- [ ] Courses and lessons
- [ ] Student dashboard
- [ ] Progress tracking
- [ ] Certificates (PDF generation)

---

### ⏳ Milestone 6 – AI & Automation
**Goal**: AI-powered business automation.

- [ ] AI assistant
- [ ] WhatsApp automation (Meta Cloud API / Interakt / WATI abstraction)
- [ ] Workflow automation
- [ ] Smart recommendations
- [ ] Automated reports

---

## Future Features
- Affiliate program
- Blog / Content management
- Community platform
- AWS KMS / Google KMS key management
- Mobile app (React Native)

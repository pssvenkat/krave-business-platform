# Krave Business Platform – Roadmap

## Vision

A modular, scalable business platform for Krave Microgreens built on a Turborepo monorepo.
Each application is independently deployable on Vercel under subdomains of `kravemicrogreens.in`.

---

## Architecture

| App | Subdomain | Status |
|-----|-----------|--------|
| Webinar | `webinar.kravemicrogreens.in` | 🔄 Milestone 2 |
| Admin | `admin.kravemicrogreens.in` | 🔄 Milestone 2 |
| CRM | `crm.kravemicrogreens.in` | ⏳ Milestone 3 |
| Inventory | `inventory.kravemicrogreens.in` | ⏳ Milestone 5 |
| Academy | `academy.kravemicrogreens.in` | ⏳ Milestone 7 |

---

## Milestones

### ✅ Milestone 1 – Foundation (Complete)
**Goal**: Production-ready monorepo scaffold that builds and deploys successfully.

- [x] Turborepo + pnpm workspaces
- [x] Next.js 15 App Router (webinar + admin apps)
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

### 🔄 Milestone 2 – Webinar Platform (Next)
**Goal**: Fully functional webinar registration and management system.

**Webinar App (`apps/webinar`)**
- [ ] Landing page: Hero, Benefits, Trainer, Testimonials, FAQ, Countdown, Register CTA
- [ ] Registration page: Full form with validation + Cloudflare Turnstile
- [ ] Thank You page: Confirmation + Calendar + WhatsApp Community buttons
- [ ] Webinar Live page: Title, Description, Speaker, Countdown, YouTube Live embed
- [ ] SEO: Metadata, sitemap, robots.txt, OpenGraph, Twitter Cards, Structured Data
- [ ] Email automation: Registration confirmation, 1-day, 1-hour, 10-min reminders

**Admin App (`apps/admin`)**
- [ ] Dashboard: Key metrics, upcoming webinars, recent registrations
- [ ] Webinar CRUD: Create, read, update, delete webinars
- [ ] Registration management: List, search, filter registrations
- [ ] Attendance tracking: Mark attendance, export
- [ ] CSV export
- [ ] Audit log viewer

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

### ⏳ Milestone 5 – Inventory
**Goal**: Microgreens inventory and supplier management.

- [ ] Products (seeds, trays, supplies)
- [ ] Stock tracking
- [ ] Suppliers
- [ ] Purchase orders

---

### ⏳ Milestone 6 – Ecommerce
**Goal**: Online store for Krave products.

- [ ] Product catalog
- [ ] Shopping cart
- [ ] Checkout
- [ ] Razorpay / Stripe payments
- [ ] Orders
- [ ] Customer purchase history

---

### ⏳ Milestone 7 – Academy
**Goal**: Online learning platform.

- [ ] Courses and lessons
- [ ] Student dashboard
- [ ] Progress tracking
- [ ] Certificates (PDF generation)

---

### ⏳ Milestone 8 – AI & Automation
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

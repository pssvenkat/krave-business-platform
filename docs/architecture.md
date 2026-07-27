# Krave Business Platform – Architecture Decision Records

## Overview

The Krave Business Platform is a multi-application monorepo built with Turborepo.
Each application is independently deployable on Vercel, served under subdomains
of `kravemicrogreens.in`. The existing marketing website remains on its current host.

---

## ADR-001: Monorepo with Turborepo

**Decision**: Use Turborepo 2.x with pnpm workspaces.

**Context**: The platform requires multiple independent applications (webinar, admin, CRM, etc.)
that share common code (UI components, auth, database types, validation schemas).

**Consequences**:
- ✅ Shared packages reduce duplication
- ✅ Turborepo's task pipeline ensures correct build ordering
- ✅ Remote caching (Vercel) reduces CI build times by 70–90%
- ✅ Each app is independently deployable
- ⚠️ pnpm required (npm/yarn will not work correctly with workspaces)

---

## ADR-002: Supabase for Auth, Database, and Storage

**Decision**: Use Supabase exclusively for authentication, PostgreSQL database, and file storage.

**Context**: Need a managed Postgres database with built-in auth, RLS policies, and storage.

**Rationale**:
- Built-in Row Level Security at the database level
- Supabase Auth eliminates need to store passwords
- PostgreSQL allows complex queries for analytics
- Storage for speaker images, certificates, etc.

**Auth Library**: `@supabase/ssr` (NOT the deprecated `auth-helpers-nextjs`)

**Consequences**:
- ✅ Zero password storage in our code
- ✅ RLS enforces data isolation at the database level
- ✅ Free tier is sufficient for early growth
- ⚠️ Vendor lock-in for auth (mitigated by standard JWT tokens)

---

## ADR-003: Security Architecture

### Sensitive Data Strategy

| Data Classification | Examples | Storage |
|---|---|---|
| Public | Webinar titles, speaker info | Plaintext in DB, publicly readable |
| Internal | CRM notes, remarks | AES-256-GCM encrypted in DB |
| Sensitive | Name, email, phone | Plaintext in DB, RBAC + RLS protected |
| Passwords | — | NEVER stored. Supabase Auth only. |

### Searchable Field Hashing

Sensitive searchable fields (email, phone) are stored alongside HMAC-SHA256 hashes:

```
Registration {
  email: "venkat@example.com",           ← plaintext (admin-only via RLS)
  email_hash: "a3f7b2c9...",             ← HMAC-SHA256(email, HMAC_SECRET)
}
```

The hash allows O(1) duplicate detection and CRM lookup without exposing plaintext.
**Hashes are NEVER returned to the frontend.**

### Encryption

CRM notes and sensitive remarks use AES-256-GCM:
- Each encrypted value has a unique random IV
- Format stored: `{iv_hex}:{ciphertext_hex}`
- Keys stored ONLY in environment variables
- Future: Migrate to AWS KMS / Google Cloud KMS

### RBAC Roles

| Role | Permissions |
|---|---|
| super_admin | Full access + admin user management |
| admin | Webinar CRUD, registrations, CRM read/write, attendance, analytics |
| viewer | Read-only access to all data |

RBAC is enforced at two levels:
1. **Middleware** – Route-level protection (redirects)
2. **RLS Policies** – Database-level enforcement

---

## ADR-004: Next.js App Router (Server Components)

**Decision**: Use Next.js App Router with React Server Components for all pages.

**Rationale**:
- Server Components reduce JavaScript bundle size
- Server-side rendering improves SEO
- Streaming and Suspense improve perceived performance
- Server Actions replace API routes for form submissions

**Performance targets**:
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- Time to First Byte < 500ms

---

## ADR-005: shadcn/ui for UI Components

**Decision**: Use shadcn/ui (New York style) as the component library.

**Rationale**:
- Components are copied into the codebase (not a dependency)
- Full control over styling and behavior
- Built on Radix UI primitives (accessible, WCAG AA)
- Tailwind CSS-based (consistent with our stack)

**Shared via**: `packages/ui` workspace package

---

## ADR-006: Resend + react-email for Transactional Email

**Decision**: Use Resend as the email service and react-email for templates.

**Rationale**:
- Resend has excellent deliverability
- react-email allows React-based email templates with live preview
- Simple, developer-friendly API

**Future**: Add email queue/scheduler for reminder emails (1-day, 1-hour, 10-min)

---

## ADR-007: Independent Vercel Deployments

**Decision**: Each app is deployed as a separate Vercel project, all pointing to the same Git repository.

**Configuration**:
```
krave-business-platform.git
  └── apps/webinar  → Vercel project: krave-webinar → webinar.kravemicrogreens.in
  └── apps/admin    → Vercel project: krave-admin   → admin.kravemicrogreens.in
```

**Build optimization**: Use `turbo-ignore` in Vercel's "Ignored Build Step" to skip builds when no relevant files changed.

---

## ADR-008: WhatsApp Provider Abstraction

**Decision**: Implement a provider abstraction layer for WhatsApp messaging.

**Rationale**: The spec requires flexibility between providers (Meta Cloud API, Interakt, WATI).

**Design**:
```typescript
interface WhatsAppProvider {
  sendMessage(message: WhatsAppMessage): Promise<void>;
}

class MetaCloudAPIProvider implements WhatsAppProvider { ... }
class InteraktProvider implements WhatsAppProvider { ... }
class WATIProvider implements WhatsAppProvider { ... }
```

Providers are configured via environment variables and swappable without code changes.

---

## Future Architecture Decisions (Planned)

- **ADR-009**: Razorpay vs Stripe payment gateway selection
- **ADR-010**: Certificate PDF generation (react-pdf vs puppeteer)
- **ADR-011**: Key management migration to AWS KMS
- **ADR-012**: AI assistant model selection (Gemini vs OpenAI)

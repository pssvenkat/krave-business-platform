# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-07-27

### Added – Milestone 1: Foundation

#### Repository & Tooling
- Initialized Turborepo 2.x monorepo with pnpm workspaces
- Configured `turbo.json` pipeline: `build`, `dev`, `lint`, `type-check`, `test`
- Configured ESLint, Prettier, TypeScript across all packages and apps
- GitHub Actions CI workflow (type-check, lint, build, test)
- Node 20 LTS pinned via `.nvmrc`

#### Shared Packages
- `packages/config` – Shared ESLint, TypeScript, Tailwind configurations
- `packages/types` – Shared TypeScript type definitions (User, Webinar, Registration, Lead, etc.)
- `packages/utils` – AES-256-GCM encryption, HMAC-SHA256 hashing, date/phone formatters, `cn` utility
- `packages/validation` – Zod schemas for registration, admin login, webinar CRUD
- `packages/database` – Supabase browser/server clients, database type stubs
- `packages/auth` – RBAC helpers, session utilities, middleware helpers
- `packages/analytics` – PostHog provider, browser/server analytics clients
- `packages/emails` – react-email templates (registration confirmation, reminders)
- `packages/ui` – shadcn/ui shared component library (New York style)

#### Applications
- `apps/webinar` – Next.js 15 App Router app for webinar platform
- `apps/admin` – Next.js 15 App Router app for admin dashboard

#### Security
- Security headers configured in both apps (CSP, HSTS, X-Frame-Options, Referrer-Policy, etc.)
- AES-256-GCM encryption utilities implemented
- HMAC-SHA256 deterministic hashing for searchable sensitive fields
- RBAC with roles: Super Admin, Admin, Viewer

#### Database
- Supabase SQL migrations for profiles, admin_users, audit_logs, webinars, registrations
- Row Level Security policies for all tables

#### Documentation
- `ROADMAP.md` – Full milestone roadmap
- `SESSION_HANDOFF.md` – Session state and handoff notes
- `docs/architecture.md` – Architecture Decision Records

[0.1.0]: https://github.com/pssvenkat/krave-business-platform/releases/tag/v0.1.0

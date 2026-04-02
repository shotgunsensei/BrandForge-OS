# BrandForge OS

## Overview

BrandForge OS is a multi-tenant AI-powered marketing SaaS platform. It provides brand management, campaign planning, AI copy generation, content calendar, analytics, AI workflows, and strategy workspace.

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: Replit Auth (OIDC with PKCE)
- **AI**: OpenAI via Replit AI Integrations
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (API), Vite (frontend)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   ├── brandforge/         # React+Vite frontend
│   └── mockup-sandbox/     # Component preview sandbox
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   ├── db/                 # Drizzle ORM schema + DB connection
│   ├── replit-auth/        # Auth routes + middleware
│   ├── replit-auth-web/    # Frontend auth hook (useAuth)
│   └── integrations/       # OpenAI AI integration
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Database Schema

Core tables:
- **users** - Replit Auth users (id, username, email, image)
- **sessions** - Auth sessions
- **tenants** - Workspaces (name, slug, plan, industry, onboardingCompleted, aiCreditsUsed/Limit)
- **memberships** - User-tenant association with roles (owner/admin/member)
- **brands** - Brand identities (colors, fonts, voiceTone, guidelines)
- **personas** - Customer personas
- **campaigns** - Marketing campaigns (status: draft/active/paused/completed)
- **copy_assets** - Marketing copy (copyType, channel, tone, status)
- **calendar_items** - Content calendar items (scheduledDate, itemType, status)
- **audit_logs** - Activity tracking
- **usage_records** - AI credit usage tracking

Phase 2 tables:
- **offers** - Campaign offers/promotions
- **templates** - Campaign/content templates
- **comments** - Collaboration comments on entities
- **notifications** - User notifications
- **landing_pages** - Landing page content
- **campaign_tasks** - Campaign checklist/task items
- **ai_workflows** - Saved AI workflow definitions
- **integrations** - Third-party integration configs

Push schema: `pnpm --filter @workspace/db run push`

## API Routes (all under /api)

- **Auth**: `/api/login`, `/api/logout`, `/api/auth/user`
- **Tenants**: CRUD at `/api/tenants`, `/api/tenants/:id`
- **Onboarding**: `/api/tenants/:id/onboarding` (GET/POST)
- **Brands**: CRUD at `/api/tenants/:id/brands`
- **Personas**: CRUD at `/api/tenants/:id/personas`
- **Campaigns**: CRUD at `/api/tenants/:id/campaigns`
- **Copy Assets**: CRUD at `/api/tenants/:id/copy-assets`
- **Calendar Items**: CRUD at `/api/tenants/:id/calendar-items`
- **Dashboard**: `/api/tenants/:id/dashboard`
- **Activity**: `/api/tenants/:id/activity`
- **Analytics**: `/api/tenants/:id/analytics`
- **Members**: `/api/tenants/:id/members`
- **Usage**: `/api/tenants/:id/usage`
- **AI**: `/api/tenants/:id/ai/generate-copy`, `generate-strategy`, `generate-campaign-ideas`

All tenant routes require authentication + membership verification.

## Frontend Pages

Public pages:
- `/` - Premium marketing landing page (hero, features, how-it-works, testimonials, pricing preview, FAQ, footer)
- `/pricing` - Pricing tiers with monthly/annual toggle, plan comparison table, FAQ
- `/login` - Replit Auth login

Authenticated pages (all use AppLayout with sidebar):
- `/onboarding` - 6-step onboarding wizard (business info, type/industry, audience, brand voice, goals/channels, finish)
- `/dashboard` - Stats cards, AI credits usage, campaign status, recent copy, AI recommendations, activity feed, upcoming calendar
- `/brands` - Brand HQ (list/create/detail with colors, typography, guidelines)
- `/campaigns` - Campaign management with templates, grid/list view, status filters
- `/campaigns/:id` - Tabbed campaign detail (overview, strategy, copy, checklist, analytics)
- `/copy-studio` - AI copy generation with 10 channel modes, content scoring, compare mode, favorites, grid/list view
- `/calendar` - Content calendar (month/list view, filters by type/status, overdue alerts, day selection detail)
- `/analytics` - Charts, metrics, channel breakdown, AI recommendations panel
- `/strategy` - AI strategy generation + campaign ideas
- `/ai-workflows` - 6 guided AI workflows (product launch, content plan, ad campaign, lead gen, email sequence, refresh messaging)
- `/settings` - Tabbed settings (workspace, billing with usage meters, team with invite, integrations)

## Design System

- Premium gradient brand palette (`gradient-brand`, `gradient-brand-text` CSS utilities)
- Glass morphism effect (`glass` utility)
- Dark mode support via `.dark` class toggle
- Semantic colors: success, warning, info, destructive
- Consistent rounded-full buttons, rounded-xl cards
- Collapsible sidebar with workspace switcher and dark mode toggle

## Auth Flow

1. User clicks "Continue with Replit" -> redirects to `/api/login`
2. Replit OIDC flow completes -> user record created in DB
3. Session cookie set, frontend `useAuth()` detects authentication
4. `TenantProvider` loads user's tenants via `useListTenants()`
5. If no tenants, redirects to `/onboarding` to create workspace
6. Active `tenantId` stored in React context, passed to all API calls

## AI Integration

Uses OpenAI via Replit AI Integrations proxy. Environment variables:
- `AI_INTEGRATIONS_OPENAI_BASE_URL`
- `AI_INTEGRATIONS_OPENAI_API_KEY`

AI credit enforcement: checks `aiCreditsUsed < aiCreditsLimit` before each generation call. Returns 429 when limit exceeded.

## Key Commands

- `pnpm run typecheck` - TypeScript checking
- `pnpm --filter @workspace/db run push` - Push DB schema
- `pnpm --filter @workspace/api-spec run codegen` - Regenerate API client
- `pnpm --filter @workspace/api-server run dev` - Run API server
- `pnpm --filter @workspace/brandforge run dev` - Run frontend

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server with auth middleware, tenant isolation, and AI generation routes.

### `artifacts/brandforge` (`@workspace/brandforge`)

React+Vite frontend with shadcn/ui components, wouter routing, TanStack Query data fetching.

### `lib/db` (`@workspace/db`)

Drizzle ORM schema and connection. Push schema with `pnpm --filter @workspace/db run push`.

### `lib/api-spec` (`@workspace/api-spec`)

OpenAPI 3.1 spec and Orval codegen config. Run: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas for request/response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client.

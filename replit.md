# BrandForge OS

## Overview

BrandForge OS is a multi-tenant AI-powered marketing SaaS platform. It provides brand management, campaign planning, AI copy generation, content calendar, analytics, and strategy workspace.

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
│   └── brandforge/         # React+Vite frontend
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

- `/` - Landing page
- `/pricing` - Pricing tiers (Free/Starter/Growth/Agency/Enterprise)
- `/login` - Replit Auth login
- `/onboarding` - Multi-step workspace setup wizard
- `/dashboard` - Stats, campaigns, activity feed
- `/brands` - Brand HQ (list/create/detail)
- `/campaigns` - Campaign management
- `/copy-studio` - Copy creation + AI generation
- `/calendar` - Content calendar (month view)
- `/analytics` - Charts and metrics
- `/strategy` - AI strategy generation + campaign ideas
- `/settings` - Workspace settings, billing, team

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

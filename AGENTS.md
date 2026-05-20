<!-- BEGIN:nextjs-agent-rules -->

# Project Overview

This is a production-grade fullstack ecommerce platform for automotive parts.

Tech stack:

- Next.js App Router
- TypeScript
- Prisma
- PostgreSQL
- Redis
- Cloudinary
- TailwindCSS
- Shadcn UI
- Zustand
- TanStack Query

Architecture:

- Feature-based architecture
- Service layer pattern
- Server-first approach
- Clean code & scalable structure

# AI Agent Rules

Follow architecture defined in:
@ARCHITECTURE.md

Rules:

- Never access Prisma inside routes
- Never place business logic in components
- Use Zod validation
- Use repository pattern
- Keep server-only logic in src/server
- Use feature-based organization

# Folder Structure Rules

- Never place business logic inside UI components.
- All features must follow feature-based architecture.
- Shared reusable UI goes to `/components`.
- Feature-specific logic goes to `/features`.
- Database access only through service layer.
- Never query Prisma directly inside components.

Components:

- PascalCase
- Example: ProductCard.tsx

Hooks:

- camelCase with `use`
- Example: useProducts.ts

Services:

- kebab-case
- Example: product.service.ts

API routes:

- RESTful naming
- Example:
  /api/products
  /api/orders

# TypeScript Rules

- Strict TypeScript only.
- Avoid `any`.
- Prefer inferred types.
- Use Zod for validation.
- Export shared types from `/types`.
- DTO types must be separated from Prisma models.

# React & Next.js Rules

- Prefer Server Components by default.
- Use Client Components only when necessary.
- Avoid unnecessary useEffect.
- Prefer async server actions where appropriate.
- Keep components small and reusable.

# State Management

Use local state by default.

Use Zustand only for:

- auth state
- cart state
- global UI state

Do not use global state for:

- form state
- temporary modal state
- fetched API data

Use TanStack Query for server state.

# Database Rules

- Use Prisma service layer.
- Never access Prisma directly in components.
- Use transactions for critical operations.
- Avoid N+1 queries.
- Prefer pagination for large lists.

# Component Rules

- Reusable UI goes to `/components/ui`
- Feature-specific UI stays inside feature folder
- Avoid giant components
- Prefer composition over prop explosion

# Form Rules

- Use React Hook Form
- Use Zod resolver
- Centralize validation schema
- Show proper loading/error states

# Authentication Rules

- JWT auth with refresh token rotation
- Access token in HTTPOnly cookie
- Middleware-based route protection
- Role-based access control

# Performance Rules

- Optimize images
- Use pagination
- Avoid unnecessary client rendering
- Use caching when appropriate
- Lazy load heavy components

# Code Style

- Write clean readable code
- Avoid deep nesting
- Prefer early return
- Avoid duplicated logic
- Extract reusable utilities

# Git Rules

Commit style:

- feat:
- fix:
- refactor:
- chore:

Keep commits atomic.

# Forbidden Patterns

Do NOT:

- Do not query Prisma inside route handlers
- Do not place business logic inside React components
- Do not use process.env directly outside configs/env.config.ts
- use `any`
- put API calls inside random components
- hardcode URLs
- hardcode colors
- create huge files
- duplicate logic
- bypass validation
- create inconsistent UI

# Feature Structure Example

features/products/

- components/
- hooks/
- types/
- actions/

# Example Auth Flow

POST /api/auth/login

route.ts
→ auth.controller.ts
→ auth.service.ts
→ user.repository.ts
→ prisma.user.findUnique()

@DESIGN_SYSTEM.md
@API_CONVENTION.md

<!-- END:nextjs-agent-rules -->

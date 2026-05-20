# Architecture Overview

Flow:

Route
→ Controller
→ Service
→ Repository
→ Prisma

Infrastructure:

- Prisma
- JWT
- Redis
- Cloudinary

lives inside:
src/server/\*

# Service Layer

Responsible for:

- business logic
- orchestration
- auth logic

Must NOT:

- access HTTP directly
- manipulate cookies directly

# server/

Infrastructure layer.

Contains:

- prisma
- auth
- redis
- cloudinary

Must never be imported into client components.

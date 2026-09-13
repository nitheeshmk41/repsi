# REPSI Architecture

## Overview

REPSI is a multi-tenant Gym Management SaaS platform with three independent applications:

```
┌────────────────────────────────────────────────────────────────┐
│                        Client Layer                            │
│                                                                │
│   ┌────────────────────┐    ┌────────────────────────────┐    │
│   │   Web (Next.js)    │    │    Mobile (Flutter)         │    │
│   │   localhost:3000   │    │    iOS / Android / Web      │    │
│   └─────────┬──────────┘    └──────────────┬─────────────┘    │
│             │                              │                   │
└─────────────┼──────────────────────────────┼───────────────────┘
              │                              │
              ▼                              ▼
┌────────────────────────────────────────────────────────────────┐
│                       API Layer                                │
│                                                                │
│                ┌──────────────────────┐                        │
│                │   FastAPI Backend    │                        │
│                │   localhost:8000     │                        │
│                │   /api/v1/...        │                        │
│                └──────────┬───────────┘                        │
│                           │                                    │
└───────────────────────────┼────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────────┐
│                      Data Layer                                │
│                                                                │
│                ┌──────────────────────┐                        │
│                │      PostgreSQL       │                        │
│                │   localhost:5432     │                        │
│                └──────────────────────┘                        │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## Design Principles

1. **Business logic belongs in the backend** — never duplicated in web or mobile
2. **Multi-tenancy by design** — every query is scoped to a workspace/tenant
3. **No cross-tenant leakage** — enforced at the repository layer
4. **API versioned from day one** — `/api/v1/`

## Frontend Architecture (Next.js)

```
app/web/
├── app/
│   ├── (dashboard)/        # Authenticated app (route group)
│   │   ├── layout.tsx       # Sidebar + Topbar shell
│   │   ├── page.tsx         # Dashboard
│   │   ├── members/
│   │   ├── memberships/
│   │   ├── attendance/
│   │   ├── trainers/
│   │   ├── classes/
│   │   ├── payments/
│   │   ├── expenses/
│   │   ├── reports/
│   │   └── analytics/
│   ├── (marketing)/         # Public marketing pages (future)
│   ├── layout.tsx           # Root layout (theme, fonts, SEO)
│   └── globals.css          # Design tokens + base styles
│
├── components/
│   ├── layout/             # Sidebar, Topbar, ThemeProvider
│   └── ui/                 # Design system primitives
│
├── features/               # Feature-specific components
│   ├── dashboard/
│   ├── members/
│   └── ...
│
├── lib/
│   ├── utils.ts            # Shared utilities (cn, formatCurrency, etc.)
│   └── mock-data.ts        # Deterministic mock data
│
└── types/                  # Shared TypeScript types
```

## Backend Architecture (FastAPI)

```
app/api/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/   # Route handlers (thin)
│   │       └── router.py
│   ├── core/
│   │   ├── config.py        # Settings from env vars
│   │   ├── security.py      # JWT, password hashing
│   │   └── dependencies.py  # FastAPI deps (auth, db, tenant)
│   ├── db/
│   │   ├── session.py       # SQLAlchemy session
│   │   └── base.py          # Base model class
│   ├── models/              # SQLAlchemy ORM models
│   ├── schemas/             # Pydantic request/response schemas
│   ├── services/            # Business logic
│   ├── repositories/        # Data access layer
│   └── utils/
│
└── tests/
    ├── test_members.py
    ├── test_auth.py
    └── conftest.py
```

### Request Flow

```
HTTP Request
    │
    ▼
Route Handler (app/api/v1/endpoints/)
    │ validates request schema (Pydantic)
    │ extracts auth + tenant from header
    ▼
Service Layer (app/services/)
    │ business logic
    │ orchestrates repositories
    ▼
Repository Layer (app/repositories/)
    │ database queries
    │ tenant-scoped
    ▼
SQLAlchemy ORM → PostgreSQL
```

## Multi-tenancy Model

- A **Workspace** represents one gym/business (the tenant).
- Every `User` belongs to one or more `Workspace`s via `WorkspaceMember`.
- Every data entity (Member, Payment, Attendance, etc.) has a `workspace_id` foreign key.
- The current workspace is determined from the JWT token or request header.
- **The repository layer enforces tenant isolation** on every query.

## Authentication

- JWT Bearer tokens
- Access token: 60 minutes
- Refresh token: 30 days (stored as HttpOnly cookie)
- Password hashed with bcrypt
- Future: Google OAuth, OTP, 2FA

## API Response Format

**Success:**
```json
{
  "data": { ... },
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 1284
  }
}
```

**Error:**
```json
{
  "error": {
    "code": "MEMBER_NOT_FOUND",
    "message": "Member with ID xyz was not found.",
    "details": null
  }
}
```

## Design System

See [design-system.md](design-system.md) for the full component and token reference.

## Database Schema

See [database.md](database.md) for the full schema.

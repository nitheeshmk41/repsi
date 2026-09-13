# REPSI Core Backend API

Production-grade Gym Management SaaS backend built with FastAPI, SQLAlchemy 2.0, PostgreSQL, and JWT security.

## Architecture

- **Clean Layered Architecture:**
  - `Router` (API v1 HTTP contracts & serialization)
  - `Service` (Business logic, token generation, metrics aggregation)
  - `Repository` (Data access & workspace tenant isolation queries)
  - `SQLAlchemy ORM` (Models & database mapping)
  - `PostgreSQL / SQLite` (Database storage)

- **Multi-Tenant Isolation:**
  - Every tenant-owned database record inherits `TenantMixin` and enforces `workspace_id`.
  - Zero cross-gym data leakage.

## Getting Started

```bash
# Run with uv
uv run uvicorn app.main:app --reload --port 8000
```

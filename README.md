<![CDATA[<div align="center">
  <img src="app/web/public/logos/repsi_logo.png" alt="REPSI Logo" width="150" />
  
  <h3>The operating system for modern gyms.</h3>
  
  <p>
    REPSI is a production-quality Gym Management SaaS platform for gym owners, trainers, staff, and members — built with a premium design system, scalable architecture, and excellent UX.
  </p>

  <p>
    <a href="https://repsi.app">Live Web App</a> •
    <a href="#getting-started">Get Started</a> •
    <a href="docs/architecture.md">Documentation</a>
  </p>
</div>

---

## Key Features

- 🏢 **Multi-Tenancy:** Secure data isolation across different gyms and workspaces.
- 💳 **Billing & Payments:** Subscription management, automated billing, and invoice generation.
- 📱 **Cross-Platform:** Beautiful, responsive web app combined with native iOS, Android, and Desktop apps.
- 👥 **Member Management:** Track attendance, manage memberships, and view detailed member profiles.
- 📅 **Scheduling & Classes:** Streamlined class booking and trainer scheduling system.
- 📊 **Analytics & Reports:** Comprehensive dashboards for revenue, attendance, and growth metrics.
- 🔒 **Role-Based Access Control:** Fine-grained permissions for owners, staff, trainers, and members.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Web Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| UI Components | Radix UI, shadcn/ui-style primitives, Lucide Icons |
| Backend API | FastAPI, Python, Pydantic, SQLAlchemy |
| Database | PostgreSQL (Neon-compatible) |
| Mobile | Flutter, Dart |
| Containerization | Docker, Docker Compose |

---

## Monorepo Structure

```
repsi/
├── app/
│   ├── web/          # Next.js frontend
│   ├── api/          # FastAPI backend
│   └── mobile/       # Flutter mobile app
│
├── packages/
│   ├── api-contracts/   # Shared API type definitions
│   ├── design-tokens/   # Shared design tokens
│   └── shared-types/    # Shared TypeScript types
│
├── docker/              # Docker configuration
├── docs/                # Architecture & API docs
├── .env.example         # Environment variable template
└── docker-compose.yml
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.12+
- Flutter 3.x
- Docker & Docker Compose
- PostgreSQL 16+

### Web Frontend

```bash
cd app/web
cp ../../.env.example .env.local
# Edit .env.local with your values
npm install
npm run dev
# → http://localhost:3000
```

### Backend API

```bash
cd app/api
cp ../../.env.example .env
python -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
uvicorn app.main:app --reload
# → http://localhost:8000
```

### Mobile

```bash
cd app/mobile
flutter pub get
flutter run
```

### Full Stack (Docker)

```bash
cp .env.example .env
docker compose up --build
```

### Desktop

Development runs the Tauri shell around the local Next.js app:

```bash
cd app/desktop
npm install
npm run dev
```

### Releases

Create and push a semantic-version tag to build Android and desktop release artifacts through GitHub Actions:

```bash
git tag v1.0.0
git push origin v1.0.0
```

The release workflow publishes the Flutter Android APK and Tauri bundles for Linux, Windows, and macOS. Desktop packages open the deployed web app at `https://repsi.app`; change `REPSI_DESKTOP_URL` in the workflow for another deployment.

---

## Documentation

| Doc | Description |
|---|---|
| [Architecture](docs/architecture.md) | System architecture and design decisions |
| [API](docs/api.md) | REST API reference |
| [Database](docs/database.md) | Database schema and models |
| [Design System](docs/design-system.md) | UI components, tokens, and guidelines |

---

## Brand

**Primary color:** `#84CC16` (lime) — used as an accent, not the dominant color.

**Fonts:** Inter

**Design reference:** Stripe + Linear

---

## License

Proprietary — All rights reserved.
]]>

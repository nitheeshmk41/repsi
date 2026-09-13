<div align="center">
  <img src="app/web/public/logos/repsi_logo.png" alt="REPSI Logo" width="150" />
  
  <h3>The Operating System for Modern Gyms</h3>
  
  <p>
    REPSI is a production-quality Gym Management SaaS platform tailored for gym owners, trainers, staff, and members. Built with a premium design system, highly scalable architecture, and an exceptional user experience across all devices.
  </p>

  <p>
    <a href="https://repsi.app">Live Web App</a> •
    <a href="#getting-started">Get Started</a> •
    <a href="docs/architecture.md">Documentation</a>
  </p>
  
  <p>
    <img src="https://img.shields.io/badge/Version-1.0.0-84CC16?style=flat-square" alt="Version" />
    <img src="https://img.shields.io/badge/Platform-Web%20%7C%20iOS%20%7C%20Android%20%7C%20Desktop-lightgrey?style=flat-square" alt="Platforms" />
    <img src="https://img.shields.io/badge/License-Proprietary-blue?style=flat-square" alt="License" />
  </p>
</div>

---

## 🌟 About REPSI

Managing a fitness facility shouldn't mean juggling five different outdated software platforms. **REPSI** unifies your entire gym operation into a single, cohesive ecosystem. Whether you're a franchise owner analyzing multi-location revenue, a trainer checking your daily schedule, or a member booking your next HIIT class—REPSI delivers a specialized, native experience for every user on any device.

## ✨ Key Features

- 🏢 **Multi-Tenancy & Workspace Isolation:** Securely manage multiple gym locations or distinct businesses under a single organizational account with robust data isolation.
- 💳 **Automated Billing & Payments:** Seamlessly handle subscription renewals, one-off payments, failed transaction retries, and comprehensive invoice generation.
- 📱 **True Cross-Platform Experience:** A beautiful, responsive Next.js web application paired with high-performance native iOS, Android, and Desktop (Tauri) apps sharing the same business logic.
- 👥 **Comprehensive Member Management:** Effortlessly track attendance via QR codes, manage complex membership tiers, and view detailed, 360-degree member profiles.
- 📅 **Scheduling & Class Management:** Streamlined class booking, capacity management, and trainer scheduling with calendar integrations.
- 📊 **Actionable Analytics & Reports:** Intuitive, real-time dashboards tracking revenue, active memberships, churn rate, and attendance trends.
- 🔒 **Role-Based Access Control (RBAC):** Granular, fine-tuned permissions ensuring owners, staff, trainers, and members only see what they need to see.

---

## 🛠️ Technology Stack

REPSI is built using a modern, scalable, and developer-friendly stack:

| Layer | Technology | Description |
|---|---|---|
| **Web Frontend** | Next.js 16, React 19, Tailwind CSS v4 | Server-rendered, highly optimized web application. |
| **UI/UX** | Radix UI, shadcn/ui, Lucide Icons | Accessible, unstyled primitives wrapped in a premium design system. |
| **Mobile App** | Flutter 3.x, Dart | High-performance compiled native apps for iOS and Android. |
| **Desktop App** | Tauri, Rust | Lightweight, secure desktop wrapper for the web frontend. |
| **Backend API** | FastAPI, Python 3.12, Pydantic | Asynchronous, type-safe, and lightning-fast REST API. |
| **Database** | PostgreSQL, SQLAlchemy, Alembic | Relational database modeling with reliable migrations (Neon-compatible). |
| **Infrastructure** | Docker, GitHub Actions | Containerized deployments and automated multi-platform release pipelines. |

---

## 📁 Monorepo Structure

```text
repsi/
├── app/
│   ├── web/             # Next.js frontend application (Web)
│   ├── api/             # FastAPI backend services (Core Logic)
│   ├── mobile/          # Flutter application (iOS & Android)
│   └── desktop/         # Tauri application wrapper (Windows, Mac, Linux)
│
├── packages/            # (Future) Shared utilities and configurations
├── docker/              # Dockerfiles and container configurations
├── docs/                # Architecture diagrams and API documentation
├── .github/workflows/   # CI/CD pipelines for testing and releases
├── .env.example         # Template for environment variables
└── docker-compose.yml   # Local development orchestration
```

---

## 🚀 Getting Started

Follow these instructions to set up the REPSI environment on your local machine.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v20+)
- [Python](https://www.python.org/) (v3.12+) and `uv` package manager
- [Flutter SDK](https://flutter.dev/) (v3.x)
- [Docker & Docker Compose](https://www.docker.com/)
- [Rust](https://www.rust-lang.org/) (for Desktop builds)

### 1. Database & Backend API

Set up your environment variables and start the FastAPI server:

```bash
cd app/api
cp ../../.env.example .env
uv venv .venv
source .venv/bin/activate
uv pip install -e ".[dev]"
uvicorn app.main:app --reload
# API running at: http://localhost:8000
# Swagger Docs: http://localhost:8000/docs
```

### 2. Web Frontend

Start the Next.js development server:

```bash
cd app/web
cp ../../.env.example .env.local
npm install
npm run dev
# Web app running at: http://localhost:3000
```

### 3. Mobile App (Flutter)

Run the native mobile application on an emulator or connected device:

```bash
cd app/mobile
flutter pub get
flutter run
```

### 4. Desktop App (Tauri)

Run the desktop application (requires the web frontend to be running):

```bash
cd app/desktop
npm install
npm run dev
```

### 🐋 Run Everything via Docker

For a frictionless quickstart, run the entire stack (Database, API, Web) using Docker:

```bash
cp .env.example .env
docker compose up --build
```

---

## 📦 Releases & CI/CD

REPSI utilizes highly automated GitHub Actions workflows for continuous integration and deployment.

- **CI Pipeline:** Automatically lints, tests, and verifies builds for all platforms (Web, API, Mobile, Desktop) on every PR and push to `main`.
- **Automated Releases:** Pushing a semantic version tag automatically builds and attaches platform-specific binaries to a GitHub Release.

```bash
git tag v1.0.0
git push origin v1.0.0
```
*This triggers the release workflow, generating `APK` (Android), `EXE/MSI` (Windows), `DEB/AppImage` (Linux), and `DMG` (macOS).*

---

## 🎨 Brand & Design Guidelines

REPSI prioritizes a premium, sleek, and high-contrast visual identity.

- **Primary Accent:** `#84CC16` (Lime Green) — Used sparingly for primary actions and highlights.
- **Typography:** **Inter** for clean, highly legible interfaces.
- **Design Inspiration:** Stripe (developer-centric precision) + Linear (dark-mode elegance and micro-interactions).

---

## 📚 Documentation Directory

Deep dive into the technical details of the platform:

| Document | Description |
|---|---|
| [**Architecture Overview**](docs/architecture.md) | High-level system architecture, deployment strategy, and design decisions. |
| [**API Reference**](docs/api.md) | Detailed REST API endpoints, authentication flow, and payload schemas. |
| [**Database Schema**](docs/database.md) | Entity relationship diagrams and core table structures. |
| [**Design System**](docs/design-system.md) | UI components, design tokens, responsive guidelines, and accessibility. |

---

## 📄 License

**Proprietary Software** — All rights reserved. 
Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited.

# REPSI SaaS and revenue plan

## What the project does today

REPSI is a multi-tenant gym-management product aimed at gym owners, staff,
trainers, and members. It is designed to be the operating system for a fitness
business rather than a consumer workout app.

The product currently contains four clients:

| Surface | Technology | Intended use |
| --- | --- | --- |
| Web app | Next.js / React | Owner, staff, trainer, member, and super-admin dashboards |
| API | FastAPI / SQLAlchemy | Authentication, tenant-scoped business data, and REST API |
| Mobile app | Flutter | Native member/staff experience for iOS and Android |
| Desktop app | Tauri | Desktop wrapper around the deployed web application |

Its central entity is a **workspace**: one gym or business. Users are attached
to workspaces with roles, and core records carry a `workspace_id`. This is the
right foundation for selling to multiple independent gyms without mixing their
data.

### Functionality that is materially present

- Email/password and Google sign-in flows, registration OTP endpoints, and
  workspace creation.
- Workspace-scoped member records, membership plans, payments, expenses,
  attendance, workouts, trainers, classes, machines, dashboards, and invitations.
- QR/manual/biometric-style attendance interfaces and a hardware-ingest route.
- Owner/staff workspace screens plus trainer and member-oriented web screens.
- A polished marketing site, pricing page, onboarding flow, dashboards, and
  super-admin views.
- API tests focused on health and tenant isolation, Docker configuration, and
  CI definitions for web, API, mobile, and desktop builds.

### What is still a prototype or needs completion before selling

The UI and marketing copy are notably ahead of the operational backend. Do not
promise features merely because a screen, route, model, or pricing-table row
exists.

- Payments currently record a payment as successful; there is no payment
  gateway, webhook verification, subscription billing, retries, refunds, or
  reconciliation.
- Membership plans exist, but membership purchase, renewal, expiry automation,
  dunning, invoices, and tax/GST workflows are incomplete.
- Classes can be created/listed, but member booking, capacity/waitlist logic,
  cancellations, and no-show rules are not implemented end-to-end.
- Reports return fixed sample report metadata rather than generated/downloadable
  reports. Several marketing routes are lightweight placeholder pages.
- The biometric route describes device validation but does not actually validate
  `X-Device-Token`; it also uses a phone field as a biometric-hash lookup. It
  must not be used with real biometric data in its present form.
- The mobile project has real structure and API clients, but some member
  experiences still use mock fallback data. The desktop app is a wrapper, not
  a separate offline-capable product.
- Onboarding stores much of its state in browser storage and the server's
  onboarding-complete endpoint currently only acknowledges the request.
- No SaaS subscription, entitlements, trial, billing-account, usage-metering,
  or feature-flag data model exists yet. The public pricing page is therefore
  presentation only.

## Best initial customer and positioning

Start narrow: independent and small-chain gyms in India with roughly 100–1,500
active members. They have clear renewal and attendance pain, can buy quickly,
and fit the INR pricing already shown in the product.

Positioning:

> REPSI helps gym owners collect renewals on time, run a fast front desk, and
> see exactly where revenue is leaking—without juggling registers, WhatsApp,
> spreadsheets, and separate apps.

Do not lead with "all-in-one gym operating system" until the core is proven.
Lead with a measurable result: **more paid renewals and less reception work**.

## Revenue model

### 1. Subscription plans (primary recurring revenue)

Keep the existing Starter / Growth / Pro / Business shape, but simplify the
first launch offer and attach each plan to enforceable usage rules.

| Plan | Suggested India monthly price | Primary buyer | Enforceable value boundary |
| --- | ---: | --- | --- |
| Starter | ₹999 | Single-location gym starting digitally | 250 active members; QR check-in; member and payment ledger |
| Growth | ₹2,499 | Growing gym | 1,500 active members; automated renewal messaging; classes; expense reporting |
| Pro | ₹4,999 | Established club | Unlimited members; advanced permissions; trainer/PT commissions; API/export |
| Business | From ₹9,999 per organisation + location fee | Chains and franchises | Multi-location controls, SSO, SLA, branded member app, implementation |

Offer annual billing at 15–20% off. The current ₹699 / ₹1,499 / ₹2,499 / ₹4,999
figures are reasonable as an early-adopter or first-year offer; avoid a
permanent 3-month-free default because it delays learning about willingness to
pay. A 14-day trial that requires a card only after product-market fit is safer.

### 2. Payments revenue (once the payment flow is real)

Integrate a regulated India-capable payment provider and charge either:

- the provider's standard fee passed through, plus a transparent 0.25–0.50%
  platform fee; or
- no take rate on Starter, then a lower processing fee on Growth+.

This becomes meaningful only when REPSI owns the renewal flow and can prove it
improves collection rate. Never mark a payment paid until a verified provider
webhook has been processed.

### 3. High-margin add-ons

Add these only after the core subscription is dependable:

- WhatsApp/SMS message credits with a margin over delivery cost.
- One-time data migration and onboarding: ₹10,000–₹50,000, based on member
  count and data cleanliness.
- Hardware integration/setup: a fixed installation fee plus device support per
  terminal.
- White-label member app: setup fee plus ₹2,000–₹10,000/month.
- Multi-location analytics, custom exports, API access, and accounting
  integrations as Pro/Business add-ons.
- Professional-services package for franchise rollout and staff training.

Avoid ads, selling member data, or making consumer members the first payer.
They damage trust and distract from the B2B owner relationship.

## The revenue-critical product loop

Build this sequence before broad feature expansion:

```text
Gym signs up → imports members → configures plans → collects/checks-in
members → sends renewal reminders → payment is verified → owner sees saved
revenue and due list → gym renews REPSI subscription
```

The core MVP should make the first four steps work during an assisted setup in
under one hour. A gym should see its first reliable member/payment/attendance
data in its first day.

## Priority roadmap

### Phase 0 — make it safe to pilot (weeks 1–3)

1. Freeze the launch scope to member management, membership lifecycle,
   attendance, payment collection, renewal reminders, and basic owner reports.
2. Move all secrets to deployment-managed environment variables. Remove the
   default production-capable signing key and fail startup in production when
   it is missing.
3. Use secure, HttpOnly, Secure cookies or another carefully designed token
   strategy. The current JavaScript-readable cookie and `localStorage` token
   make an XSS incident more damaging.
4. Enforce permissions server-side for every write operation. At present,
   tenant scoping is a strong start, but many routes do not visibly check that
   a caller's role may create, update, or delete the resource.
5. Remove default member passwords based on phone numbers. Use an invite/set-
   password flow and rate-limit authentication and OTP endpoints.
6. Replace database `create_all` production initialization with Alembic
   migrations, backups, restore drills, and a production PostgreSQL setup.
7. Use integer minor units or `Decimal` for money, not floating-point columns.
8. Disable or fully secure biometric/device ingestion until devices have
   individually provisioned credentials, signed requests, replay protection,
   audit logs, and a lawful biometric-data design.

**Exit criterion:** 3–5 design-partner gyms can use the core workflow with no
cross-tenant access, payment-state errors, or manual database repair.

### Phase 1 — sell the core workflow (weeks 4–8)

1. Add CSV import, duplicate detection, import preview, and rollback for
   members, plans, balances, and expiry dates. Migration is a sales feature.
2. Implement real membership creation/renewal/freeze/cancel flows and a daily
   expiry/due job.
3. Integrate one payment provider with checkout links, signed webhook handling,
   idempotency keys, refunds, receipts/invoices, and reconciliation.
4. Integrate WhatsApp first, with consent tracking and templates for due,
   expiry, failed payment, and welcome messages. Keep SMS as fallback.
5. Make the owner dashboard answer: "who owes money, who is expiring, what was
   collected today, and what should staff do next?"
6. Instrument activation, imports, reminders sent, payment conversion, and
   weekly owner activity.
7. Add a self-serve billing portal, trials, plan enforcement, and failed
   REPSI-subscription handling before turning on public self-serve checkout.

**Exit criterion:** a pilot gym can import, collect a real payment, issue a
receipt, send a consented reminder, and reconcile the result without founder
intervention.

### Phase 2 — improve retention and expand ARPU (months 3–6)

1. Deliver class booking, capacity, waitlist, cancellation, and no-show
   behavior as one coherent feature.
2. Add trainer workflows only if pilots use them: assigned members, routines,
   client notes, PT package sales, and commissions.
3. Add device integrations by certifying one hardware vendor at a time.
4. Launch multi-location reporting and franchise controls for Business.
5. Add accounting exports/integrations based on actual customer demand.
6. Mature mobile around member self-service: QR, bookings, payments, and
   workout delivery. Do not split the team across all platforms prematurely.

## Go-to-market plan

### First 10 customers

- Recruit 5 design partners through local gym-owner networks, equipment
  vendors, trainers, and direct visits. Choose gyms with an existing pain point
  around renewals, not only friendly early adopters.
- Charge a discounted but non-zero amount from the first pilot. Free users give
  weak pricing signals. Offer white-glove migration and a founder channel in
  return for weekly feedback and a case study.
- Run a 30-minute implementation call: import data, set plans, configure
  payment/reminder templates, train reception, and schedule a 7-day check-in.
- Capture before/after numbers: overdue renewals, collection rate, staff time
  to check in a member, and days to activate a new member.

### Repeatable acquisition channels

1. Referral partners: gym consultants, equipment/turnstile vendors, and
   accountants. Pay a recurring referral share for 6–12 months or a fixed
   bounty after the customer pays.
2. Location-specific search pages and practical content: "gym management
   software in [city]", renewal-reminder templates, and migration checklists.
3. Short owner-focused demos showing payment recovery and front-desk speed,
   not generic feature tours.
4. Customer proof: anonymized collection uplift and onboarding stories first;
   named case studies once permitted.

Avoid paid acquisition until pilots establish activation and retention. Otherwise
the cost of sales will hide a product problem.

## Metrics to manage weekly

| Metric | Why it matters | Early target |
| --- | --- | --- |
| Activated workspaces | Imported members + plans + first attendance/payment | >60% within 7 days |
| Time to first value | Measures onboarding friction | <1 day with assisted setup |
| Weekly active owner/staff | Indicates operational dependence | >70% of paying gyms |
| Renewal reminder conversion | Direct proof of the main value proposition | Establish pilot baseline, then improve |
| Payment reconciliation accuracy | Trust requirement | 100% verified events matched |
| Logo churn / revenue churn | SaaS health | Track from customer 1 |
| Net revenue retention | Whether upgrades/add-ons offset churn | >100% after add-ons launch |
| Gross margin | Ensures messages, support, and payment costs are sustainable | >75% subscription gross margin |

Track MRR, trial-to-paid conversion, CAC, and LTV only after the event data is
reliable. Do not calculate LTV from assumptions.

## Honest marketing changes needed before launch

The marketing site should state only what customers can buy and use today.
Until implemented, remove or label as "coming soon" claims about automated
billing retries, recurring auto-debit, hardware/turnstile integration, custom
white-label apps, Tally/QuickBooks sync, GST exports, churn prediction, and
SLA guarantees. A smaller, true promise will sell better than a broad promise
that fails during a demo.

Add these public pages before self-serve sales:

- Terms of service, privacy policy, cancellation/refund policy, and data
  processing terms.
- Security and data-handling page, including backup, incident, and retention
  practices.
- Support/contact ownership, uptime/status page, and an accurate integration
  directory.
- A clear India tax invoice/GST policy once a payments and invoicing flow is
  live.

## Suggested sequencing decision

Build **web-first for gym operators**, with mobile restricted to member QR,
payments, bookings, and workout consumption. The web app is the fastest way to
validate the operating workflow; mobile and desktop should follow the revenue-
producing core rather than become parallel products to maintain.

## Validation notes

This review is based on the repository contents as inspected on 2026-09-14,
including source routes, models, tests, Docker, and CI configuration. No
existing in-progress source changes were modified. Automated verification was
not run in this environment because the Node package manager is unavailable
(`npm` is not installed on the current PATH).

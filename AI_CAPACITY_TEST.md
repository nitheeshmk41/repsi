# AI_CAPACITY_TEST.md
## Purpose

Perform an authorized capacity and load test of REPSI to establish:

1. How many test accounts can be created before a defined application, plan, or infrastructure limit is reached.
2. How many authenticated users can use the website concurrently while it remains stable.
3. Which component becomes the bottleneck: frontend, API, authentication, database, VPS CPU/RAM, connection pools, or third-party services.

This file is a test plan and execution prompt. Do not begin an unrestricted stress test automatically.

## Authorization and safety requirements

- Test only a staging environment, or production with explicit authorization and a maintenance/monitoring plan.
- Confirm the exact target URL and that it belongs to REPSI before running any test.
- Never test third-party systems or unrelated domains.
- Do not store credentials in this file, source code, terminal history, logs, screenshots, or test reports.
- Provide credentials through environment variables or a secret manager. Use a dedicated test owner account where possible.
- Do not create unlimited accounts or run at unlimited concurrency. Use configurable caps and increase them in controlled stages.
- Do not bypass subscription limits, tenant isolation, rate limits, authentication, or other application controls. Record expected limit responses as test results.
- Use synthetic test data and clearly mark test accounts. Avoid real member data, real payment actions, live OTP/SMS/WhatsApp sends, emails, and other billable side effects.
- If testing production, coordinate a test window and ensure a rollback/recovery plan exists.
- Stop immediately if the service becomes unhealthy, real users are affected, or any stop condition below is met.

## Test configuration

Set these values before execution; do not guess them.

- `BASE_URL`: the approved REPSI website URL.
- `API_BASE_URL`: the approved API base URL.
- `OWNER_EMAIL`: owner test-account email.
- `OWNER_PASSWORD`: supplied securely through an environment variable or secret manager.
- `ENVIRONMENT`: `staging` or explicitly approved `production`.
- `MAX_TEST_ACCOUNTS`: a conservative, explicit upper bound.
- `MAX_CONCURRENCY`: a conservative, explicit upper bound.
- `RAMP_STEP`: number of virtual users added per stage.
- `STAGE_DURATION_SECONDS`: duration of each load stage.
- `REQUEST_RATE_LIMIT`: maximum request rate for the test harness.
- `TEST_TENANT_ID`: the authorized tenant/workspace for synthetic data.

If any essential value is missing, ask for it before running tests. Do not print secret values.

## Phase 1 — Reconnaissance and baseline

1. Confirm environment, target host, ownership, and authorization.
2. Identify the frontend framework, API routes, authentication flow, database, deployment topology, and relevant rate limits from repository/configuration documentation.
3. Identify the existing plan limits and account creation rules. Do not assume the owner can exceed them.
4. Check that monitoring is available for:
   - API request rate, latency, and HTTP status codes
   - CPU, RAM, swap, disk space, and network
   - Application worker/process count and restarts
   - Database connections, query latency, pool saturation, and errors
   - Reverse proxy / load balancer errors
5. Run a small baseline test with one test account and low request volume.
6. Record baseline latency, error rate, and resource usage before increasing load.

## Phase 2 — Account creation capacity

Use the owner test account only to create synthetic users in the authorized test tenant.

1. Determine the supported user-creation API or UI flow from the application itself. Do not invent endpoints or bypass validation.
2. Create accounts in small batches, with a delay between batches.
3. Use unique synthetic emails/identifiers and secure, generated test passwords. Do not use real people's information.
4. Record each batch's attempted, successful, rejected, and failed creations.
5. Capture HTTP status codes and safe error messages, excluding credentials, tokens, personal data, and secrets.
6. Distinguish between:
   - Expected plan/user-limit rejection
   - Validation or duplicate-identifier errors
   - Authentication/authorization failures
   - Rate limiting
   - Application/server errors (5xx)
   - Database or infrastructure failures
7. Stop at `MAX_TEST_ACCOUNTS`, the configured plan limit, or a stop condition—whichever comes first.
8. Do not keep retrying failed requests aggressively. Use bounded retries only for clearly transient failures.
9. Verify a sample of created users can authenticate and belong to the intended tenant.
10. Record cleanup steps and remove synthetic accounts after testing where safe and supported.

**Required account-capacity outputs**

- Total attempted and successfully created accounts
- First observed failure and its status/reason
- Whether the failure was an expected business/plan limit or an unexpected technical failure
- Account creation rate and latency (median, p95, p99 if available)
- API/database/resource observations
- Cleanup status

## Phase 3 — Concurrent authenticated access

Use the synthetic accounts created in Phase 2. Do not use the owner account for all virtual users.

### User journey

Model realistic, read-focused website usage based on actual REPSI screens and routes:

1. Open the login page.
2. Authenticate using a test user's own credentials.
3. Load the post-login dashboard.
4. Navigate to permitted, read-only pages such as member lists, attendance views, schedules, or analytics where available.
5. Refresh or revisit pages at realistic intervals.
6. Log out when the scenario completes, if logout is part of the normal flow.

Inspect the app and API first to determine the correct routes and user roles. Do not guess endpoints. Do not trigger real payments, OTP sends, bulk messages, or destructive operations during the load test.

### Controlled ramp-up

Start with a low concurrency and increase gradually, for example:

- Baseline: 1–2 virtual users
- Stage 2: 5 virtual users
- Stage 3: 10 virtual users
- Stage 4: 20 virtual users
- Stage 5: 40 virtual users
- Continue only if the previous stage is healthy and the configured `MAX_CONCURRENCY` has not been reached.

These are example stages, not a claim that the current VPS can support them. Adjust the sequence to the approved cap and observed capacity. Keep request rate bounded; simultaneous users must not mean uncontrolled request flooding.

For every stage:
- Ramp users gradually rather than starting all at once.
- Hold the stage for `STAGE_DURATION_SECONDS`.
- Measure response times, throughput, errors, authentication failures, and resource use.
- Confirm the application returns to baseline after the stage.
- Proceed only when the previous stage passes the acceptance criteria.

## Phase 4 — Acceptance criteria and stop conditions

Agree on thresholds before execution. If no project-specific SLO exists, use these conservative provisional criteria and clearly label them as provisional:

- HTTP 5xx rate remains below 1% during a steady stage.
- p95 latency remains below 2 seconds for ordinary read requests, where practical.
- No sustained CPU saturation, memory exhaustion, swap thrashing, or repeated process restarts.
- Database connection pools remain below saturation and query latency does not rise continuously.
- No cross-tenant data exposure, role/permission bypass, or authentication/session mix-up.
- The system returns toward baseline after each stage.

Stop the test immediately if any of the following occurs:
- Any real customer is impacted or a production owner requests a stop.
- Error rate reaches 5% over a rolling 1-minute window.
- p95 latency exceeds 5 seconds for 2 consecutive minutes.
- Memory reaches 90% of available RAM, the system begins sustained swapping, or the API is repeatedly restarted.
- Database connections are exhausted, the database becomes unhealthy, or data integrity issues appear.
- Any unexpected cross-tenant data access, leaked credentials/tokens, or security issue is observed.
- The configured account, concurrency, request-rate, duration, or time limit is reached.

Use monitoring to verify thresholds; do not rely only on client-side results.

## Phase 5 — Reporting

Create a report with:

1. Test date/time and timezone
2. Environment and target host (no secrets)
3. Software/deployment version, instance size, and relevant configuration
4. Account creation results and first failure reason
5. A stage-by-stage concurrency table with:
   - Virtual users
   - Duration
   - Request count and throughput
   - p50/p95/p99 latency
   - HTTP 2xx/3xx/4xx/5xx counts
   - Timeout and authentication-failure counts
   - Peak CPU/RAM and database connection usage
6. Bottleneck diagnosis supported by observed evidence
7. Recommended fixes ranked by impact and effort
8. The highest **tested stable concurrency**, clearly distinguished from theoretical maximum capacity
9. Limitations and untested paths
10. Cleanup and recovery confirmation

Do not claim a maximum capacity unless the test reached a controlled failure boundary or the configured cap. If the cap is reached while healthy, report “at least N concurrent users under this test profile,” not “maximum N users.”

## Suggested test tooling

Choose a tool already compatible with the project and environment:

- **Locust**: useful for Python-based user journeys and authenticated API workflows.
- **k6**: useful for scriptable HTTP load tests and percentile-based reporting.
- **Playwright**: useful for validating browser journeys; use a limited number of real browser instances and pair it with an API load tool for scale.

Do not use a browser automation tool to launch unlimited browser instances. Browser tests are expensive; API load tests are generally better for controlled concurrency, with a smaller browser smoke-test sample.

## Final instruction for the AI coding agent

Inspect the REPSI repository and deployment configuration before making changes. Produce a safe, reproducible capacity-test implementation and runbook. First report the proposed targets, test scenarios, limits, required secrets, monitoring prerequisites, and cleanup plan. Do not execute a load test until the target environment, authorization, caps, and stop thresholds are explicitly confirmed. Never print, commit, or write credentials to this file. Do not modify production data or bypass product/tenant limits. After approval, execute the test in bounded stages, stop at the first safety threshold, preserve sanitized results, and provide a factual report with measured evidence.
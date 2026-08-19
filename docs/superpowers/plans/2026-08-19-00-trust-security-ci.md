# Trust, Security, and CI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing CopyScore application buildable, testable, server-authoritative, and safe enough to become the foundation for production work.

**Architecture:** Repair contract drift before adding features, then install test/CI gates, lock Firestore writes, validate AI output, strengthen assessment session integrity, and add operational controls. Preserve existing product behavior unless a behavior is explicitly identified as unsafe.

**Tech Stack:** Next.js 16, React 19, TypeScript 5.9, Firebase/Auth/Firestore, Firebase Admin, Zod, Vitest, Firebase Emulator Suite, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-08-19-copyscore-platform-design.md`

## Global Constraints

- Work from the current repository state; do not rebuild existing architecture.
- Protected mutations are server-authoritative.
- AI output is untrusted until schema validation succeeds.
- Security rules are deny-by-default for protected writes.
- Every behavior change uses test-first development.
- Do not claim live readiness without fresh CI evidence for lint, typecheck, tests, and production build.
- Do not weaken TypeScript types to hide source/UI contract drift.

---

### Task 1: Restore production buildability

**Files:**
- Modify: `app/ai-upscale/page.tsx`
- Move/fix: `app/ai-upscale/%5Bslug%5D/page.tsx` -> `app/ai-upscale/[slug]/page.tsx`
- Modify: `app/ai-upscale/my-stack/page.tsx`
- Modify: `app/ai-upscale/platforms/page.tsx`
- Modify: `components/ai-upscale/CollectionsShowcase.tsx`
- Modify: `components/ai-upscale/CompatibilityMatrix.tsx`
- Modify: `components/ai-upscale/SecurityAccessPanel.tsx`
- Modify: `components/ai-upscale/SubmitResourceModal.tsx`
- Read authority: `lib/types/ai-upscale.ts`
- Read authority: `lib/data/ai-upscale-seed.ts`

**Interfaces:**
- Consumes: canonical `AIResource`, `AICollection`, `AIPlatformMeta`, `AISubmission`, `ResourceType`, `PricingType`, `InstallDifficulty`.
- Produces: UI that compiles against those canonical contracts without compatibility aliases.

- [ ] **Step 1: Capture the failing build evidence**

Run in CI or a disposable environment: `npm run build`.

Expected baseline: TypeScript failures on stale AI Upscale properties such as `sourceUrl`, `PricingModel`, `estimatedTime`, `skillMechanism`, and stale submission values.

- [ ] **Step 2: Fix the dynamic route path**

Rename the encoded `%5Bslug%5D` directory to `[slug]` so Next.js recognizes the route as `/ai-upscale/[slug]`.

- [ ] **Step 3: Align UI to canonical contracts**

Use `resource.source.url`, `PricingType`, `testedVersion`, `nativeTerm`, `officialDocUrl`, `installPatternSummary`, `stepNumber`, and other fields exactly as defined in `lib/types/ai-upscale.ts`.

Remove unsupported select values such as `claude_skill`, `mcp_server`, `zero_install`, `one_command`, `free_open_source`, and `byok` unless they are first added to the canonical domain model with migration evidence.

- [ ] **Step 4: Verify typecheck/build**

Run: `npx tsc --noEmit`
Expected: PASS.

Run: `npm run lint && npm run build`
Expected: PASS and route table includes `/ai-upscale/[slug]`.

- [ ] **Step 5: Commit**

Commit message: `fix(ai-upscale): align UI with canonical resource contracts`

---

### Task 2: Install automated test and CI gates

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `.github/workflows/ci.yml`
- Create: `tests/assessment/answer-integrity.test.ts`
- Create: `tests/assessment/submission-idempotency.test.ts`

**Interfaces:**
- Consumes: existing pure assessment integrity logic and current build scripts.
- Produces: `npm run typecheck`, `npm test`, `npm run test:run`, CI status on every PR and push to `main`.

- [ ] **Step 1: Write failing tests around existing assessment invariants**

Cover: wrong question rejected, duplicate question rejected, completed session rejected, valid active question accepted, final submission retry returns the original result without repeated mutation.

- [ ] **Step 2: Add Vitest configuration and scripts**

Add scripts:

```json
"typecheck": "tsc --noEmit",
"test": "vitest",
"test:run": "vitest run"
```

Use Node test environment and include `tests/**/*.test.ts`.

- [ ] **Step 3: Add GitHub Actions**

CI jobs run clean install, lint, typecheck, test:run, and build on Node 24. Use the repository lockfile strategy consistently; do not generate a competing lockfile.

- [ ] **Step 4: Verify CI**

Expected: workflow completes with zero failed jobs before the task is closed.

- [ ] **Step 5: Commit**

Commit message: `test: add regression suite and CI quality gates`

---

### Task 3: Lock Firestore trust boundaries

**Files:**
- Modify: `firestore.rules`
- Create: `tests/firestore/firestore.rules.test.ts`
- Modify/create Firebase emulator configuration only if required by existing project config.

**Interfaces:**
- Consumes: Firebase Auth UID/custom claims and current collection ownership semantics.
- Produces: client rules that cannot forge results, leaderboard entries, challenges, handles, or admin-curated resources.

- [ ] **Step 1: Write failing emulator tests**

Tests must prove the current unsafe rules allow at least these bad paths before the fix: anonymous result/challenge writes, authenticated arbitrary leaderboard writes, authenticated reservation of another user's handle data, anonymous community submission where policy intends authentication.

- [ ] **Step 2: Implement deny-by-default rules**

Rules policy:

- `users/{uid}` owner-only.
- `handles/{handle}` public read; create/update only when document UID equals `request.auth.uid`, with immutable ownership after creation.
- `publicProfiles/{handle}` public read; owner-controlled fields only.
- `leaderboard`, `results`, `challenges` public read where product requires it; direct client write denied. Server Admin SDK owns mutation.
- `aiResources`, `aiCollections` admin write only.
- `userAIStacks/{uid}` owner-only.
- `aiSubmissions` authenticated create with validated submitter UID when present; admin read/update/delete.
- unmatched paths deny.

- [ ] **Step 3: Run emulator rules tests**

Expected: unauthorized cases fail and intended owner/admin/public reads pass.

- [ ] **Step 4: Commit**

Commit message: `security: enforce server-owned Firestore writes`

---

### Task 4: Validate AI evaluator output

**Files:**
- Modify: `app/api/assessment/evaluate/route.ts`
- Create: `lib/ai/evaluation-schema.ts`
- Create: `tests/ai/evaluation-schema.test.ts`

**Interfaces:**
- Produces: `EvaluationResultSchema` with bounded scores and required feedback fields.

- [ ] **Step 1: Write failing schema tests**

Reject malformed JSON shape, scores outside bounds, missing rubric keys, non-boolean `isPassing`, and oversized feedback. Accept a valid model response.

- [ ] **Step 2: Implement Zod output schema**

Parse the model JSON then `safeParse` before returning it. If model output is invalid, record a structured warning and use the deterministic evaluator rather than spreading untrusted data.

- [ ] **Step 3: Remove misleading fallback precision**

Return `evaluationMode` and `confidence` metadata. Deterministic fallback must not imply model-based prediction.

- [ ] **Step 4: Run focused and full tests**

Expected: schema tests pass; CI remains green.

- [ ] **Step 5: Commit**

Commit message: `security(ai): validate evaluator output before use`

---

### Task 5: Bind assessment sessions to ownership and expiry

**Files:**
- Modify: `lib/storage/store.ts`
- Modify: assessment session type files under `lib/types/`
- Modify: `app/api/assessment/start/route.ts`
- Modify: `app/api/assessment/next/route.ts`
- Modify: `app/api/assessment/submit/route.ts`
- Create: focused session policy tests.

**Interfaces:**
- Session gains `ownerUid?: string`, `createdAt`, `expiresAt`, and explicit guest ownership token semantics if guest assessments remain supported.

- [ ] **Step 1: Write failing ownership tests**

Authenticated user B cannot advance/finalize user A session. Expired sessions cannot mutate. Guest ownership cannot be claimed by knowing only a session ID.

- [ ] **Step 2: Implement server-owned session policy**

Bind authenticated sessions to UID. For guests, issue a high-entropy HttpOnly ownership token or equivalent server-verifiable secret separate from the public session ID.

- [ ] **Step 3: Add explicit expiration**

Expired sessions return a stable API error code that the client can map to restart/recovery UX.

- [ ] **Step 4: Verify**

Run focused tests, full suite, lint, typecheck, build.

- [ ] **Step 5: Commit**

Commit message: `security(assessment): bind sessions to owners and expiry`

---

### Task 6: Replace weak score verification primitive

**Files:**
- Modify: score calculation/signature module under `lib/engine/`.
- Modify: `.env.example`.
- Create: signature tests.

**Interfaces:**
- Produces: HMAC-SHA256 signature using `COPYSCORE_SIGNING_SECRET` and canonical payload serialization.

- [ ] **Step 1: Write failing tests**

Same canonical payload plus same secret returns same signature. Changed payload fails verification. Missing secret fails closed in production.

- [ ] **Step 2: Implement HMAC**

Use Node `crypto.createHmac('sha256', secret)`. Include assessment ID, final score, completion timestamp, and scorer version in canonical payload.

- [ ] **Step 3: Document environment requirement**

Add `COPYSCORE_SIGNING_SECRET=` to `.env.example` without a real secret.

- [ ] **Step 4: Verify and commit**

Commit message: `security: sign verified scores with server HMAC`

---

### Task 7: Rate limiting, audit events, and safe logging

**Files:**
- Create: `lib/platform/rate-limit/`
- Create: `lib/platform/audit/`
- Modify: AI and assessment mutation routes.
- Create: policy tests.

**Interfaces:**
- `checkRateLimit(key, policy)` returns allow/deny plus retry metadata.
- `writeAuditEvent(event)` records action, actor, target, correlation ID, outcome, and non-sensitive metadata.

- [ ] **Step 1: Test policy boundaries**

Cover per-user and per-IP guest limits, retry-after behavior, and redaction of raw copy/email/token values from audit metadata.

- [ ] **Step 2: Protect expensive/abusable endpoints**

At minimum: AI evaluation, assessment start/next/submit, auth handle checks, and community submission.

- [ ] **Step 3: Add correlation IDs**

Return/request a correlation ID so production errors can be traced without logging private request bodies.

- [ ] **Step 4: Verify and commit**

Commit message: `feat(platform): add rate limits and audit events`

---

### Task 8: Live-readiness verification report

**Files:**
- Create: `docs/operations/live-readiness.md`

- [ ] **Step 1: Record exact CI evidence**

Document workflow URL/run ID, lint/typecheck/test/build outcomes, rules test outcomes, known dependency advisories, required production environment variables, rollback steps, and remaining blockers.

- [ ] **Step 2: No false green status**

Mark each requirement `PASS`, `BLOCKED`, or `DEFERRED WITH ACCEPTED RISK`. Do not use `PASS` without executable evidence.

- [ ] **Step 3: Commit**

Commit message: `docs: add evidence-based live readiness gate`

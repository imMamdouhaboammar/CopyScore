# Learning, Governance, and Integrations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn assessment evidence, real-work findings, and experiment outcomes into targeted learning while adding the governance and integration controls required for a durable production product.

**Architecture:** Learning signals are append-only evidence events. Derived skill profiles are recomputed from signals rather than manually edited truth. External integrations enter through explicit adapters and normalized import contracts.

**Tech Stack:** Next.js 16, TypeScript, Firebase Admin/Firestore, Zod, Vitest, external APIs only through server adapters.

**Spec:** `docs/superpowers/specs/2026-08-19-copyscore-platform-design.md`

## Global Constraints

- Do not claim psychometric validity beyond empirical evidence.
- Do not mix assessment scores from incompatible scorer versions without migration/calibration rules.
- External credentials are server-only.
- Every integration has connection status, last successful sync, failure reason, and revocation path.
- Users can inspect why a learning recommendation exists.

---

### Task 1: Learning signal domain

**Files:**
- Create: `lib/domains/learning/types.ts`
- Create: `lib/domains/learning/schema.ts`
- Create: `lib/domains/learning/service.ts`
- Test: `tests/domains/learning-signals.test.ts`

**Interfaces:**
- Signal sources: `assessment`, `evaluation`, `experiment`, `manual_review`.
- Signal fields: userId, workspaceId?, projectId?, competency, direction `strength|weakness`, weight, confidence, sourceRef, sourceVersion, createdAt.

- [ ] Test evidence/source requirements and confidence bounds.
- [ ] Keep signals immutable; corrections create superseding signals.
- [ ] Commit: `feat(learning): add evidence-backed learning signals`.

---

### Task 2: Derived skill profile

**Files:**
- Create: `lib/domains/learning/profile.ts`
- Test: `tests/domains/skill-profile.test.ts`

**Interfaces:**
- `buildSkillProfile(signals, policyVersion)` returns competency summaries with evidence counts, confidence, recency, and source mix.

- [ ] Prevent one low-confidence AI finding from dominating repeated human/performance evidence.
- [ ] Keep assessment and production-work evidence distinguishable in the UI.
- [ ] Version weighting policy.
- [ ] Commit: `feat(learning): derive transparent skill profiles`.

---

### Task 3: Practice mission generator

**Files:**
- Create: `lib/domains/learning/missions.ts`
- Create: practice API route.
- Test: mission selection tests.

**Interfaces:**
- Mission selects a competency, scenario type, difficulty, and evidence-backed reason.

- [ ] Generate from a curated scenario bank first; do not depend on AI for basic availability.
- [ ] AI may customize context only after schema validation.
- [ ] Avoid repeating recently completed scenario patterns.
- [ ] Commit: `feat(learning): add targeted practice missions`.

---

### Task 4: Learning UI

**Files:**
- Create: `/app/[workspaceId]/insights/learning/page.tsx` or equivalent user-level surface.
- Create: `components/learning/SkillProfile.tsx`
- Create: `components/learning/EvidenceDrawer.tsx`
- Create: `components/learning/PracticeMissionCard.tsx`

- [ ] Show recurring behaviors such as weak proof hierarchy or low message continuity with supporting examples.
- [ ] Link every recommendation to source evidence.
- [ ] Avoid generic congratulatory or shaming language.
- [ ] Commit: `feat(learning): add evidence-linked learning experience`.

---

### Task 5: Governance controls

**Files:**
- Create: `lib/platform/governance/`
- Create: admin configuration surfaces under existing `/admin`.
- Test: policy tests.

**Interfaces:**
- Version registry for rubrics, evaluator prompts, deterministic rule sets, scoring policies, and experiment decision policies.

- [ ] Admin can activate a new version without rewriting historical runs.
- [ ] Historical records retain the version used.
- [ ] Sensitive configuration changes emit audit events.
- [ ] Commit: `feat(governance): version evaluation and scoring policies`.

---

### Task 6: Privacy export and deletion maturity

**Files:**
- Extend: existing account privacy/deletion routes and UI.
- Create: export service and tests.
- Create/update: `docs/operations/data-lifecycle.md`.

- [ ] Define ownership and retention for workspace content versus personal account data.
- [ ] Export user profile, assessments, saved AI stack, authored workspace objects, and learning signals where policy permits.
- [ ] Deletion is idempotent and reports partial failures safely.
- [ ] Never delete shared workspace content owned by an organization merely because one member leaves.
- [ ] Commit: `feat(privacy): add auditable data export and deletion policy`.

---

### Task 7: Integration adapter contract

**Files:**
- Create: `lib/integrations/types.ts`
- Create: `lib/integrations/registry.ts`
- Test: adapter contract tests.

**Interfaces:**
- Adapter methods: `connect`, `disconnect`, `getStatus`, `sync`, `normalizeEvidence` as applicable.
- Connection stores provider, workspace, scopes, credential reference, status, lastSyncAt, lastErrorCode.

- [ ] Credentials never enter client-visible Firestore documents.
- [ ] Integration failures use stable error codes and backoff.
- [ ] Commit: `feat(integrations): define safe provider adapters`.

---

### Task 8: First evidence integrations

**Files:**
- Add one or two adapters only after core workflow is stable, prioritizing GA4/Search Console or CSV/manual sources based on user demand.
- Create provider-specific tests using fixtures.

- [ ] Import data into normalized research/performance objects rather than leaking provider schemas through the app.
- [ ] Show source and sync time beside imported evidence.
- [ ] Add explicit disconnect/revoke UX.
- [ ] Commit per provider, e.g. `feat(integrations): add GA4 performance import`.

---

### Task 9: Release governance

**Files:**
- Create: `docs/operations/release-process.md`
- Extend: GitHub Actions with release gate after CI is stable.

- [ ] Define staging, production environment variables, migration/rules deployment order, smoke checks, rollback, and incident owner.
- [ ] Production deployment cannot bypass failed quality/security gates.
- [ ] Create release notes from verified changes, not planned changes.
- [ ] Commit: `docs: define production release governance`.

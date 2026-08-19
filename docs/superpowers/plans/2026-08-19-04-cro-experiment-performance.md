# CRO Experiment and Performance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect copy decisions to hypotheses, experiments, and real performance evidence so CopyScore can learn from outcomes instead of model opinion alone.

**Architecture:** Hypotheses reference research/evaluation evidence. Experiments reference exact copy versions. Performance snapshots are immutable observations imported manually or through CSV first; integrations come later.

**Tech Stack:** Next.js 16, TypeScript, Firebase Admin/Firestore, Zod, Vitest.

**Spec:** `docs/superpowers/specs/2026-08-19-copyscore-platform-design.md`

## Global Constraints

- No invented statistical significance.
- Raw performance evidence and source metadata are retained.
- Experiments target immutable variant/version IDs.
- Manual data entry is valid when clearly labeled; do not imply direct platform integration before it exists.

---

### Task 1: Hypothesis domain

**Files:**
- Create: `lib/domains/experiments/hypothesis-types.ts`
- Create: `lib/domains/experiments/hypothesis-schema.ts`
- Create: hypothesis service/API routes.
- Test: `tests/domains/hypotheses.test.ts`

**Interfaces:**
- Fields: observation, evidenceRefs, problem, proposedChange, expectedBehaviorChange, primaryMetric, businessMetric?, priority, status, createdBy.

- [ ] Test required evidence and invalid metric definitions.
- [ ] Support status: `backlog`, `planned`, `running`, `won`, `lost`, `inconclusive`, `archived`.
- [ ] Commit: `feat(growth): add evidence-linked hypotheses`.

---

### Task 2: Experiment and variant contracts

**Files:**
- Create: `lib/domains/experiments/types.ts`
- Create: `lib/domains/experiments/schema.ts`
- Create: service/repository/API routes.
- Test: `tests/domains/experiments.test.ts`

**Interfaces:**
- Experiment contains hypothesisId, metric definitions, start/end timestamps, traffic/context notes, status.
- Variant contains label, copyVersionId, role `control|treatment`, externalReference?.

- [ ] Reject variants that reference mutable asset IDs without version IDs.
- [ ] Require exactly one control for standard A/B mode.
- [ ] Commit: `feat(growth): add version-linked experiments`.

---

### Task 3: Performance snapshot model

**Files:**
- Create: `lib/domains/performance/types.ts`
- Create: `lib/domains/performance/schema.ts`
- Create: performance service/API routes.
- Test: `tests/domains/performance.test.ts`

**Interfaces:**
- Snapshot fields include experimentId, variantId, sourceType, sourceLabel, periodStart, periodEnd, visitors/impressions?, conversions?, revenue?, metricValues, importedAt, importedBy, notes?.

- [ ] Validate non-negative counts and coherent date ranges.
- [ ] Preserve source provenance and import timestamp.
- [ ] Commit: `feat(growth): add performance evidence model`.

---

### Task 4: Manual result entry and CSV import

**Files:**
- Create: `lib/domains/performance/csv.ts`
- Create: import route.
- Create: `components/growth/PerformanceImport.tsx`
- Test: CSV parser and validation fixtures.

- [ ] Define a documented CSV template with explicit variant and metric mapping.
- [ ] Reject unknown variant IDs and partial malformed rows atomically unless dry-run mode is selected.
- [ ] Provide preview/dry-run before persistence.
- [ ] Commit: `feat(growth): add safe performance imports`.

---

### Task 5: Experiment decision service

**Files:**
- Create: `lib/domains/experiments/decision.ts`
- Test: `tests/domains/experiment-decision.test.ts`

**Interfaces:**
- Produces evidence summary and user-entered/factually computed decision support, not a fake significance claim.

- [ ] For simple binary conversion counts, calculate transparent rate deltas and sample counts.
- [ ] Do not label a result statistically significant until a vetted statistical method is implemented and its assumptions are met.
- [ ] Permit manual decision with rationale: promote, keep control, iterate, inconclusive.
- [ ] Commit: `feat(growth): add evidence-based experiment decisions`.

---

### Task 6: Growth Lab UI

**Files:**
- Create: `/app/[workspaceId]/projects/[projectId]/experiments/page.tsx`
- Create: experiment detail page.
- Create: `components/growth/HypothesisBoard.tsx`
- Create: `components/growth/ExperimentDetail.tsx`
- Create: `components/growth/PerformanceSummary.tsx`

- [ ] Show observation/evidence before proposed tactic.
- [ ] Show exact copy versions participating in an experiment.
- [ ] Separate raw results from interpretation/decision.
- [ ] Add mobile and empty states.
- [ ] Commit: `feat(growth): add experiment workspace`.

---

### Task 7: Feed outcomes into evaluation calibration

**Files:**
- Create: `lib/domains/performance/learning-signals.ts`
- Create: `lib/engines/calibration/performance-signals.ts`
- Test: calibration signal tests.

- [ ] Create a learning signal when a completed experiment has a recorded decision and sufficient source metadata.
- [ ] Store evaluator predictions that existed before the outcome so later calibration can compare prediction vs result.
- [ ] Never rewrite historical evaluation output after an experiment concludes.
- [ ] Commit: `feat(growth): connect outcomes to evaluator learning signals`.

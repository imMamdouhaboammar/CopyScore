# Copy Studio Product Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the daily working surface for research, briefs, copy assets, versions, comments, and approvals.

**Architecture:** Treat research and briefs as structured upstream evidence. Copy assets store immutable versions; review state and approvals operate on version IDs so historical decisions remain auditable.

**Tech Stack:** Next.js 16, TypeScript, Firebase Admin/Firestore, Zod, Vitest, React client components only where interaction requires them.

**Spec:** `docs/superpowers/specs/2026-08-19-copyscore-platform-design.md`

## Global Constraints

- Workspace authorization applies to every object.
- No destructive overwrite of historical copy versions.
- No AI generation is required for the first Studio slice; human-authored workflows must work independently.
- Research claims retain provenance.
- Review/approval events are auditable.

---

### Task 1: Research Vault domain

**Files:**
- Create: `lib/domains/research/types.ts`
- Create: `lib/domains/research/schema.ts`
- Create: `lib/domains/research/service.ts`
- Create: `app/api/workspaces/[workspaceId]/projects/[projectId]/research/route.ts`
- Test: `tests/domains/research.test.ts`

**Interfaces:**
- `ResearchSource` fields include source type, title, URL/reference, capturedAt, createdBy.
- `ResearchInsight` includes sourceId, exactQuote?, interpretation, tags, audienceContext?, confidence?, createdBy.

- [ ] Write failing tests for provenance requirements and cross-project references.
- [ ] Implement source/insight create/list/update/archive operations.
- [ ] Verify and commit: `feat(studio): add research vault domain`.

---

### Task 2: Structured brief domain

**Files:**
- Create: `lib/domains/briefs/types.ts`
- Create: `lib/domains/briefs/schema.ts`
- Create: `lib/domains/briefs/service.ts`
- Create: brief API routes.
- Test: `tests/domains/briefs.test.ts`

**Interfaces:**
- Brief fields: objective, audience, awarenessStage, funnelStage, offer, problem, trigger, desiredOutcome, objections, proof, channel, cta, constraints, complianceNotes, successMetrics, evidenceRefs.

- [ ] Write failing tests for missing objective/audience/channel and invalid evidence references.
- [ ] Add revision metadata so later evaluation can identify the exact brief version used.
- [ ] Verify and commit: `feat(studio): add structured campaign briefs`.

---

### Task 3: Copy asset and immutable version model

**Files:**
- Create: `lib/domains/assets/types.ts`
- Create: `lib/domains/assets/schema.ts`
- Create: `lib/domains/assets/service.ts`
- Create: asset/version API routes.
- Test: `tests/domains/copy-assets.test.ts`

**Interfaces:**
- `CopyAsset` identifies project, campaign?, briefId?, channel, assetType, status, title.
- `CopyVersion` contains assetId, revisionNumber, content, rationale?, parentVersionId?, createdBy, createdAt.

- [ ] Write failing tests proving edits create a new version rather than mutate prior content.
- [ ] Add optimistic concurrency using latest revision/version marker.
- [ ] Support compare, restore-as-new-version, and branch-from-version.
- [ ] Verify and commit: `feat(studio): add versioned copy assets`.

---

### Task 4: Comments, review, and approvals

**Files:**
- Create: `lib/domains/assets/review-types.ts`
- Create: review service and API routes.
- Test: `tests/domains/copy-review.test.ts`

**Interfaces:**
- Review targets a version ID.
- Status flow: `draft -> in_review -> approved | changes_requested`.
- Approval records actor, timestamp, version ID, optional note.

- [ ] Test role permissions and invalid transitions.
- [ ] Prevent an approval from silently moving to a newer unreviewed version.
- [ ] Audit every transition.
- [ ] Commit: `feat(studio): add copy review and approval workflow`.

---

### Task 5: Research and Brief UI

**Files:**
- Create: `/app/[workspaceId]/projects/[projectId]/research/page.tsx`
- Create: `/app/[workspaceId]/projects/[projectId]/brief/page.tsx`
- Create focused components under `components/studio/`.

- [ ] Build source list, insight capture, filtering, and evidence-link interactions.
- [ ] Build structured brief editor with explicit save/revision status.
- [ ] Do not fabricate research or auto-fill unsupported facts.
- [ ] Add empty/loading/error states and mobile layout.
- [ ] Browser-smoke the primary flows and commit: `feat(studio): add research and brief workspace`.

---

### Task 6: Copy Studio UI

**Files:**
- Create: `/app/[workspaceId]/projects/[projectId]/assets/page.tsx`
- Create: `/app/[workspaceId]/projects/[projectId]/assets/[assetId]/page.tsx`
- Create: `components/studio/CopyEditor.tsx`
- Create: `components/studio/VersionPanel.tsx`
- Create: `components/studio/ReviewPanel.tsx`
- Create: `components/studio/ProjectContextPanel.tsx`

- [ ] Desktop layout: project context left, editor center, versions/review right.
- [ ] Mobile layout: task-focused tabs with no horizontal dependency.
- [ ] Autosave may create drafts only if version semantics remain explicit; otherwise use deliberate Save New Version.
- [ ] Show current brief/evidence context beside writing without blocking the editor.
- [ ] Verify accessibility, keyboard flow, smoke tests, and commit: `feat(studio): add daily copy workspace`.

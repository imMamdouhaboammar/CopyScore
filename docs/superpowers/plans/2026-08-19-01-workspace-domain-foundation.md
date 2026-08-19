# Workspace Domain Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the authenticated multi-workspace, brand, project, and campaign foundation required for CopyScore Studio.

**Architecture:** Keep Next.js and Firebase, but move business behavior behind domain services and server authorization policies. Client Firestore access remains limited to explicitly safe reads/preferences.

**Tech Stack:** Next.js 16 App Router, TypeScript, Firebase Auth, Firestore Admin SDK, Zod, Vitest.

**Spec:** `docs/superpowers/specs/2026-08-19-copyscore-platform-design.md`

## Global Constraints

- Phase 0 CI/security gates must be green before this plan is merged.
- Workspace membership is the authorization boundary.
- Do not duplicate account identity data into every business document.
- Domain objects use stable IDs and server timestamps.
- All new mutation routes are authenticated, authorized, schema-validated, and audited.

---

### Task 1: Define canonical workspace domain contracts

**Files:**
- Create: `lib/domains/workspaces/types.ts`
- Create: `lib/domains/workspaces/schema.ts`
- Create: `lib/domains/brands/types.ts`
- Create: `lib/domains/projects/types.ts`
- Create: `lib/domains/campaigns/types.ts`
- Test: `tests/domains/workspace-schemas.test.ts`

**Interfaces:**
- Produces: `WorkspaceRole`, `Workspace`, `WorkspaceMember`, `Brand`, `Project`, `Campaign` and matching Zod schemas.

- [ ] Write failing schema tests for required fields, invalid roles, invalid slugs, malformed timestamps, and cross-entity IDs.
- [ ] Implement minimal schemas and inferred TypeScript types.
- [ ] Run `npm test -- tests/domains/workspace-schemas.test.ts` then full `npm run test:run`.
- [ ] Commit: `feat(workspaces): define domain contracts`.

---

### Task 2: Add workspace repositories and authorization policy

**Files:**
- Create: `lib/domains/workspaces/repository.ts`
- Create: `lib/domains/workspaces/policy.ts`
- Create: `lib/platform/db/firestore-admin.ts` if a shared Admin wrapper does not already exist.
- Test: `tests/domains/workspace-policy.test.ts`

**Interfaces:**
- `getWorkspaceMembership(workspaceId, uid)`
- `requireWorkspaceRole(workspaceId, uid, allowedRoles)`
- `createWorkspace(input, actor)`

- [ ] Write failing tests proving viewer cannot mutate, reviewer cannot administer members, copywriter can edit permitted copy content, owner/admin can manage members.
- [ ] Implement explicit role matrix rather than scattered `if` statements.
- [ ] Verify tests and commit: `feat(workspaces): add membership authorization policy`.

---

### Task 3: Add workspace, brand, project, and campaign APIs

**Files:**
- Create: `app/api/workspaces/route.ts`
- Create: `app/api/workspaces/[workspaceId]/route.ts`
- Create: `app/api/workspaces/[workspaceId]/members/route.ts`
- Create: `app/api/workspaces/[workspaceId]/brands/route.ts`
- Create: `app/api/workspaces/[workspaceId]/projects/route.ts`
- Create: `app/api/workspaces/[workspaceId]/projects/[projectId]/campaigns/route.ts`
- Test: route/service integration tests.

**Interfaces:**
- Consumes session user via existing server auth.
- Produces JSON envelopes with stable error codes: `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_ERROR`, `CONFLICT`.

- [ ] Write failing tests for unauthenticated, unauthorized, valid creation, duplicate slug, and missing parent cases.
- [ ] Implement routes as thin adapters over domain services.
- [ ] Verify full CI and commit: `feat(workspaces): add authenticated project APIs`.

---

### Task 4: Extend Firestore blueprint and rules

**Files:**
- Modify: `firebase-blueprint.json`
- Modify: `firestore.rules`
- Extend: `tests/firestore/firestore.rules.test.ts`

**Interfaces:**
- Adds `/workspaces/{workspaceId}` and nested/reference collections required by the domain model.

- [ ] Write failing emulator tests for cross-workspace access.
- [ ] Add read rules only where client rendering needs them; keep privileged mutation server-owned.
- [ ] Verify emulator tests and commit: `security(workspaces): isolate tenant data`.

---

### Task 5: Build authenticated application shell

**Files:**
- Create: `app/app/[workspaceId]/layout.tsx`
- Create: `app/app/[workspaceId]/page.tsx`
- Create: `app/app/[workspaceId]/projects/page.tsx`
- Create: `components/workspace/AppSidebar.tsx`
- Create: `components/workspace/WorkspaceSwitcher.tsx`
- Create: `components/workspace/ProjectCard.tsx`

**Interfaces:**
- Consumes server-resolved current workspace and membership.
- Produces navigation for Projects, Research, Studio, Experiments, Insights, and Settings.

- [ ] Add route-level authentication/authorization tests where feasible.
- [ ] Implement progressive disclosure with no fake metrics or placeholder analytics.
- [ ] Verify responsive rendering through browser smoke tests once Playwright is available.
- [ ] Commit: `feat(workspaces): add authenticated app shell`.

---

### Task 6: Add onboarding and empty states

**Files:**
- Create: workspace/project creation forms and empty-state components under `components/workspace/`.
- Modify: first-login/account entry point to expose Studio without breaking Assessment.

- [ ] Test successful workspace creation and validation failures.
- [ ] Provide one clear primary action per empty state.
- [ ] Preserve direct access to Benchmark/Assessment.
- [ ] Verify CI and commit: `feat(workspaces): add project onboarding flow`.

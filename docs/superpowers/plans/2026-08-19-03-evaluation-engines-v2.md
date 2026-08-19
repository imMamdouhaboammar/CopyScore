# Evaluation Engines V2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace one-shot opaque grading with a versioned, evidence-aware evaluation pipeline for commercial copy.

**Architecture:** A deterministic/contextual pipeline resolves brief/brand/channel context, runs bounded specialist evaluators, validates all AI output, aggregates findings, and stores reproducible evaluation metadata.

**Tech Stack:** TypeScript, Zod, Firebase Admin, existing Gemini adapter initially, Vitest.

**Spec:** `docs/superpowers/specs/2026-08-19-copyscore-platform-design.md`

## Global Constraints

- Performance evidence outranks evaluator opinion.
- AI output is untrusted until parsed and schema-validated.
- Every evaluation stores versions for engine, rubric, model/prompt, input, brief, and brand profile.
- Findings identify exact text spans when technically possible.
- Do not advertise predicted CTR/CVR without a calibrated dataset.

---

### Task 1: Define evaluation contracts

**Files:**
- Create: `lib/domains/evaluations/types.ts`
- Create: `lib/domains/evaluations/schema.ts`
- Test: `tests/engines/evaluation-contracts.test.ts`

**Interfaces:**
- `EvaluationContext`
- `EvaluationFinding`
- `EvaluationDimensionScore`
- `EvaluationRun`
- `EvaluatorMetadata`

- [ ] Write failing tests for score bounds, severity enum, confidence bounds, evidence references, and engine metadata.
- [ ] Implement Zod schemas and inferred types.
- [ ] Commit: `feat(evaluation): define versioned evaluation contracts`.

---

### Task 2: Context Resolver

**Files:**
- Create: `lib/engines/copy/context-resolver.ts`
- Test: `tests/engines/context-resolver.test.ts`

**Interfaces:**
- `resolveEvaluationContext({ workspaceId, projectId, assetVersionId })` returns copy text plus exact brief, brand, channel, research evidence, and prior performance references allowed for evaluation.

- [ ] Test missing context, stale references, and exact-version resolution.
- [ ] Never silently replace a missing referenced brief/version with the latest object.
- [ ] Commit: `feat(evaluation): resolve copy context deterministically`.

---

### Task 3: Deterministic and channel checks

**Files:**
- Create: `lib/engines/copy/deterministic.ts`
- Create: `lib/engines/channel/index.ts`
- Test: focused rule tests.

**Interfaces:**
- Evaluators return findings, not final global scores.

- [ ] Implement measurable checks first: word/character limits, CTA presence where required, repeated wording, prohibited terminology from brand profile, missing required claim qualifiers, channel constraints.
- [ ] Each rule includes a stable rule ID and version.
- [ ] Commit: `feat(evaluation): add deterministic copy and channel checks`.

---

### Task 4: Brand Voice evaluator

**Files:**
- Create: `lib/domains/brands/voice-types.ts`
- Create: `lib/engines/brand/evaluate.ts`
- Test: `tests/engines/brand-voice.test.ts`

**Interfaces:**
- Brand voice profile supports preferred vocabulary, prohibited vocabulary, voice attributes, product terminology, claim rules, positive examples, negative examples, and regional variants.

- [ ] Test exact prohibited terms and required terminology deterministically.
- [ ] AI-assisted voice judgment may supplement but never override deterministic violations.
- [ ] Commit: `feat(evaluation): add brand voice evaluation`.

---

### Task 5: CRO and commercial copy rubric

**Files:**
- Create: `lib/engines/cro/evaluate.ts`
- Create: `lib/engines/copy/commercial-rubric.ts`
- Test: rubric fixture tests.

**Interfaces:**
- Initial dimensions: clarity, specificity, audienceFit, offerAlignment, proofStrength, persuasion, messageContinuity, channelFit, brandVoice, friction, risk.

- [ ] Build rubric prompts from structured context, not raw copy alone.
- [ ] Require evidence/rationale per finding.
- [ ] Validate model output with the canonical evaluation schema.
- [ ] Commit: `feat(evaluation): add commercial and CRO evaluators`.

---

### Task 6: Aggregation and recommendation ranking

**Files:**
- Create: `lib/engines/aggregation/aggregate.ts`
- Create: `lib/engines/aggregation/recommendations.ts`
- Test: aggregation tests.

**Interfaces:**
- `aggregateEvaluation(findings, metadata)` returns dimension scores, composite display score, confidence, and ordered recommendations.

- [ ] Test deterministic severe issues cannot be hidden by a high LLM score.
- [ ] Test low-confidence judgments have reduced contribution.
- [ ] Rank recommendations by expected commercial impact, evidence strength, severity, and edit cost rather than arbitrary ordering.
- [ ] Commit: `feat(evaluation): aggregate evidence-aware copy scores`.

---

### Task 7: Persist and expose evaluation runs

**Files:**
- Create: evaluation repository/service.
- Create: `app/api/workspaces/[workspaceId]/projects/[projectId]/assets/[assetId]/evaluate/route.ts`
- Create: evaluation history route.
- Test: integration tests.

- [ ] Evaluation targets an immutable copy version ID.
- [ ] Store input hash and all evaluator metadata.
- [ ] Prevent duplicate expensive runs for an identical idempotency key.
- [ ] Commit: `feat(evaluation): persist reproducible evaluation runs`.

---

### Task 8: Evaluation UI and inline findings

**Files:**
- Create: `components/studio/EvaluationPanel.tsx`
- Create: `components/studio/InlineFinding.tsx`
- Modify: Copy Studio page.

- [ ] Display composite score as summary, then dimension evidence underneath.
- [ ] Findings jump to exact affected text where a span exists.
- [ ] Distinguish deterministic, model-assisted, and performance-derived evidence.
- [ ] Show confidence/version metadata without overwhelming the default view.
- [ ] Commit: `feat(evaluation): add evidence-aware review UI`.

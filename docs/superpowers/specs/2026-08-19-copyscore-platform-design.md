# CopyScore Platform Maturity Design

**Date:** 2026-08-19
**Status:** Approved for implementation
**Baseline:** `main` at `30c4f1feeb095b4a6708f3564b99cd97a726befc`
**Existing baseline:** `docs/product/autonomous-baseline.md`

## Mission

Mature CopyScore from an assessment-first application into a production-ready daily workspace for copywriters and digital marketers without discarding the assessment, account, leaderboard, challenge, Firebase, or AI Upscale work already present.

The product must connect research, briefs, copy assets, evaluation, experiments, performance evidence, and learning in one traceable workflow.

## Product shape

CopyScore becomes six connected surfaces:

1. **Benchmark**: the existing adaptive assessment, results, rankings, challenges, and public skill profile.
2. **Studio**: research vault, briefs, copy assets, versions, comments, review, and approvals.
3. **Growth Lab**: hypotheses, variants, experiments, metrics, and decisions.
4. **Intelligence**: deterministic checks, brand voice, channel rules, CRO evaluation, evidence checks, LLM judges, and score aggregation.
5. **Learning**: assessment weaknesses plus repeated findings from real work plus performance outcomes.
6. **AI Upscale**: the existing curated resource directory, repaired and integrated into the workspace rather than treated as a separate product.

## Canonical workflow

`Research -> Brief -> Draft -> Evaluate -> Revise -> Approve -> Experiment -> Performance -> Learn`

Every downstream object must retain references to the upstream evidence that informed it.

## Architecture decision

Use a **domain-modular monolith** in the current Next.js repository.

Do not split into microservices or migrate databases during the first maturity program. The current application is small enough that a single deployable with explicit domain boundaries gives lower migration risk and faster verification.

Target code organization:

```text
lib/
  domains/
    workspaces/
    brands/
    research/
    briefs/
    assets/
    evaluations/
    experiments/
    performance/
    assessments/
  engines/
    copy/
    brand/
    cro/
    channel/
    evidence/
    aggregation/
    calibration/
  platform/
    auth/
    db/
    ai/
    audit/
    observability/
    rate-limit/
  shared/
    schemas/
    errors/
    ids/
```

Route handlers follow:

`request -> schema validation -> authentication -> authorization policy -> domain service -> repository -> Firebase Admin SDK`

Client components must not be the authority for protected mutations.

## Data model

Add these canonical entities incrementally:

- `Workspace`
- `WorkspaceMember`
- `Brand`
- `Project`
- `Campaign`
- `ResearchSource`
- `ResearchInsight`
- `Brief`
- `CopyAsset`
- `CopyVersion`
- `EvaluationRun`
- `EvaluationFinding`
- `Approval`
- `Hypothesis`
- `Experiment`
- `ExperimentVariant`
- `PerformanceSnapshot`
- `LearningSignal`
- `AuditEvent`

All mutable business objects carry `createdAt`, `updatedAt`, `createdBy`, and a version or revision marker where concurrency matters.

## Workspace authorization

Roles:

- `owner`
- `admin`
- `strategist`
- `copywriter`
- `reviewer`
- `viewer`

Authorization is checked server-side against workspace membership. Firestore client rules remain deny-by-default for business mutations that are intended to pass through server routes.

## Research Vault

Research stores evidence, not generic notes.

Supported source categories include customer interviews, reviews, sales calls, support tickets, analytics observations, competitor claims, existing brand documents, and manual notes.

Each insight records source provenance, exact quote where relevant, interpretation, tags, audience context, confidence, and links to briefs/hypotheses/assets that consume it.

## Brief Builder

A brief is structured around:

- objective
- audience
- awareness stage
- funnel stage
- offer
- problem
- trigger
- desired outcome
- objections
- proof
- channel
- CTA
- constraints
- compliance notes
- success metrics

The evaluation engine must receive this context instead of grading copy in isolation.

## Copy Studio

Copy assets support channel-specific types such as landing pages, paid social ads, Google Ads, emails, SMS, product pages, social posts, push notifications, and UX copy.

Each asset has immutable historical versions. A new edit produces a new version. Versions may be compared, restored, branched, commented on, submitted for review, approved, or rejected.

## Intelligence V2

Evaluation pipeline:

`Context Resolver -> Deterministic Checks -> Channel Rules -> Brand Voice -> Commercial Copy Rubric -> CRO Engine -> Evidence Checker -> LLM Judges -> Aggregator -> Recommendations`

Every finding includes:

- dimension
- score impact
- severity
- exact affected span when possible
- explanation
- evidence references
- confidence
- recommended action
- engine version
- rubric version
- model/prompt version when AI is used

AI output is untrusted until validated against a strict schema.

## Scoring policy

A composite score remains useful for UX, but it must never appear more precise than the evidence supports.

Store evaluation metadata so scores remain reproducible and comparable only when compatible:

- engine version
- rubric version
- model identifier
- prompt version
- input hash
- brief version
- brand profile version
- timestamp

Performance evidence outranks model opinion. If real experiment outcomes contradict an evaluator prediction, the outcome becomes a calibration signal rather than being discarded.

## CRO and experimentation

A hypothesis contains observation, evidence, problem, proposed change, expected behavior change, primary metric, business metric, priority score, variants, result, and decision.

Experiments link directly to the copy versions under test and return performance evidence to the project knowledge base.

Initial implementation supports manual metric entry and CSV import before direct ad/analytics integrations.

## Learning loop

Learning combines:

`assessment evidence + repeated evaluation findings + experiment outcomes`

The user should receive specific recurring skill signals and targeted practice missions rather than generic labels.

## UI architecture

Keep the existing public/assessment surfaces. Add an authenticated application shell under `/app/[workspaceId]`.

Initial routes:

```text
/app/[workspaceId]
/app/[workspaceId]/projects
/app/[workspaceId]/projects/[projectId]
/app/[workspaceId]/projects/[projectId]/research
/app/[workspaceId]/projects/[projectId]/brief
/app/[workspaceId]/projects/[projectId]/assets
/app/[workspaceId]/projects/[projectId]/experiments
/app/[workspaceId]/projects/[projectId]/insights
```

The Copy Studio desktop layout uses project context on the left, editor in the center, and evaluation/version/review context on the right. Mobile collapses these into task-focused tabs.

## Live-readiness gate

No production launch claim is valid until all of these are true:

1. `lint`, `typecheck`, tests, and production build run automatically in GitHub Actions.
2. Production build is green from a clean install.
3. Firestore rules are deny-by-default for protected writes and tested with the Emulator Suite.
4. Assessment sessions have ownership/expiry semantics and are not dependent on one Node process for correctness.
5. AI responses are schema-validated before use.
6. Sensitive mutation endpoints have rate limits and idempotency where retries can create side effects.
7. Secrets/signatures use server-only secrets, not committed constants.
8. Logs have request/correlation IDs and redact sensitive data.
9. Account deletion/export behavior is documented and tested.
10. A rollback path exists for application deploy and Firestore rules.
11. Critical user flows have browser-level smoke coverage.
12. Known dependency vulnerabilities and peer mismatches have an explicit disposition.

## Explicit non-goals for the first program

- no microservices
- no database migration solely for architecture aesthetics
- no predictive CTR/CVR claims without calibration data
- no vector database until retrieval requirements justify it
- no bulk AI generator catalog disconnected from the core workflow
- no rewrite of the existing assessment simply to modernize code style
- no production claim based only on manual testing

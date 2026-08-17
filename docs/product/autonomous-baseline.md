# CopyScore autonomous product baseline — 2026-08-18

## Current product map

CopyScore is a Next.js application with account/auth surfaces, an adaptive copywriting assessment, result/leaderboard/challenge experiences, Firebase integration, and a newer AI resource directory. Assessment API flow is `start -> next (server evaluation + adaptive selection) -> submit (server score calculation)`. The runtime assessment session is currently held in the process-local `AssessmentStore`; authenticated final results are additionally persisted to Firestore.

## Primary finding selected today

The `/api/assessment/next` endpoint accepted any globally valid `questionId`. It did not prove that the submitted question was the server-selected `session.currentQuestion`, nor reject replay before mutating responses/difficulty. A client could therefore skip to a known question or submit the same question repeatedly, changing adaptive state and the final score. This is a product-integrity defect because scores, challenge attempts, and leaderboard-like experiences depend on those server responses.

## Ranked candidates

| Rank | Candidate | User value | Evidence | Testability | Risk / effort |
| --- | --- | --- | --- | --- | --- |
| 1 | Enforce server-owned active-question sequence and replay rejection | Very high | Direct API inspection | High | Low |
| 2 | Make final submission idempotent so retries cannot duplicate challenge side effects | High | Submit mutates challenge after score | High | Low |
| 3 | Replace hard-coded score-signature salt with a server secret / real integrity primitive | High | Salt is committed in scoring source | High | Medium |
| 4 | Validate AI evaluator output with a schema before trusting model JSON | High | JSON is spread directly into response | High | Low-medium |
| 5 | Add authentication/ownership binding to assessment sessions | High | Session ID alone addresses in-memory session | Medium | Medium |
| 6 | Persist active sessions or define explicit expiration/recovery behavior | High | In-memory store is container-lifetime only | Medium | Medium-high |
| 7 | Add automated tests and CI for assessment scoring/API invariants | High | package scripts expose no test command | High | Medium |
| 8 | Calibrate percentile/confidence claims against empirical cohorts | High | Gaussian assumptions are hard-coded | Medium | High |
| 9 | Validate/normalize handles before challenge-code creation | Medium | user-provided handle becomes challenge code | High | Low |
| 10 | Audit Firestore rules against leaderboard/result write paths | High | Firebase recently integrated | Medium | Medium |

## Architecture notes

- Scoring is server-side, which is the right trust boundary, but server-side scoring is only trustworthy if the server also owns question sequencing.
- The adaptive session already stores `currentQuestion` and `answeredQuestionIds`; no new persistence model is required to close today's defect.
- The assessment has no automated test script in `package.json`, so today's change keeps the integrity policy in a small pure function that can be unit-tested once a runner is introduced and relies on build/type/lint CI for immediate repository verification.

## Product acceptance criteria for today's initiative

1. Only `session.currentQuestion.id` may be evaluated.
2. A previously answered question is rejected before any session mutation.
3. Completed sessions reject additional answers.
4. Invalid timing values cannot inject negative, infinite, or unbounded durations.
5. Normal active-question submissions retain the existing adaptive flow and response shape.

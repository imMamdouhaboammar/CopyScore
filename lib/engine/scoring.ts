import { DifficultyLevel, DomainId, DomainScore, EvaluatedResponse, FinalAssessmentScore } from '../types/assessment';
import { determineArchetype } from '../data/archetypes';
import { getQuestionById } from '../data/question-bank';

const ASSESSMENT_VERSION = 'v1.4.2-adaptive';

export function calculateFinalScore(
  attemptId: string,
  responses: EvaluatedResponse[],
  startTime: number,
  completedAt: number,
  userHandle?: string
): FinalAssessmentScore {
  const domainResponses: Record<DomainId, EvaluatedResponse[]> = {
    conversion_copywriting: [],
    content_creation: [],
    performance_copy: [],
    cro: [],
  };

  responses.forEach((r) => {
    if (domainResponses[r.domain]) {
      domainResponses[r.domain].push(r);
    }
  });

  const domainScores: Record<DomainId, DomainScore> = {
    conversion_copywriting: computeDomainScore('conversion_copywriting', domainResponses.conversion_copywriting),
    content_creation: computeDomainScore('content_creation', domainResponses.content_creation),
    performance_copy: computeDomainScore('performance_copy', domainResponses.performance_copy),
    cro: computeDomainScore('cro', domainResponses.cro),
  };

  const domainValues = Object.values(domainScores);
  const totalWeightedSum = domainValues.reduce((acc, curr) => acc + curr.scaledScore, 0);
  const rawOverall = Math.round(totalWeightedSum / domainValues.length);
  const overallScore = Math.max(12, Math.min(99, rawOverall));

  const percentile = calculatePercentile(overallScore);

  const correctResponses = responses.filter((r) => r.isCorrect);
  let maxDifficulty: DifficultyLevel = 1;
  correctResponses.forEach((r) => {
    if (r.difficulty > maxDifficulty) {
      maxDifficulty = r.difficulty;
    }
  });

  const domainScoreMap: Record<DomainId, number> = {
    conversion_copywriting: domainScores.conversion_copywriting.scaledScore,
    content_creation: domainScores.content_creation.scaledScore,
    performance_copy: domainScores.performance_copy.scaledScore,
    cro: domainScores.cro.scaledScore,
  };
  const archetype = determineArchetype(domainScoreMap);

  const rankTitle = getRankTitle(overallScore);

  const whatYouDidWell: string[] = [];
  const whatCostYouPoints: string[] = [];

  responses.forEach((r) => {
    const q = getQuestionById(r.questionId);
    if (!q) return;

    if (r.isCorrect && q.diagnosticInsight.goodOutcome) {
      if (whatYouDidWell.length < 3 && !whatYouDidWell.includes(q.diagnosticInsight.goodOutcome)) {
        whatYouDidWell.push(q.diagnosticInsight.goodOutcome);
      }
    } else if (!r.isCorrect && q.diagnosticInsight.pitfall) {
      if (whatCostYouPoints.length < 3 && !whatCostYouPoints.includes(q.diagnosticInsight.pitfall)) {
        whatCostYouPoints.push(q.diagnosticInsight.pitfall);
      }
    }
  });

  if (whatYouDidWell.length === 0) {
    whatYouDidWell.push('Demonstrated solid foundational awareness and audience alignment principles.');
  }
  if (whatCostYouPoints.length === 0) {
    whatCostYouPoints.push('Near flawless run; minimal deductions across tested scenario parameters.');
  }

  const lowestDomain = Object.entries(domainScores).sort((a, b) => a[1].scaledScore - b[1].scaledScore)[0][0] as DomainId;
  const growthActions = getGrowthActions(lowestDomain, archetype.id);

  const totalTimeSeconds = Math.max(15, Math.round((completedAt - startTime) / 1000));
  const confidenceLevel = Math.min(98, 70 + responses.length * 2.8);

  // Scoring and cryptographic verification are deliberately separated.
  // Server finalization may promote this result to verified only after HMAC signing.
  return {
    attemptId,
    assessmentVersion: ASSESSMENT_VERSION,
    createdAt: startTime,
    completedAt,
    overallScore,
    percentile,
    confidenceLevel: Math.round(confidenceLevel),
    rankTitle,
    maxDifficultyReached: maxDifficulty,
    domainScores,
    archetype,
    whatYouDidWell,
    whatCostYouPoints,
    growthActions,
    totalTimeSeconds,
    verificationHash: '',
    isVerified: false,
    userHandle,
  };
}

function computeDomainScore(domain: DomainId, responses: EvaluatedResponse[]): DomainScore {
  if (responses.length === 0) {
    return {
      domain,
      rawScore: 0,
      scaledScore: 50,
      questionsAttempted: 0,
      accuracy: 0,
      highestDifficultyCleared: 1,
      statusLabel: 'Competitive',
    };
  }

  let totalWeight = 0;
  let earnedWeight = 0;
  let correctCount = 0;
  let maxDiff: DifficultyLevel = 1;

  responses.forEach((r) => {
    const diffMultiplier = 1.0 + (r.difficulty - 1) * 0.35;
    const itemWeight = (r.discrimination || 1.0) * diffMultiplier;

    totalWeight += itemWeight;
    earnedWeight += itemWeight * r.scoreRatio;

    if (r.isCorrect) {
      correctCount++;
      if (r.difficulty > maxDiff) {
        maxDiff = r.difficulty;
      }
    }
  });

  const accuracy = responses.length > 0 ? (correctCount / responses.length) * 100 : 0;
  const ratio = totalWeight > 0 ? earnedWeight / totalWeight : 0.5;

  const rawScaled = Math.round(30 + ratio * 68);
  const scaledScore = Math.max(15, Math.min(99, rawScaled));

  let statusLabel: DomainScore['statusLabel'] = 'Competitive';
  if (scaledScore >= 88) statusLabel = 'Expert';
  else if (scaledScore >= 80) statusLabel = 'Advanced';
  else if (scaledScore >= 72) statusLabel = 'Strong';
  else if (scaledScore >= 60) statusLabel = 'Competitive';
  else statusLabel = 'Needs Work';

  return {
    domain,
    rawScore: Math.round(earnedWeight * 10) / 10,
    scaledScore,
    questionsAttempted: responses.length,
    accuracy: Math.round(accuracy),
    highestDifficultyCleared: maxDiff,
    statusLabel,
  };
}

function calculatePercentile(score: number): number {
  const z = (score - 62) / 14;
  const t = 1.0 / (1.0 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const prob =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));

  let percentile = z > 0 ? (1.0 - prob) * 100 : prob * 100;
  percentile = Math.max(1, Math.min(99, Math.round(percentile)));
  return percentile;
}

function getRankTitle(score: number): string {
  if (score >= 92) return 'Master Strategist (Tier I)';
  if (score >= 84) return 'Advanced Specialist (Tier II)';
  if (score >= 75) return 'Strong Operator (Tier III)';
  if (score >= 65) return 'Practitioner (Tier IV)';
  if (score >= 52) return 'Developing Writer (Tier V)';
  return 'Foundation Tier';
}

function getGrowthActions(domain: DomainId, archetypeId: string): string[] {
  const actions: Record<DomainId, string[]> = {
    conversion_copywriting: [
      'Audit your stage-of-awareness matching: Ensure hero headlines resolve the exact query intent rather than relying on abstract category statements.',
      'Implement Objection-First Proof: Replace generic praise quotes with testimonials detailing the exact risk/fear that was disproven.',
      'Practice Mechanism Naming: Quantify the proprietary bridge that makes your product deliver its core promise.',
    ],
    content_creation: [
      'Eliminate Rhetorical Throat-Clearing: Remove conversational introductions ("In today\'s fast-paced world") in the first 2 sentences.',
      'Introduce Counter-Intuitive Tension: Build hooks where a familiar action produces a surprising or opposing outcome.',
      'Sharpen Sentence Contrast: Use antimetabole and structural asymmetry to deliver memorable concluding takeaways.',
    ],
    performance_copy: [
      'Bridge Hook to Offer: Stop relying on high-shock curiosity hooks that collapse into 0.4% click-through-rates due to zero relevance.',
      'Develop Situation-Specific Angles: Test situational triggers (e.g. 4K camera anxiety) rather than incremental discount claims.',
      'Enforce Ad-to-Hero Continuity: Mirror the exact vocabulary of the ad thumbnail in the above-the-fold landing page headline.',
    ],
    cro: [
      'Prioritize by Leverage over Novelty: Use PIE/ICE frameworks to test payment friction removal before initiating 3-month redesigns.',
      'Watch for "Toxic Conversion Lifts": Never optimize for shallow trial signups by hiding critical pricing constraints or feature limits.',
      'Introduce Strategic Positive Friction: Use interactive diagnostics to qualify intent in high-ticket funnels rather than passive 1-field forms.',
    ],
  };

  return actions[domain] || actions.conversion_copywriting;
}

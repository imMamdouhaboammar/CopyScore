import { AssessmentStage, ClientQuestion, DomainId, EvaluatedResponse, QuestionItem } from '../types/assessment';
import { getClientSafeQuestion, QUESTION_BANK } from '../data/question-bank';

export interface AdaptiveSelectionResult {
  nextQuestion: ClientQuestion | null;
  stage: AssessmentStage;
  isCompleted: boolean;
  questionNumber: number;
  totalQuestions: number;
  estimatedConfidence: number; // 0 to 100
}

const TOTAL_ASSESSMENT_QUESTIONS = 10;

const STAGE_THRESHOLDS = {
  CALIBRATION: 3, // Q 1-3
  CORE: 6,        // Q 4-6
  DEEP_DIVE: 8,   // Q 7-8
  PRESSURE_TEST: 10, // Q 9-10
};

export function determineStage(completedCount: number): AssessmentStage {
  if (completedCount >= TOTAL_ASSESSMENT_QUESTIONS) return 'COMPLETED';
  if (completedCount < STAGE_THRESHOLDS.CALIBRATION) return 'CALIBRATION';
  if (completedCount < STAGE_THRESHOLDS.CORE) return 'CORE';
  if (completedCount < STAGE_THRESHOLDS.DEEP_DIVE) return 'DEEP_DIVE';
  return 'PRESSURE_TEST';
}

export function selectNextAdaptiveQuestion(
  answeredQuestionIds: string[],
  responses: EvaluatedResponse[],
  currentSkillEstimates: Record<DomainId, number>
): AdaptiveSelectionResult {
  const answeredCount = answeredQuestionIds.length;
  const stage = determineStage(answeredCount);

  if (stage === 'COMPLETED' || answeredCount >= TOTAL_ASSESSMENT_QUESTIONS) {
    return {
      nextQuestion: null,
      stage: 'COMPLETED',
      isCompleted: true,
      questionNumber: answeredCount,
      totalQuestions: TOTAL_ASSESSMENT_QUESTIONS,
      estimatedConfidence: 94,
    };
  }

  // Count domain frequency in answered questions
  const domainCounts: Record<DomainId, number> = {
    conversion_copywriting: 0,
    content_creation: 0,
    performance_copy: 0,
    cro: 0,
  };

  responses.forEach((r) => {
    if (r.domain && domainCounts[r.domain] !== undefined) {
      domainCounts[r.domain]++;
    }
  });

  // Identify candidate questions not yet answered
  const availableQuestions = QUESTION_BANK.filter((q) => !answeredQuestionIds.includes(q.id));

  if (availableQuestions.length === 0) {
    return {
      nextQuestion: null,
      stage: 'COMPLETED',
      isCompleted: true,
      questionNumber: answeredCount,
      totalQuestions: answeredCount,
      estimatedConfidence: 90,
    };
  }

  // Domain selection strategy: prioritize least tested domain
  const domainsByLeastTested = (Object.keys(domainCounts) as DomainId[]).sort(
    (a, b) => domainCounts[a] - domainCounts[b]
  );

  let candidate: QuestionItem | undefined;

  if (stage === 'CALIBRATION') {
    // Select calibration item (difficulty 2 or 3) from least tested domain
    for (const d of domainsByLeastTested) {
      candidate = availableQuestions.find(
        (q) => q.domain === d && (q.difficulty === 2 || q.difficulty === 3)
      );
      if (candidate) break;
    }
  } else if (stage === 'PRESSURE_TEST') {
    // Select high-difficulty (4 or 5) items
    for (const d of domainsByLeastTested) {
      candidate = availableQuestions.find(
        (q) => q.domain === d && (q.difficulty === 4 || q.difficulty === 5)
      );
      if (candidate) break;
    }
    if (!candidate) {
      candidate = availableQuestions.find((q) => q.difficulty >= 4);
    }
  } else {
    // CORE or DEEP_DIVE: Target based on current estimated skill level in that domain
    for (const d of domainsByLeastTested) {
      const targetDiff = Math.round(Math.min(5, Math.max(1, currentSkillEstimates[d] || 3)));
      // Try exact difficulty match, then +/- 1
      candidate =
        availableQuestions.find((q) => q.domain === d && q.difficulty === targetDiff) ||
        availableQuestions.find((q) => q.domain === d && Math.abs(q.difficulty - targetDiff) <= 1) ||
        availableQuestions.find((q) => q.domain === d);
      if (candidate) break;
    }
  }

  // Fallback to any remaining available question
  if (!candidate) {
    candidate = availableQuestions[0];
  }

  const confidence = Math.min(95, Math.round(40 + (answeredCount / TOTAL_ASSESSMENT_QUESTIONS) * 55));

  return {
    nextQuestion: getClientSafeQuestion(candidate),
    stage,
    isCompleted: false,
    questionNumber: answeredCount + 1,
    totalQuestions: TOTAL_ASSESSMENT_QUESTIONS,
    estimatedConfidence: confidence,
  };
}

export function evaluateUserResponse(
  question: QuestionItem,
  userAnswer: string | string[],
  timeSpentMs: number
): EvaluatedResponse {
  let isCorrect = false;
  let scoreRatio = 0.0;

  if (question.type === 'ranking' || question.type === 'sequence') {
    const userOrder = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
    const expectedOrder = question.correctOrder || [];
    
    if (expectedOrder.length > 0) {
      // Calculate Kendall tau / positional match ratio
      let matchCount = 0;
      for (let i = 0; i < expectedOrder.length; i++) {
        if (userOrder[i] === expectedOrder[i]) {
          matchCount++;
        }
      }
      scoreRatio = matchCount / expectedOrder.length;
      isCorrect = scoreRatio >= 0.75;
    }
  } else if (question.type === 'multiple_selection') {
    const userSelections = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
    const expected = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer!];
    
    const truePositives = userSelections.filter((id) => expected.includes(id)).length;
    const falsePositives = userSelections.filter((id) => !expected.includes(id)).length;
    
    const precision = userSelections.length > 0 ? truePositives / userSelections.length : 0;
    const recall = expected.length > 0 ? truePositives / expected.length : 0;
    
    scoreRatio = Math.max(0, (precision + recall) / 2 - falsePositives * 0.15);
    isCorrect = scoreRatio >= 0.8;
  } else {
    // Single choice / copy diagnosis / scenario / pressure test
    const expected = Array.isArray(question.correctAnswer) ? question.correctAnswer[0] : question.correctAnswer;
    const userAns = Array.isArray(userAnswer) ? userAnswer[0] : userAnswer;
    
    isCorrect = String(userAns).trim().toLowerCase() === String(expected).trim().toLowerCase();
    scoreRatio = isCorrect ? 1.0 : 0.0;
  }

  return {
    questionId: question.id,
    userAnswer,
    timeSpentMs,
    timestamp: Date.now(),
    isCorrect,
    scoreRatio,
    domain: question.domain,
    difficulty: question.difficulty,
    discrimination: question.discrimination || 1.0,
    feedbackText: isCorrect ? question.diagnosticInsight.goodOutcome : question.diagnosticInsight.pitfall,
  };
}

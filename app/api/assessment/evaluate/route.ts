import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { GoogleGenAI } from '@google/genai';

const EvaluateSchema = z.object({
  prompt: z.string(),
  userCopy: z.string(),
  constraints: z.array(z.string()).optional(),
  maxWords: z.number().optional(),
  targetAudience: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = EvaluateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid evaluation payload' }, { status: 400 });
    }

    const { prompt, userCopy, constraints, maxWords, targetAudience } = parsed.data;
    const wordCount = userCopy.trim().split(/\s+/).filter(Boolean).length;
    const violatesWordCount = maxWords ? wordCount > maxWords : false;

    // Check if GEMINI_API_KEY is available
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const systemPrompt = `You are an expert commercial copy evaluator and CRO specialist.
Grade the submitted copy rewrite strictly on commercial effectiveness, psychological clarity, and constraint compliance.
Respond ONLY in valid JSON with this exact schema:
{
  "score": number (0 to 100),
  "isPassing": boolean,
  "rubric": {
    "clarity": number (0-10),
    "specificity": number (0-10),
    "audienceFit": number (0-10),
    "constraintCompliance": number (0-10)
  },
  "feedback": "One clear diagnostic sentence explaining strengths and one specific improvement."
}`;

        const evaluationContent = `
Task Prompt: ${prompt}
Target Audience: ${targetAudience || 'General commercial buyer'}
Constraints: ${constraints?.join(', ') || 'None specified'}
Max Words Allowed: ${maxWords || 'N/A'} (Actual word count: ${wordCount})
User Submitted Copy: "${userCopy}"
`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `${systemPrompt}\n\n${evaluationContent}`,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          const result = JSON.parse(response.text);
          return NextResponse.json({
            success: true,
            evaluatedBy: 'gemini-ai-rubric',
            wordCount,
            ...result,
          });
        }
      } catch (aiErr) {
        console.warn('Gemini API evaluation failed, falling back to deterministic heuristic rubric:', aiErr);
      }
    }

    // Heuristic deterministic evaluation fallback
    let score = 75;
    if (violatesWordCount) score -= 25;
    if (userCopy.length < 15) score -= 30;
    if (/\b(synergy|revolutionary|best-in-class|streamline)\b/i.test(userCopy)) score -= 15;
    if (/\b(\d+|guaranteed|hours|minutes|specific|save|stop)\b/i.test(userCopy)) score += 12;

    score = Math.max(20, Math.min(95, score));

    return NextResponse.json({
      success: true,
      evaluatedBy: 'deterministic-heuristic-rubric',
      score,
      isPassing: score >= 70,
      wordCount,
      rubric: {
        clarity: Math.round(score / 10),
        specificity: Math.round((score - 5) / 10),
        audienceFit: Math.round(score / 10),
        constraintCompliance: violatesWordCount ? 4 : 9,
      },
      feedback: violatesWordCount
        ? `Exceeded max word count constraint (${wordCount}/${maxWords} words). Tighten the phrasing.`
        : `Demonstrated focused intent with concrete verb phrasing.`,
    });
  } catch (error) {
    console.error('Error evaluating copy:', error);
    return NextResponse.json({ error: 'Evaluation failed' }, { status: 500 });
  }
}

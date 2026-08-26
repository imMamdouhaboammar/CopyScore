import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('assessment score reveal claims', () => {
  it('does not present modeled percentiles as observed population rankings in the reveal', () => {
    const resultReveal = read('components/assessment/ResultReveal.tsx');

    expect(resultReveal).not.toMatch(/Top\s+\{?100\s*-\s*score\.percentile/i);
    expect(resultReveal).not.toMatch(/score\.percentile\}?(?:th)?\s+Percentile/i);
    expect(resultReveal).not.toMatch(/certified benchmark score/i);
  });

  it('does not describe the assumed score distribution as real-world calibration evidence', () => {
    const methodology = read('components/assessment/MethodologyModal.tsx');

    expect(methodology).not.toMatch(/representing real-world commercial performance data/i);
    expect(methodology).not.toMatch(/normative percentile distribution/i);
    expect(methodology).toContain('They are not claims about your percentile among all commercial writers');
  });

  it('does not present modeled percentiles or invented cohort medians in the results dashboard', () => {
    const dashboard = read('components/assessment/ResultsDashboard.tsx');

    expect(dashboard).not.toMatch(/Top\s+\$?\{?100\s*-\s*score\.percentile/i);
    expect(dashboard).not.toMatch(/score\.percentile\}?(?:th)?\s+Percentile/i);
    expect(dashboard).not.toMatch(/verified peer cohorts/i);
    expect(dashboard).not.toMatch(/performance marketers \(median\)/i);
    expect(dashboard).not.toMatch(/conversion copywriters \(median\)/i);
    expect(dashboard).not.toMatch(/cro specialists \(median\)/i);
    expect(dashboard).not.toMatch(/official benchmark/i);
  });
});

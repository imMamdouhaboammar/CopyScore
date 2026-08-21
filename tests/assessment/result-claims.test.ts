import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('assessment score reveal claims', () => {
  it('does not present modeled percentiles as observed population rankings in the reveal', () => {
    const resultReveal = read('components/assessment/ResultReveal.tsx');

    expect(resultReveal).not.toMatch(/Top\s+\{?100\s*-\s*score\.percentile/i);
    expect(resultReveal).not.toMatch(/score\.percentile\}?(?:th)?\s+Percentile/i);
    expect(resultReveal).not.toContain('CERTIFIED BENCHMARK SCORE');
  });

  it('does not describe the assumed score distribution as real-world calibration evidence', () => {
    const methodology = read('components/assessment/MethodologyModal.tsx');

    expect(methodology).not.toContain('representing real-world commercial performance data');
    expect(methodology).not.toContain('Normative Percentile Distribution');
    expect(methodology).toContain('They are not claims about your percentile among all commercial writers');
  });
});

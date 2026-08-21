import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

describe('assessment result claims', () => {
  it('does not present modeled percentiles as real-world population rankings', () => {
    const resultReveal = read('components/assessment/ResultReveal.tsx');
    const dashboard = read('components/assessment/ResultsDashboard.tsx');
    const methodology = read('components/assessment/MethodologyModal.tsx');

    for (const source of [resultReveal, dashboard]) {
      expect(source).not.toMatch(/Top\s+\{?100\s*-\s*score\.percentile/i);
      expect(source).not.toMatch(/score\.percentile\}?(?:th)?\s+Percentile/i);
    }

    expect(methodology).not.toContain('representing real-world commercial performance data');
    expect(methodology).not.toContain('Normative Percentile Distribution');
  });

  it('does not put unsupported percentile claims into social share copy', () => {
    const dashboard = read('components/assessment/ResultsDashboard.tsx');

    expect(dashboard).not.toMatch(/Top \$\{100 - score\.percentile\}%/);
  });
});

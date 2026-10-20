import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('vercel.json', () => {
  it('deploys only master (branch names with / need **, not *)', () => {
    const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
    expect(config.git?.deploymentEnabled).toEqual({ master: true, '**': false });
  });
});

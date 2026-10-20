import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const repoRoot = new URL('../', import.meta.url);
const DEFAULT_BRANCH = 'master';

function readVercelConfig() {
  return JSON.parse(readFileSync(new URL('vercel.json', repoRoot), 'utf8'));
}

function ciPushBranches(): Set<string> {
  const ci = readFileSync(new URL('.github/workflows/ci.yml', repoRoot), 'utf8');
  const branches = new Set<string>();
  for (const match of ci.matchAll(/branches:\s*\[([^\]]*)\]/g)) {
    for (const part of match[1].split(',')) {
      const branch = part.trim();
      if (branch) branches.add(branch);
    }
  }
  for (const match of ci.matchAll(/^\s*-\s+(\S+)\s*$/gm)) {
    branches.add(match[1]);
  }
  return branches;
}

describe('vercel.json', () => {
  it('deploys the default branch and blocks the catch-all', () => {
    const enabled = readVercelConfig().git?.deploymentEnabled ?? {};
    expect(enabled[DEFAULT_BRANCH]).toBe(true);
    expect(enabled['**']).toBe(false);
  });

  it('CI runs on the default branch', () => {
    expect(ciPushBranches().has(DEFAULT_BRANCH)).toBe(true);
  });
});

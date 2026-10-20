import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const repoRoot = new URL('../', import.meta.url);

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
  it('deploys only master (branch names with / need **, not *)', () => {
    expect(readVercelConfig().git?.deploymentEnabled).toEqual({ master: true, '**': false });
  });

  it('deploys the branch that CI runs on', () => {
    const config = readVercelConfig();
    const deployed = Object.entries(config.git?.deploymentEnabled ?? {})
      .filter(([, enabled]) => enabled)
      .map(([branch]) => branch);
    const ciBranches = ciPushBranches();
    for (const branch of deployed) {
      expect(ciBranches.has(branch), `CI does not run on ${branch}, so it would never be deployed`).toBe(true);
    }
  });
});

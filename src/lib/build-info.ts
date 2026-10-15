import { execSync } from 'node:child_process';

function git(args: string): string {
  try {
    return execSync(`git ${args}`, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

// Module scope runs once per build, not once per page.
// Vercel may build without full git history, so prefer its commit SHA when it's set.
export const commitSha = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || git('log -1 --format=%h') || 'unknown';
export const commitDateIso = git('log -1 --format=%cI');

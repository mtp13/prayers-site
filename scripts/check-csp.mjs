// Checks the built site against the Content Security Policy in vercel.json, so a change that the policy would block
// fails `npm test` with a clear message instead of only showing up as a violation in the browser:
// - every inline <script> must have its SHA-256 hash in script-src (only BaseHead.astro's theme script should exist);
// - there must be no inline <style> elements, style="" attributes or on*="" event handlers.
// Run it after `npm run build`.
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';

const vercel = JSON.parse(readFileSync('vercel.json', 'utf-8'));
const csp = vercel.headers
  .flatMap((rule) => rule.headers)
  .find((header) => header.key.toLowerCase() === 'content-security-policy')?.value;
if (!csp) throw new Error('check-csp: no Content-Security-Policy header in vercel.json');

const scriptSrc = csp
  .split(';')
  .map((directive) => directive.trim().split(/\s+/))
  .find(([name]) => name === 'script-src');
const allowedHashes = new Set((scriptSrc ?? []).slice(1).filter((source) => source.startsWith("'sha256-")));

const htmlFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.name.endsWith('.html') ? [path] : [];
  });

const problems = new Set();
const reportedHashes = new Set();
const files = htmlFiles(DIST);
for (const file of files) {
  const html = readFileSync(file, 'utf-8');
  const name = relative(DIST, file);

  for (const [, attributes, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/\bsrc=/.test(attributes)) continue;
    const hash = `'sha256-${createHash('sha256').update(body).digest('base64')}'`;
    if (!allowedHashes.has(hash) && !reportedHashes.has(hash)) {
      reportedHashes.add(hash);
      problems.add(`inline <script> (first seen in ${name}) isn't allowed by script-src; its hash is ${hash}`);
    }
  }
  if (/<style\b/.test(html)) problems.add(`${name}: inline <style> element`);
  if (/<[^>]+\sstyle=/.test(html)) problems.add(`${name}: inline style="" attribute`);
  if (/<[^>]+\son[a-z]+=/.test(html)) problems.add(`${name}: inline on*="" event handler`);
}

if (problems.size > 0) {
  console.error(`check-csp: ${problems.size} problem(s) with the CSP in vercel.json:\n- ${[...problems].join('\n- ')}`);
  console.error('If an inline script changed on purpose, update its hash in vercel.json.');
  process.exit(1);
}
console.log(`check-csp: ${files.length} pages OK against the vercel.json CSP.`);

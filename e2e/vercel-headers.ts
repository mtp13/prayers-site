import { readFileSync } from 'node:fs';
import type { Page } from '@playwright/test';

// Applies the headers from vercel.json (including the Content-Security-Policy) to every same-origin HTML document,
// because `astro preview` sends none. There's one copy of the policy, and a violation fails the E2E run (see
// harness.ts) before it reaches production.

interface HeaderRule {
  source: string;
  headers: { key: string; value: string }[];
}

const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf-8')) as {
  headers?: HeaderRule[];
};

// The rules' sources are written as plain regular expressions over the path (e.g. "/(.*)", "/_astro/(.*)"), so they
// can be matched directly. Named path segments (":name") would need Vercel's path-to-regexp, so refuse them.
const rules = (config.headers ?? []).map((rule) => {
  if (rule.source.includes(':')) {
    throw new Error(`vercel-headers: "${rule.source}" uses path parameters, which this fixture doesn't support`);
  }
  return { pattern: new RegExp(`^${rule.source}$`), headers: rule.headers };
});

// Header sources match the path after vercel.json's rewrite of /rosary/* to /* (the hub proxies the same way).
function headersFor(pathname: string): Record<string, string> {
  const path = pathname.replace(/^\/rosary(?=\/|$)/, '') || '/';
  return Object.fromEntries(
    rules
      .filter((rule) => rule.pattern.test(path))
      .flatMap((rule) => rule.headers.map((h) => [h.key.toLowerCase(), h.value])),
  );
}

export async function applyVercelHeaders(page: Page, origin: string) {
  await page.route(
    (url) => url.origin === origin,
    async (route) => {
      if (route.request().resourceType() !== 'document') return route.fallback();
      const response = await route.fetch({ maxRedirects: 0 });
      if (response.status() >= 300 && response.status() < 400) return route.continue();
      await route.fulfill({
        response,
        headers: { ...response.headers(), ...headersFor(new URL(route.request().url()).pathname) },
      });
    },
  );
}

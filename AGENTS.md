# AGENTS.md

Guidance for AI coding agents (Claude Code, Gemini CLI, Codex, etc.) working in
this repo. `CLAUDE.md` and `GEMINI.md` just import this file, so edit this one.

- Astro 7 static site for Rosary prayers and mysteries.
- Content lives in `src/content/prayers/` and `src/content/mysteries/`.
- Pages are `src/pages/index.astro`, `src/pages/prayers/[...slug].astro`, and
  `src/pages/mysteries/[...slug].astro`.
- `astro.config.mjs` sets `base: "/rosary"`; use `import.meta.env.BASE_URL` for
  internal links.
- The site builds to static `dist/`; do not edit generated output.

## Content Rules

- Markdown content uses front matter.
- Current schema fields: `title` required, `order` optional. Prayers also
  require `category`: `rosary` for prayers of the Rosary itself, `after-rosary`
  for those the St. Henry Rosary group says after it (keep their `order`, which
  is the order they are prayed), or `other`. Each category is its own section,
  sorted by `order`.
- Keep filenames `snake_case`, titles in Title Case, and prayer text verbatim.
- If you add front matter fields, update `src/content.config.ts`.
- Ordering uses `order` with a fallback of `99`, then title; use
  `getSortedCollection` from `src/lib/collections.ts`.
- Mystery files are split into pages on `---` lines. Each must have exactly as
  many sections as its `pages` entry in `src/lib/rosary-mysteries.ts`, and each
  section must start with a heading like
  `## First Joyful Mystery: The Annunciation` matching that page's title, or the
  build fails. The page shows that heading as its title, so put set-level notes
  (days, history) in `mysterySets`, not in the Markdown.
- Each mystery set is a sequence of steps (`getMysterySteps`): opening prayers,
  the five mysteries, then the concluding prayers, at
  `/mysteries/<set>/opening`, `/<mystery>` and `/conclusion`. Their prayers come
  from the prayer content files via `src/components/PrayerSequence.astro` (shown
  in full, or as expandable sections for the decade).
- Markdown is rendered by Astro's Sätteri processor (configured in
  `astro.config.mjs`); remark/rehype plugins do not apply.
  `src/lib/namespace-footnotes.mjs` prefixes footnote IDs with the file name so
  prayers can share a page.
- Mystery and prayer pages share `src/components/PageNav.astro`: a previous/next
  bar pinned to the bottom of the screen that also handles swipe navigation.
- If you rename a content file, add a redirect for the old URL in
  `astro.config.mjs`.

## Commands

- `npm install`
- `npm run dev`
- `npm run dev:host`
- `npm run build`
- `npm run preview`
- `npm run preview:host`
- `npm run test:links`: Serve `dist/` with a background `astro preview`, crawl
  it for broken links, then stop it.
- `npm run test:unit`: Unit tests for `src/lib` with Vitest (`tests/*.test.ts`).
- `npm run test:e2e`: Build the site, serve it with `astro preview` on port
  4323, and run the Playwright E2E and axe accessibility tests (`e2e/*.spec.ts`)
  in Desktop Chromium and Mobile WebKit (iPhone 14).
- `npm run lint:html`: Validate the built HTML in `dist/` with html-validate
  (run `npm run build` first).
- `npm run test:csp`: Check the built pages in `dist/` against the CSP in
  `vercel.json` (`scripts/check-csp.mjs`).
- `npm run test`: Lint, check formatting, type-check, run unit tests, build the
  site, validate its HTML, check it against the CSP, and check links. CI
  (`.github/workflows/ci.yml`) runs the same steps on Node 24 for pull requests
  and pushes to `main` (superseded runs on the same ref are cancelled), plus a
  separate `e2e` job that runs `npm run test:e2e` and uploads the Playwright
  report when it fails.
- `npm run lint`: Lint Markdown with markdownlint.
- `npm run format`: Format code with Prettier (Markdown is excluded);
  `npm run format:check` only checks.
- `npm run check`: Type-check with `astro check`.
- Use Conventional Commits for git messages, e.g. `fix: ...`, `docs: ...`,
  `feat: ...`.

## Style

- Use 2-space indentation, LF endings, and a final newline.
- Markdown line length is 120; heading line length is 100.
- Use 4 spaces in Python files.
- Colors have light and dark themes, chosen by the Appearance setting in the
  menu (Auto follows the system). Use the palette variables in
  `src/styles/global.css` (or the `--*-rgb` triplets for tints, e.g.
  `rgba(var(--bronze-rgb), 0.05)`), never hardcoded colors, and set both themes.
  The dark values appear twice there (system dark under Auto, and an explicit
  Dark choice); keep both copies in sync.

## Testing

- `npm test` is the gate: markdownlint, `prettier --check`, `astro check`, unit
  tests, `astro build`, html-validate on `dist/**/*.html`, the CSP check, then a
  linkinator crawl of the built site. Run it before every commit.
- Unit tests live in `tests/*.test.ts` and cover the logic in `src/lib` (mystery
  steps, the weekday-to-set map, section counts, labels, collection sorting and
  the footnote plugin). Add or update them when you change `src/lib`.
- They use **Vitest through Astro's `getViteConfig`** (`vitest.config.ts`), not
  `node --test`: this is a deliberate exception to the tic-tac-toe standard,
  because `src/lib/rosary-mysteries.ts` uses Vite's `import.meta.glob` and
  `src/lib/collections.ts` imports `astro:content`, which plain Node can't load.
  Mock `astro:content` with `vi.mock`.
- Playwright (`npm run test:e2e`, `playwright.config.ts`) covers real-browser
  behaviour: today's set on the home page (with `page.clock`), Next/Previous
  through a set, swipe (touch projects only), the menu overlay and its scroll
  lock, Escape and focus return, Appearance (Light/Dark/Auto, persistence,
  following the system), the decade's expandable prayers, the old-URL redirects
  and the 404 page. `e2e/accessibility.spec.ts` runs axe on home, a prayer page,
  a mystery step, the open menu and the 404 page in light and dark, reached both
  through the system setting and an explicit choice; expect zero violations,
  with no rules disabled.
- Every E2E test imports `test` from `e2e/harness.ts`, which serves each page
  with the `vercel.json` headers (including the CSP) and fails the test on any
  `console.error`, uncaught page error or CSP violation. A test that expects a
  console error lists it with `test.use({ expectedConsoleErrors: [...] })`.
- Playwright builds the site and runs `astro preview --ignore-lock` itself,
  which keeps the server in the foreground even under an AI agent (Astro 7
  otherwise backgrounds it). Outside CI it sets
  `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS`, because the local OS isn't one
  Playwright officially supports. Run `npx playwright install chromium webkit`
  once.
- Add or update E2E tests when you change interactive behaviour, and run
  `npm test` and `npm run test:e2e` before you finish.
- `.htmlvalidate.json` extends `html-validate:recommended` and
  `html-validate:a11y`, as tic-tac-toe does, with two changes for Astro's
  output, which the source can't control: `void-style` expects omitted end tags
  (`<meta>`), because Astro serializes void elements that way even when the
  source writes `<meta />`; and `doctype-style` is off, because Astro writes
  `<!DOCTYPE html>` on pages but `<!doctype html>` on its redirect pages. Fix
  any other finding in the source instead of turning the rule off.
- The build is the content validator: a mystery file whose sections don't match
  `src/lib/rosary-mysteries.ts` fails it, so don't duplicate that check in
  tests.

## Deployment

- Vercel builds the site with `npm run build` and serves `dist/`, using the Node
  version from `engines` in `package.json`.
- Production is `https://mike.pullen.dev/rosary/`, proxied by the main site
  (`mtp13/mike.pullen.dev`) from this Vercel project
  (`prayers-site-mike-pullen.vercel.app`). `vercel.json` rewrites `/rosary/*` to
  the files in `dist/`.
- All internal links use `import.meta.env.BASE_URL`, so every page works under
  `/rosary/`.
- `vercel.json` sets the security headers on every path: a strict
  `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy` and
  `Permissions-Policy`. It also sets
  `Cache-Control: public, max-age=31536000, immutable` on `/_astro/*` (hashed
  build assets) and `public, max-age=0, must-revalidate` on everything else.
  Header `source` patterns match the path **after** the `/rosary` rewrite (the
  hub proxies `/rosary/x` to `/x` here), so write `/_astro/(.*)`, not
  `/rosary/_astro/(.*)`.
- The CSP allows only same-origin resources (`'self'`; Lora comes from
  `@fontsource` and is served from `/_astro/`), no `'unsafe-inline'`, and no
  external origins. Links to other sites are fine; loading anything from them
  isn't.
- Processed `<script>`s and CSS are emitted as files in `/_astro/`
  (`build.inlineStylesheets: 'never'` and `vite.build.assetsInlineLimit: 0` in
  `astro.config.mjs`), so `'self'` covers them. The only inline script is the
  `is:inline` theme script in `BaseHead.astro`, which must run before first
  paint, and the CSP allows it by its SHA-256 hash. **If you change that script,
  even its whitespace, update the hash in `vercel.json`**; `npm run test:csp`
  fails and prints the new hash. Don't add other inline scripts, inline styles,
  `style=""` or `on*=` attributes.
- Astro's built-in `security.csp` isn't used: it only emits a `<meta>` CSP
  (which can't set `frame-ancestors`), and it hashes processed scripts but not
  `is:inline` ones, so the theme script's hash would still be maintained by
  hand.
- Playwright applies the `vercel.json` headers to every page it loads
  (`e2e/vercel-headers.ts`), so a CSP violation fails `npm run test:e2e` before
  it reaches production.
- Only `main` is deployed (`git.deploymentEnabled` in `vercel.json`), so feature
  branches and PRs get no Vercel preview (and no `Vercel` check on PRs, which is
  expected) because the Hobby plan caps deployments at 100/day. Test on
  localhost instead. The keys are minimatch patterns: keep `"**": false` (a bare
  `*` does not match branch names containing `/`, such as `feat/x`, so they
  would still deploy) and keep the explicit `"main": true` (Vercel deploys a
  branch if any matching rule is `true`, so `main` still deploys). This only
  blocks Git-triggered deployments: CLI `vercel` deploys and deploy hooks still
  count. `tests/vercel-config.test.ts` guards this. Headers can only be checked
  with `curl` against production after merging.

## Dependencies

- Dependabot (`.github/dependabot.yml`) opens monthly PRs: dev dependencies
  grouped, `astro` and `@astrojs/*` minor and patch updates grouped, majors one
  per PR, and GitHub Actions grouped.
- `package.json` has no `allowScripts` list, because no installed package needs
  to run an install script (`npm ci` prints no warning about one). If a
  dependency PR brings in a package that does, add its exact version to an
  `allowScripts` entry in the same PR and check that `npm ci` and `npm test`
  pass.

## Git & GitHub

- Commit locally as often as you like, but push once per unit of work: every
  push to `main` is a Vercel deployment and every PR push is a CI run. Don't
  push WIP commits, and batch review fixes into one push.
- The repo is on GitHub at `mtp13/prayers-site` (remote `origin`), and `main` is
  the default branch.
- Before making changes, check the current branch. If you're on `main`, create a
  feature branch first (`feat/…`, `fix/…`, `chore/…`, `docs/…`; `claude/…` is
  fine too). If you're already on a feature branch for related work, keep using
  it. Once a PR is merged, start new work on a fresh branch from an up-to-date
  `main`, and never push to a merged branch.
- When the work is finished, run `npm run format`, then `npm test` and
  `npm run test:e2e`. Commit only once both pass, then push the branch and open
  a pull request against `main` with `gh pr create`. Every commit must be
  formatted, not just the last one before a PR. Give the PR a summary and test
  notes. You don't need to ask first. If a PR is already open for the branch,
  push to update it.
- Use the `gh` CLI for PRs, issues and checking CI runs. Each PR runs CI through
  GitHub Actions; check it with `gh pr checks` and fix any failures.
- Never commit to, push to or force-push `main` directly.

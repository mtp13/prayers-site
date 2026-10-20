# Rosary Prayers

An Astro 7 static site that presents Catholic Rosary prayers and mysteries. Content is managed in Astro content
collections, rendered into simple, readable pages, and deployed as a static site on Vercel.

## Requirements

- Node.js 24
- npm

## Install

```sh
npm install
```

## Development

```sh
npm run dev
```

Optional:

```sh
npm run dev:host
```

## Build

```sh
npm run build
```

## Preview

```sh
npm run preview
```

Optional:

```sh
npm run preview:host
```

## Test

```sh
npm test
```

This runs every check, in order:

- `npm run lint`: lint Markdown with markdownlint.
- `npm run format:check`: check code formatting with Prettier. Run `npm run format` to fix it.
- `npm run check`: type-check the TypeScript and Astro files.
- `npm run test:unit`: unit-test the helpers in `src/lib` with Vitest (`tests/`).
- `npm run build`: build the site.
- `npm run lint:html`: validate the built HTML with html-validate.
- `npm run test:csp`: check the built pages against the Content Security Policy in `vercel.json`.
- `npm run test:links`: crawl the built site for broken links.

Browser tests (Playwright E2E and axe accessibility checks, in Desktop Chromium and Mobile WebKit) run separately:

```sh
npx playwright install chromium webkit   # once
npm run test:e2e
```

GitHub runs the same checks, plus the browser tests, on every pull request (`.github/workflows/ci.yml`) and shows a
green check or a red cross on the PR. Prettier skips Markdown so prayer text is never reflowed; markdownlint covers it instead.

## Making a Change

1. Work on a branch, not `main`.
2. Run `npm test` before pushing.
3. Open a pull request into `main`. CI runs the checks. Only `main` is deployed, so PRs get no Vercel preview; verify locally
   with `npm run preview`.
4. Merge when the checks are green. Vercel then deploys `main`.

## Project Structure

```text
.
├── astro.config.mjs
├── e2e/                  # Playwright E2E and accessibility tests
├── package.json
├── playwright.config.ts
├── public/
├── scripts/              # helper scripts (e.g. fetching scripture passages)
├── src/
│   ├── components/
│   ├── content/
│   ├── content.config.ts
│   ├── layouts/
│   ├── lib/              # shared helpers and mystery metadata
│   ├── pages/
│   └── styles/
├── tests/                # Vitest unit tests for src/lib
├── tsconfig.json
└── vitest.config.ts
```

## Content

- Prayers and mysteries live in `src/content/prayers/` and `src/content/mysteries/`.
- Content files are Markdown with front matter.
- Filenames use snake_case.
- Titles use Title Case.

Example front matter:

```yaml
---
title: "Hail Mary"
order: 4
category: rosary # or "after-rosary" / "other"
---
```

## Content Editing

1. Add or edit a prayer in `src/content/prayers/` or a mystery in `src/content/mysteries/`.
2. Use the front matter fields shown above (`title`, optional `order`, and `category` for prayers).
3. Keep filenames in snake_case and preserve traditional wording.
4. Run `npm run dev` to preview changes locally.

## Content Collections and Schema

- Collection definitions live in `src/content.config.ts` and use `defineCollection` with `glob` loaders and Zod
  schemas.
- Update the schema when you add new front matter fields.
- If you add a new collection, create a matching folder under `src/content/` and register it in
  `src/content.config.ts`.

Minimal example:

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const prayers = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/prayers' }),
  schema: z.object({
    title: z.string(),
    order: z.number().optional(),
  }),
});

export const collections = { prayers };
```

## Updating Pages for New Collections

- Create a new route in `src/pages/` (for example, `src/pages/saints/[...slug].astro`).
- Use `getCollection` (or `getSortedCollection` from `src/lib/collections.ts`) and `getStaticPaths` to generate pages
  for entries. Entry URLs use `entry.id`, which comes from the filename.
- Add navigation links in `src/components/Header.astro` if you want the collection listed in the main menu.

## Deployment (Vercel)

- Vercel builds the site using `npm run build` and serves the static output from `dist/`.
- Only `main` deploys (`git.deploymentEnabled` in `vercel.json`), so branches and PRs get no preview. For local
  verification, use `npm run preview` to test the production build.
- After merging, check headers on production with `curl -sI`.

## Scripture Helper

`scripts/bible_script.py` fetches NABRE passages from BibleGateway and prints them as Markdown:

```sh
pip install -r scripts/requirements.txt
python scripts/bible_script.py --help
```

## Notes

- Output is static in `dist/`.

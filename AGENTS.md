# AGENTS.md

- Astro 7 static site for Rosary prayers and mysteries.
- Content lives in `src/content/prayers/` and `src/content/mysteries/`.
- Pages are `src/pages/index.astro`, `src/pages/prayers/[...slug].astro`, and `src/pages/mysteries/[...slug].astro`.
- `astro.config.mjs` sets `base: "/rosary"`; use `import.meta.env.BASE_URL` for internal links.
- The site builds to static `dist/`; do not edit generated output.

## Content Rules

- Markdown content uses front matter.
- Current schema fields: `title` required, `order` optional.
- Keep filenames `snake_case`, titles in Title Case, and prayer text verbatim.
- If you add front matter fields, update `src/content.config.ts`.
- Ordering uses `order` with a fallback of `99`, then title; use `getSortedCollection` from `src/lib/collections.ts`.
- Mystery files are split into pages on `---` lines. Each must have exactly as many sections as its `pages` entry in
  `src/lib/rosary-mysteries.ts`, and each section must contain a heading like
  `## First Joyful Mystery: The Annunciation` matching that page's title, or the build fails.
- If you rename a content file, add a redirect for the old URL in `astro.config.mjs`.

## Commands

- `npm install`
- `npm run dev`
- `npm run dev:host`
- `npm run build`
- `npm run preview`
- `npm run preview:host`
- `npm run test:links`: Serve `dist/` with a background `astro preview`, crawl it for broken links, then stop it.
- `npm run test`: Lint, build the site, and check links.
- `npm run lint`: Lint Markdown with markdownlint.
- Use Conventional Commits for git messages, e.g. `fix: ...`, `docs: ...`, `feat: ...`.

## Style

- Use 2-space indentation, LF endings, and a final newline.
- Markdown line length is 120; heading line length is 100.
- Use 4 spaces in Python files.

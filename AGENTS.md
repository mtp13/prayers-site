# AGENTS.md

- Astro 7 static site for Rosary prayers and mysteries.
- Content lives in `src/content/prayers/` and `src/content/mysteries/`.
- Pages are `src/pages/index.astro`, `src/pages/prayers/[...slug].astro`, and `src/pages/mysteries/[...slug].astro`.
- `astro.config.mjs` sets `base: "/rosary"`; use `import.meta.env.BASE_URL` for internal links.
- The site builds to static `dist/`; do not edit generated output.

## Content Rules

- Markdown content uses front matter.
- Current schema fields: `title` required, `order` optional. Prayers also require `category`: `rosary` for prayers
  of the Rosary itself, `after-rosary` for those the St. Henry Rosary group says after it (keep their `order`, which
  is the order they are prayed), or `other`. Each category is its own section, sorted by `order`.
- Keep filenames `snake_case`, titles in Title Case, and prayer text verbatim.
- If you add front matter fields, update `src/content.config.ts`.
- Ordering uses `order` with a fallback of `99`, then title; use `getSortedCollection` from `src/lib/collections.ts`.
- Mystery files are split into pages on `---` lines. Each must have exactly as many sections as its `pages` entry in
  `src/lib/rosary-mysteries.ts`, and each section must start with a heading like
  `## First Joyful Mystery: The Annunciation` matching that page's title, or the build fails. The page shows that
  heading as its title, so put set-level notes (days, history) in `mysterySets`, not in the Markdown.
- Each mystery set is a sequence of steps (`getMysterySteps`): opening prayers, the five mysteries, then the
  concluding prayers, at `/mysteries/<set>/opening`, `/<mystery>` and `/conclusion`. Their prayers come from the prayer
  content files via `src/components/PrayerSequence.astro` (shown in full, or as expandable sections for the decade).
- Markdown is rendered by Astro's Sätteri processor (configured in `astro.config.mjs`); remark/rehype plugins do not
  apply. `src/lib/namespace-footnotes.mjs` prefixes footnote IDs with the file name so prayers can share a page.
- Mystery and prayer pages share `src/components/PageNav.astro`: a previous/next bar pinned to the bottom of the
  screen that also handles swipe navigation.
- If you rename a content file, add a redirect for the old URL in `astro.config.mjs`.

## Commands

- `npm install`
- `npm run dev`
- `npm run dev:host`
- `npm run build`
- `npm run preview`
- `npm run preview:host`
- `npm run test:links`: Serve `dist/` with a background `astro preview`, crawl it for broken links, then stop it.
- `npm run test`: Lint, check formatting, type-check, build the site, and check links. CI runs the same on PRs.
- `npm run lint`: Lint Markdown with markdownlint.
- `npm run format`: Format code with Prettier (Markdown is excluded); `npm run format:check` only checks.
- `npm run check`: Type-check with `astro check`.
- Use Conventional Commits for git messages, e.g. `fix: ...`, `docs: ...`, `feat: ...`.

## Style

- Use 2-space indentation, LF endings, and a final newline.
- Markdown line length is 120; heading line length is 100.
- Use 4 spaces in Python files.
- Colors have light and dark themes, chosen by the Appearance setting in the menu (Auto follows the system). Use the
  palette variables in `src/styles/global.css` (or the `--*-rgb` triplets for tints, e.g.
  `rgba(var(--bronze-rgb), 0.05)`), never hardcoded colors, and set both themes. The dark values appear twice there
  (system dark under Auto, and an explicit Dark choice); keep both copies in sync.

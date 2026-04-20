# AGENTS.md

- Astro 5 static site for Rosary prayers and mysteries.
- Content lives in `src/content/prayers/` and `src/content/mysteries/`; pages are `src/pages/index.astro`, `src/pages/prayers/[...slug].astro`, and `src/pages/mysteries/[...slug].astro`.
- `astro.config.mjs` sets `base: "/rosary"`; use `import.meta.env.BASE_URL` for internal links.
- The site builds to static `dist/`; do not edit generated output.

## Content Rules

- Markdown content uses front matter.
- Current schema fields: `title` required, `order` optional, `layout` optional, `mysteries` optional for mystery entries.
- Keep filenames `snake_case`, titles in Title Case, and prayer text verbatim.
- If you add front matter fields, update `src/content/config.ts`.
- Ordering uses `order` with a fallback of `99`.

## Commands

- `npm install`
- `npm run dev`
- `npm run dev:host`
- `npm run build`
- `npm run preview`
- `npm run preview:host`
- Markdown lint: `npx markdownlint "**/*.md" --config .markdownlint.json`
- No automated tests are configured.
- Use Conventional Commits for git messages, e.g. `fix: ...`, `docs: ...`, `feat: ...`.

## Style

- Use 2-space indentation, LF endings, and a final newline.
- Markdown line length is 120; heading line length is 100.
- Use 4 spaces in Python files.

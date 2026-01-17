# AGENTS.md

Guidance for agentic coding assistants working in this Astro-based Rosary prayers site.

## Project Overview

- Static site built with Astro 5.
- Content lives in `src/content` collections (prayers, mysteries).
- Pages are Astro components in `src/pages`.
- Styling is in `src/styles/global.css` and component-level styles.
- Hosted on Vercel; output is static `dist/`.

## Commands

### Install

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Optional:

```bash
npm run dev:host
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

Optional:

```bash
npm run preview:host
```

### Linting

Markdown linting (when `.markdownlint.json` is present):

```bash
npx markdownlint "**/*.md" --config .markdownlint.json
```

### Tests

- No automated tests are configured.
- Single-test commands are not applicable yet.
- If tests are added later, document `npm test -- <file>` or framework-specific commands.

## Repository Layout

```text
.
├── astro.config.mjs
├── package.json
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   ├── pages/
│   └── styles/
├── public/
└── tsconfig.json
```

## Code Style Guidelines

### General Formatting

- Indentation: 2 spaces (per `.editorconfig`).
- End files with a newline.
- Prefer ASCII unless existing content uses Unicode.
- Markdown line length: 120; headings max 100 (per `.markdownlint.json`).

### Astro Components

- Use frontmatter for imports, props, and data fetching.
- Keep component markup semantic and accessible (labels, headings, aria where needed).
- Prefer composition in `src/components/` and layout shells in `src/layouts/`.
- Use `class` attributes, not `className`.

### TypeScript/JavaScript

- Project uses ESM (`"type": "module"`).
- Prefer `const` and `let` over `var`.
- Avoid implicit `any`; rely on `astro/tsconfigs/strict` defaults.
- Imports: standard library first, then third-party, then local modules.

### Content Collections

- Collections live in `src/content/` and are defined in `src/content/config.ts`.
- Prayer and mystery content files are Markdown.
- Front matter fields used today: `title` (required), `order` (optional), `layout` (optional), `mysteries` (optional for mystery group pages).

Example front matter:

```yaml
---
title: "Hail Mary"
order: 3
---
```

### Markdown and Content

- Preserve prayer text and capitalization; do not paraphrase.
- Scripture references use `Book Chapter:Verse` (example: `Luke 1:26-38`).
- Keep list indentation at 2 spaces.
- Use snake_case for filenames in `src/content/`.
- Use Title Case for titles.

### CSS

- Global styles live in `src/styles/global.css`.
- Class names are kebab-case.
- Keep styles responsive; check mobile layouts after edits.
- Reuse existing CSS variables when possible.

### Error Handling

- Guard against missing content in page rendering (null checks before use).
- In Astro pages, ensure `getStaticPaths` handles empty collections gracefully.
- For utility scripts, raise explicit errors with clear messages.

### Python (bible_script.py)

- Indentation: 4 spaces (per `.editorconfig`).
- Imports: standard library first, third-party next.
- Add docstrings for functions with parameters and return values.
- Raise specific exceptions with descriptive messages.

## Content Structure Notes

- Mystery pages include Scripture, Meditation, and Fruit sections.
- Prayer content should match traditional wording.
- Use front matter ordering to control navigation sequence.

## Tooling Notes

- This is an Astro project; avoid Ruby/Jekyll commands.
- `dist/` is the build output; do not edit it manually.
- Deployment targets Vercel static output.

## Cursor/Copilot Rules

- No Cursor rules or Copilot instructions found in `.cursor/rules/`, `.cursorrules`, or `.github/copilot-instructions.md`.

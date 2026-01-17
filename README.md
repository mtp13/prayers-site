# Rosary Prayers

An Astro 5 static site that presents Catholic Rosary prayers and mysteries. Content is managed in Astro content collections, rendered into simple, readable pages, and deployed as a static site on Vercel.

## Requirements

- Node.js (LTS recommended)
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

## Project Structure

```text
.
├── astro.config.mjs
├── package.json
├── public/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   ├── pages/
│   └── styles/
└── tsconfig.json
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
order: 3
---
```

## Content Editing

1. Add or edit a prayer in `src/content/prayers/` or a mystery in `src/content/mysteries/`.
2. Use the front matter fields shown above (`title`, optional `order`).
3. Keep filenames in snake_case and preserve traditional wording.
4. Run `npm run dev` to preview changes locally.

## Content Collections and Schema

- Collection definitions live in `src/content/config.ts` and use `defineCollection` + Zod schemas.
- Update the schema when you add new front matter fields.
- If you add a new collection, create a matching folder under `src/content/` and register it in `config.ts`.

Minimal example:

```ts
import { defineCollection, z } from 'astro:content';

const prayers = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    order: z.number().optional(),
  }),
});

export const collections = { prayers };
```

## Updating Pages for New Collections

- Create a new route in `src/pages/` (for example, `src/pages/saints/[...slug].astro`).
- Use `getCollection` and `getStaticPaths` to generate pages for entries.
- Add navigation links in `src/components/Header.astro` if you want the collection listed in the main menu.

## Deployment (Vercel)

- Vercel builds the site using `npm run build` and serves the static output from `dist/`.
- For local verification, use `npm run preview` to test the production build.

## Notes

- Output is static in `dist/`.

/// <reference types="vitest/config" />
// Vitest runs through Astro's Vite config, so `import.meta.glob` and the `astro:*` virtual modules resolve as they
// do in the build. Plain `node --test` can't run `src/lib/rosary-mysteries.ts` for that reason.
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    include: ['tests/**/*.test.ts'],
  },
});

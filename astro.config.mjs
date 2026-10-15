// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: "https://mike.pullen.dev",
  base: "/rosary",
  // No images are processed, so skip the optional sharp dependency.
  image: {
    service: passthroughImageService(),
  },
});

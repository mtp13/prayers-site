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
  // Prayer files were renamed from kebab-case to snake_case; keep old URLs working.
  redirects: {
    '/prayers/divine-mercy': '/rosary/prayers/divine_mercy',
    '/prayers/michael-mcgivney': '/rosary/prayers/michael_mcgivney',
    '/prayers/prayer-of-st-francis-of-assisi': '/rosary/prayers/prayer_of_st_francis_of_assisi',
    '/prayers/sacrament-most-holy': '/rosary/prayers/sacrament_most_holy',
    '/prayers/saint-gertrude-prayer': '/rosary/prayers/saint_gertrude_prayer',
  },
});

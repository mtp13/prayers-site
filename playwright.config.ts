import { defineConfig, devices } from '@playwright/test';

// Playwright doesn't officially support this local OS, so skip its host check outside CI.
if (!process.env.CI) {
  process.env.PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS = 'true';
}

// Astro builds for /rosary/ only, so there's no separate root project. The trailing slash matters: tests navigate
// with relative URLs such as page.goto('prayers/our_father').
const BASE_URL = 'http://localhost:4323/rosary/';

export default defineConfig({
  testDir: './e2e',
  testMatch: '*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: BASE_URL,
    reducedMotion: 'reduce',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'Desktop Chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile WebKit',
      use: { ...devices['iPhone 14'] },
    },
  ],
  webServer: {
    // --ignore-lock keeps `astro preview` in the foreground (Astro 7 backgrounds it when it detects an AI agent)
    // and leaves the lock that `npm run test:links` uses alone.
    command: 'npm run build && npx astro preview --port 4323 --ignore-lock',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});

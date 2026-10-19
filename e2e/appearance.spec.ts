import type { Page } from '@playwright/test';
import { test, expect } from './harness';

// --warm-cream, the page background, in each theme (src/styles/global.css).
const LIGHT_BG = 'rgb(255, 251, 245)';
const DARK_BG = 'rgb(28, 21, 18)';

const background = (page: Page) => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
const theme = (page: Page) => page.evaluate(() => document.documentElement.dataset.theme ?? 'auto');

async function choose(page: Page, label: 'Auto' | 'Light' | 'Dark') {
  await page.locator('.menu-toggle').click();
  await page.getByRole('radio', { name: label }).check();
  await page.keyboard.press('Escape');
}

test('Light and Dark set the theme and persist across reloads', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('./');
  await expect.poll(() => background(page)).toBe(LIGHT_BG);

  await choose(page, 'Dark');
  expect(await theme(page)).toBe('dark');
  await expect.poll(() => background(page)).toBe(DARK_BG);
  await expect(page.locator('meta[name="color-scheme"]')).toHaveAttribute('content', 'dark');

  await page.reload();
  expect(await theme(page)).toBe('dark');
  await expect.poll(() => background(page)).toBe(DARK_BG);
  await page.locator('.menu-toggle').click();
  await expect(page.getByRole('radio', { name: 'Dark' })).toBeChecked();
  await page.keyboard.press('Escape');

  // An explicit Light choice wins over a dark system setting.
  await page.emulateMedia({ colorScheme: 'dark' });
  await choose(page, 'Light');
  expect(await theme(page)).toBe('light');
  await expect.poll(() => background(page)).toBe(LIGHT_BG);

  await page.goto('prayers/memorare');
  expect(await theme(page)).toBe('light');
  await expect.poll(() => background(page)).toBe(LIGHT_BG);
});

test('Auto follows the system color scheme and saves nothing', async ({ page }) => {
  await page.goto('./');
  await choose(page, 'Dark');
  await choose(page, 'Auto');

  expect(await theme(page)).toBe('auto');
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBeNull();
  await expect(page.locator('meta[name="color-scheme"]')).toHaveAttribute('content', 'light dark');

  await page.emulateMedia({ colorScheme: 'dark' });
  await expect.poll(() => background(page)).toBe(DARK_BG);
  await page.emulateMedia({ colorScheme: 'light' });
  await expect.poll(() => background(page)).toBe(LIGHT_BG);

  await page.reload();
  await page.locator('.menu-toggle').click();
  await expect(page.getByRole('radio', { name: 'Auto' })).toBeChecked();
});

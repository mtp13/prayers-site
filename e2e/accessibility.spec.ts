import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { test, expect } from './harness';

async function expectNoViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).analyze();
  expect(violations.map(({ id, help, nodes }) => ({ id, help, targets: nodes.map((node) => node.target) }))).toEqual(
    [],
  );
}

// Each theme is checked both ways it can be reached: Auto following the system, and an explicit choice that
// differs from the system.
const themes = [
  { name: 'light (system)', colorScheme: 'light', saved: null },
  { name: 'dark (system)', colorScheme: 'dark', saved: null },
  { name: 'light (chosen)', colorScheme: 'dark', saved: 'light' },
  { name: 'dark (chosen)', colorScheme: 'light', saved: 'dark' },
] as const;

for (const { name, colorScheme, saved } of themes) {
  test.describe(`axe, ${name}`, () => {
    test.use({ colorScheme });

    test.beforeEach(async ({ page }) => {
      if (saved) await page.addInitScript((theme) => localStorage.setItem('theme', theme), saved);
    });

    test('home', async ({ page }) => {
      await page.goto('./');
      await expectNoViolations(page);
    });

    test('a prayer page', async ({ page }) => {
      await page.goto('prayers/divine_mercy');
      await expectNoViolations(page);
    });

    test('a mystery step with a prayer expanded', async ({ page }) => {
      await page.goto('mysteries/sorrowful_mysteries/agony_in_the_garden');
      await page.locator('details[data-prayer="our_father"] summary').click();
      await expectNoViolations(page);
    });

    test('the menu open', async ({ page }) => {
      await page.goto('mysteries/glorious_mysteries');
      await page.locator('.menu-toggle').click();
      await expect(page.locator('#site-menu')).toBeVisible();
      await expectNoViolations(page);
    });

    test.describe('404', () => {
      test.use({ expectedConsoleErrors: [/status of 404/] });

      test('the 404 page', async ({ page }) => {
        await page.goto('no-such-page');
        await expectNoViolations(page);
      });
    });
  });
}

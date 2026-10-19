import type { Page } from '@playwright/test';
import { test, expect } from './harness';

const toggle = (page: Page) => page.locator('.menu-toggle');
const menu = (page: Page) => page.locator('#site-menu');

async function openMenu(page: Page) {
  await toggle(page).click();
  await expect(menu(page)).toBeVisible();
  await expect(toggle(page)).toHaveAttribute('aria-expanded', 'true');
}

test('the menu opens as a full-screen overlay and locks the page behind it', async ({ page, isMobile }) => {
  await page.goto('prayers/hail_holy_queen');
  await openMenu(page);

  // The overlay runs from below the header to the bottom of the screen, across its full width.
  const viewport = page.viewportSize()!;
  const box = (await menu(page).boundingBox())!;
  expect(box.width).toBeCloseTo(viewport.width, 0);
  expect(box.y + box.height).toBeCloseTo(viewport.height, 0);

  await expect(page.locator('html')).toHaveClass(/\bmenu-open\b/);
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).overflow)).toBe('hidden');
  await expect(page.locator('.page-content')).toBeHidden();

  if (!isMobile) {
    // A wheel over the page area doesn't scroll the page.
    const before = await page.evaluate(() => window.scrollY);
    await page.mouse.move(viewport.width / 2, viewport.height - 10);
    await page.mouse.wheel(0, 600);
    await page.waitForTimeout(200);
    expect(await page.evaluate(() => window.scrollY)).toBe(before);
  }
});

test('Escape closes the menu and returns focus to the Menu button', async ({ page }) => {
  await page.goto('./');
  await openMenu(page);
  await menu(page).getByRole('link').first().focus();

  await page.keyboard.press('Escape');

  await expect(menu(page)).toBeHidden();
  await expect(toggle(page)).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle(page)).toBeFocused();
  await expect(page.locator('html')).not.toHaveClass(/\bmenu-open\b/);
});

test('the Menu button closes the menu again, keeping focus', async ({ page }) => {
  await page.goto('./');
  await openMenu(page);

  await toggle(page).click();

  await expect(menu(page)).toBeHidden();
  await expect(toggle(page)).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle(page)).toBeFocused();
  await expect(page.locator('html')).not.toHaveClass(/\bmenu-open\b/);
});

test('a menu link opens its page', async ({ page }) => {
  await page.goto('./');
  await openMenu(page);

  await menu(page).getByRole('link', { name: 'Memorare' }).click();

  await expect(page).toHaveURL(/\/rosary\/prayers\/memorare$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Memorare');
});

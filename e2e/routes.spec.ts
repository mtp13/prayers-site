import { test, expect } from './harness';

test('an old kebab-case prayer URL redirects to the snake_case page', async ({ page }) => {
  await page.goto('prayers/divine-mercy');

  await expect(page).toHaveURL(/\/rosary\/prayers\/divine_mercy\/?$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Divine Mercy/);
});

test.describe('unknown URLs', () => {
  // The browser logs the document's own 404 status as a console error.
  test.use({ expectedConsoleErrors: [/status of 404/] });

  test('show the 404 page', async ({ page }) => {
    const response = await page.goto('no-such-page');

    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page Not Found');
    await page.getByRole('link', { name: 'Return to Rosary Prayers' }).click();
    await expect(page).toHaveURL(/\/rosary\/?$/);
  });
});

import { test, expect } from './harness';

// Fixed local dates for each kind of day; the home page picks the set from the visitor's local weekday.
const days = [
  { date: '2026-10-18T09:00:00', weekday: 'Sunday', set: 'glorious_mysteries', title: 'The Glorious Mysteries' },
  { date: '2026-10-19T09:00:00', weekday: 'Monday', set: 'joyful_mysteries', title: 'The Joyful Mysteries' },
  { date: '2026-10-20T09:00:00', weekday: 'Tuesday', set: 'sorrowful_mysteries', title: 'The Sorrowful Mysteries' },
  { date: '2026-10-22T09:00:00', weekday: 'Thursday', set: 'luminous_mysteries', title: 'The Luminous Mysteries' },
];

for (const { date, weekday, set, title } of days) {
  test(`home shows the ${title} on a ${weekday}`, async ({ page }) => {
    await page.clock.setFixedTime(new Date(date));
    await page.goto('./');

    const card = page.locator('.today-card:visible');
    await expect(card).toHaveCount(1);
    await expect(card).toHaveAttribute('data-set', set);
    await expect(card.getByRole('heading', { level: 2 })).toHaveText(title);
    await expect(card.locator('[data-today-date]')).toContainText(weekday);
    await expect(page.locator(`button.set-card[data-set="${set}"]`)).toHaveAttribute('aria-pressed', 'true');
  });
}

test('the set buttons switch the card and the how-to links', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-19T09:00:00')); // Monday: Joyful
  await page.goto('./');

  await page.locator('button.set-card[data-set="luminous_mysteries"]').click();

  await expect(page.locator('.today-card:visible')).toHaveAttribute('data-set', 'luminous_mysteries');
  await expect(page.locator('#set-announcer')).toHaveText('Showing The Luminous Mysteries');
  await expect(page.locator('[data-howto-step="opening"]')).toHaveAttribute(
    'href',
    /\/rosary\/mysteries\/luminous_mysteries\/opening$/,
  );
});

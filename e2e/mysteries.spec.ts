import type { Page } from '@playwright/test';
import { test, expect } from './harness';

const joyfulSteps = [
  'Opening Prayers',
  'The Annunciation',
  'The Visitation',
  'The Nativity',
  'The Presentation',
  'The Finding in the Temple',
  'Concluding Prayers',
];

const heading = (page: Page) => page.getByRole('heading', { level: 1 });

test('steps through a set with Next, then back with Previous', async ({ page }) => {
  await page.goto('mysteries/joyful_mysteries');
  await expect(heading(page)).toHaveText('The Joyful Mysteries');

  await page.locator('.page-nav [rel="next"]').click();
  for (const [index, title] of joyfulSteps.entries()) {
    await expect(heading(page)).toHaveText(title);
    if (index < joyfulSteps.length - 1) await page.locator('.page-nav [rel="next"]').click();
  }

  // The last step finishes back at the set's overview.
  await expect(page.locator('.page-nav [rel="next"]')).toContainText('Finish Rosary');

  for (const title of joyfulSteps.slice(0, -1).reverse()) {
    await page.locator('.page-nav [rel="prev"]').click();
    await expect(heading(page)).toHaveText(title);
  }
  await page.locator('.page-nav [rel="prev"]').click();
  await expect(heading(page)).toHaveText('The Joyful Mysteries');
});

// The swipe handler reads only `touches[0]`, so plain events with a `touches` list stand in for real touches
// (WebKit has no Touch constructor).
async function swipe(page: Page, fromX: number, toX: number) {
  await page.evaluate(
    ([fromX, toX]) => {
      const fire = (type: string, x: number) => {
        const event = new Event(type, { bubbles: true });
        const touches = type === 'touchend' ? [] : [{ clientX: x, clientY: 300 }];
        Object.defineProperty(event, 'touches', { value: touches });
        document.dispatchEvent(event);
      };
      fire('touchstart', fromX);
      fire('touchmove', (fromX + toX) / 2);
      fire('touchmove', toX);
      fire('touchend', toX);
    },
    [fromX, toX],
  );
}

test('swiping left and right moves between steps', async ({ page, hasTouch }) => {
  test.skip(!hasTouch, 'Swipe navigation is for touch screens (Mobile WebKit)');
  await page.goto('mysteries/joyful_mysteries/visitation');
  await expect(heading(page)).toHaveText('The Visitation');

  await swipe(page, 300, 100);
  await expect(heading(page)).toHaveText('The Nativity');

  await swipe(page, 100, 300);
  await expect(heading(page)).toHaveText('The Visitation');

  // A swipe that starts at the screen edge is left to the browser's own back/forward gesture.
  await swipe(page, 5, 250);
  await page.waitForTimeout(300);
  await expect(heading(page)).toHaveText('The Visitation');
});

test("the decade's prayers expand and collapse, and stay open on the next mystery", async ({ page }) => {
  await page.goto('mysteries/joyful_mysteries/annunciation');

  const hailMary = page.locator('details[data-prayer="hail_mary"]');
  const text = hailMary.locator('.sequence-prayer-text');
  await expect(hailMary).not.toHaveAttribute('open');
  await expect(text).toBeHidden();

  await hailMary.locator('summary').click();
  await expect(hailMary).toHaveAttribute('open');
  await expect(text).toBeVisible();

  await page.locator('.page-nav [rel="next"]').click();
  await expect(heading(page)).toHaveText('The Visitation');
  await expect(page.locator('details[data-prayer="hail_mary"]')).toHaveAttribute('open');

  await page.locator('details[data-prayer="hail_mary"] summary').click();
  await expect(page.locator('details[data-prayer="hail_mary"]')).not.toHaveAttribute('open');
  await expect(page.locator('details[data-prayer="hail_mary"] .sequence-prayer-text')).toBeHidden();
});

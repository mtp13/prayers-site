import { describe, expect, it } from 'vitest';
import {
  dayToMysterySet,
  getMysteryLabel,
  getMysterySections,
  getMysterySteps,
  mysterySetOrder,
  mysterySets,
} from '../src/lib/rosary-mysteries';

describe('getMysterySteps', () => {
  it.each(mysterySetOrder)('%s: opening, the five mysteries in order, then the conclusion', (slug) => {
    const steps = getMysterySteps(slug);

    expect(steps).toHaveLength(7);
    expect(steps[0]).toEqual({ kind: 'opening', slug: 'opening', title: 'Opening Prayers' });
    expect(steps[6]).toEqual({ kind: 'conclusion', slug: 'conclusion', title: 'Concluding Prayers' });
    expect(steps.slice(1, 6)).toEqual(
      mysterySets[slug].pages.map((page, index) => ({ kind: 'mystery', slug: page.slug, title: page.title, index })),
    );
  });

  it('gives every step of a set a unique slug', () => {
    for (const slug of mysterySetOrder) {
      const slugs = getMysterySteps(slug).map((step) => step.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });

  it('lists the Joyful Mysteries in the order they are prayed', () => {
    expect(getMysterySteps('joyful_mysteries').map((step) => step.slug)).toEqual([
      'opening',
      'annunciation',
      'visitation',
      'nativity',
      'presentation',
      'finding_in_the_temple',
      'conclusion',
    ]);
  });
});

describe('dayToMysterySet', () => {
  it('maps each day of the week (0 = Sunday) to its traditional set', () => {
    expect(dayToMysterySet).toEqual({
      0: 'glorious_mysteries',
      1: 'joyful_mysteries',
      2: 'sorrowful_mysteries',
      3: 'glorious_mysteries',
      4: 'luminous_mysteries',
      5: 'sorrowful_mysteries',
      6: 'joyful_mysteries',
    });
  });

  it('agrees with the days listed on each set', () => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    for (let day = 0; day < 7; day++) {
      expect(mysterySets[dayToMysterySet[day]].days).toContain(dayNames[day]);
    }
  });
});

describe('getMysterySections', () => {
  it.each(mysterySetOrder)('%s has one section per page in mysterySets', (slug) => {
    expect(getMysterySections(slug)).toHaveLength(mysterySets[slug].pages.length);
  });
});

describe('getMysteryLabel', () => {
  it('names the mystery by its position and set', () => {
    expect(getMysteryLabel('joyful_mysteries', 0)).toBe('First Joyful Mystery');
    expect(getMysteryLabel('sorrowful_mysteries', 2)).toBe('Third Sorrowful Mystery');
    expect(getMysteryLabel('glorious_mysteries', 1)).toBe('Second Glorious Mystery');
    expect(getMysteryLabel('luminous_mysteries', 3)).toBe('Fourth Luminous Mystery');
    expect(getMysteryLabel('luminous_mysteries', 4)).toBe('Fifth Luminous Mystery');
  });
});

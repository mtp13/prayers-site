import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('astro:content', () => ({ getCollection: vi.fn() }));

const { getCollection } = await import('astro:content');
const { getPrayerGroups, getSortedCollection } = await import('../src/lib/collections');

type Entry = { id: string; data: { title: string; order?: number; category?: string } };

function mockCollection(entries: Entry[]) {
  vi.mocked(getCollection).mockResolvedValue(entries as never);
}

describe('getSortedCollection', () => {
  beforeEach(() => vi.mocked(getCollection).mockReset());

  it('sorts by order, puts entries without one at 99, then sorts ties by title', async () => {
    mockCollection([
      { id: 'zeta', data: { title: 'Zeta' } },
      { id: 'late', data: { title: 'Late', order: 100 } },
      { id: 'second', data: { title: 'Second', order: 2 } },
      { id: 'alpha', data: { title: 'Alpha' } },
      { id: 'first', data: { title: 'First', order: 1 } },
      { id: 'explicit_99', data: { title: 'Beta', order: 99 } },
    ]);

    const sorted = await getSortedCollection('prayers');

    expect(vi.mocked(getCollection)).toHaveBeenCalledWith('prayers');
    expect(sorted.map((entry) => entry.id)).toEqual(['first', 'second', 'alpha', 'explicit_99', 'zeta', 'late']);
  });
});

describe('getPrayerGroups', () => {
  beforeEach(() => vi.mocked(getCollection).mockReset());

  it('groups prayers by category in Rosary, After the Rosary, Other order, each sorted', async () => {
    mockCollection([
      { id: 'memorare', data: { title: 'Memorare', category: 'other' } },
      { id: 'glory_be', data: { title: 'Glory Be', order: 5, category: 'rosary' } },
      { id: 'st_michael', data: { title: 'St. Michael', order: 2, category: 'after-rosary' } },
      { id: 'our_father', data: { title: 'Our Father', order: 3, category: 'rosary' } },
      { id: 'divine_mercy', data: { title: 'Divine Mercy', order: 1, category: 'after-rosary' } },
    ]);

    const groups = await getPrayerGroups();

    expect(groups.map((group) => group.category)).toEqual(['rosary', 'after-rosary', 'other']);
    expect(groups.map((group) => group.prayers.map((prayer) => prayer.id))).toEqual([
      ['our_father', 'glory_be'],
      ['divine_mercy', 'st_michael'],
      ['memorare'],
    ]);
  });
});

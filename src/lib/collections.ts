import { getCollection, type CollectionEntry } from 'astro:content';

const DEFAULT_ORDER = 99;

type OrderedCollection = 'prayers' | 'mysteries';

// Sorts by `order` (falling back to 99), then by title so unordered entries stay stable.
export async function getSortedCollection<C extends OrderedCollection>(collection: C): Promise<CollectionEntry<C>[]> {
  const entries = await getCollection(collection);

  return entries.sort(
    (a, b) =>
      (a.data.order ?? DEFAULT_ORDER) - (b.data.order ?? DEFAULT_ORDER) || a.data.title.localeCompare(b.data.title),
  );
}

export interface PrayerGroup {
  category: CollectionEntry<'prayers'>['data']['category'];
  title: string;
  note?: string;
  prayers: CollectionEntry<'prayers'>[];
}

// The prayers of the Rosary itself, those said after it, then other prayers, each in `order`.
export async function getPrayerGroups(): Promise<PrayerGroup[]> {
  const prayers = await getSortedCollection('prayers');
  const groups: Omit<PrayerGroup, 'prayers'>[] = [
    { category: 'rosary', title: 'Rosary Prayers' },
    {
      category: 'after-rosary',
      title: 'After the Rosary',
      note: 'As prayed by the Rosary group at St. Henry Catholic Church',
    },
    { category: 'other', title: 'Other Catholic Prayers' },
  ];

  return groups.map((group) => ({
    ...group,
    prayers: prayers.filter((prayer) => prayer.data.category === group.category),
  }));
}

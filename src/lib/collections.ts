import { getCollection, type CollectionEntry } from 'astro:content';

const DEFAULT_ORDER = 99;

type OrderedCollection = 'prayers' | 'mysteries';

// Sorts by `order` (falling back to 99), then by title so unordered entries stay stable.
export async function getSortedCollection<C extends OrderedCollection>(
  collection: C,
): Promise<CollectionEntry<C>[]> {
  const entries = await getCollection(collection);

  return entries.sort(
    (a, b) =>
      (a.data.order ?? DEFAULT_ORDER) - (b.data.order ?? DEFAULT_ORDER) ||
      a.data.title.localeCompare(b.data.title),
  );
}

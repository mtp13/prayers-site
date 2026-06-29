import { marked } from 'marked';

export type MysterySetSlug =
  | 'joyful_mysteries'
  | 'sorrowful_mysteries'
  | 'glorious_mysteries'
  | 'luminous_mysteries';

export interface MysteryPageMeta {
  slug: string;
  title: string;
}

export interface MysterySetMeta {
  slug: MysterySetSlug;
  title: string;
  days: string[];
  pages: MysteryPageMeta[];
}

export const mysterySetOrder: MysterySetSlug[] = [
  'joyful_mysteries',
  'sorrowful_mysteries',
  'glorious_mysteries',
  'luminous_mysteries',
];

export const mysterySets: Record<MysterySetSlug, MysterySetMeta> = {
  joyful_mysteries: {
    slug: 'joyful_mysteries',
    title: 'The Joyful Mysteries',
    days: ['Monday', 'Saturday'],
    pages: [
      { slug: 'annunciation', title: 'The Annunciation' },
      { slug: 'visitation', title: 'The Visitation' },
      { slug: 'nativity', title: 'The Nativity' },
      { slug: 'presentation', title: 'The Presentation' },
      { slug: 'finding_in_the_temple', title: 'The Finding in the Temple' },
    ],
  },
  sorrowful_mysteries: {
    slug: 'sorrowful_mysteries',
    title: 'The Sorrowful Mysteries',
    days: ['Tuesday', 'Friday'],
    pages: [
      { slug: 'agony_in_the_garden', title: 'The Agony in the Garden' },
      { slug: 'scourging_at_the_pillar', title: 'The Scourging at the Pillar' },
      { slug: 'crowning_with_thorns', title: 'The Crowning with Thorns' },
      { slug: 'carrying_of_the_cross', title: 'The Carrying of the Cross' },
      { slug: 'crucifixion_and_death', title: 'The Crucifixion and Death' },
    ],
  },
  glorious_mysteries: {
    slug: 'glorious_mysteries',
    title: 'The Glorious Mysteries',
    days: ['Sunday', 'Wednesday'],
    pages: [
      { slug: 'resurrection', title: 'The Resurrection' },
      { slug: 'ascension', title: 'The Ascension' },
      { slug: 'descent_of_the_holy_spirit', title: 'The Descent of the Holy Spirit' },
      { slug: 'assumption_of_mary', title: 'The Assumption of Mary' },
      { slug: 'coronation_of_mary', title: 'The Coronation of Mary' },
    ],
  },
  luminous_mysteries: {
    slug: 'luminous_mysteries',
    title: 'The Luminous Mysteries',
    days: ['Thursday'],
    pages: [
      { slug: 'baptism_in_the_jordan', title: 'The Baptism of Jesus' },
      { slug: 'wedding_at_cana', title: 'The Wedding at Cana' },
      { slug: 'proclamation_of_the_kingdom', title: 'The Proclamation of the Kingdom' },
      { slug: 'transfiguration', title: 'The Transfiguration' },
      { slug: 'institution_of_the_eucharist', title: 'The Institution of the Eucharist' },
    ],
  },
};

export const dayToMysterySet: Record<number, MysterySetSlug> = {
  0: 'glorious_mysteries',
  1: 'joyful_mysteries',
  2: 'sorrowful_mysteries',
  3: 'glorious_mysteries',
  4: 'luminous_mysteries',
  5: 'sorrowful_mysteries',
  6: 'joyful_mysteries',
};

const mysterySources = import.meta.glob('../content/mysteries/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

function getMysterySource(slug: MysterySetSlug): string {
  const source = mysterySources[`../content/mysteries/${slug}.md`];

  if (!source) {
    throw new Error(`Missing mystery source for ${slug}`);
  }

  return source;
}

function stripFrontmatter(source: string): string {
  return source.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, '').trim();
}

export function getMysterySections(slug: MysterySetSlug): string[] {
  return stripFrontmatter(getMysterySource(slug))
    .split(/\n---\n/)
    .map((section) => section.trim())
    .filter(Boolean);
}

export function getMysterySectionMarkdown(slug: MysterySetSlug, index: number): string {
  return getMysterySections(slug)[index] ?? '';
}

export async function getMysterySectionHtml(slug: MysterySetSlug, index: number): Promise<string> {
  return await marked.parse(getMysterySectionMarkdown(slug, index));
}

export function getMysteryNavigation(slug: MysterySetSlug, index: number) {
  const pages = mysterySets[slug].pages;

  return {
    previous: index > 0 ? pages[index - 1] : null,
    next: index < pages.length - 1 ? pages[index + 1] : null,
  };
}

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
  note?: string;
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
    note: 'Introduced by Pope John Paul II in 2002.',
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

const ordinals = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];

function stripFrontmatter(source: string): string {
  return source.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, '').trim();
}

export function getMysterySections(slug: MysterySetSlug): string[] {
  const sections = stripFrontmatter(getMysterySource(slug))
    .split(/\n---\n/)
    .map((section) => section.trim())
    .filter(Boolean);

  // Sections are matched to pages by position, so a stray `---` would pair text with the wrong title.
  const { pages } = mysterySets[slug];
  if (sections.length !== pages.length) {
    throw new Error(
      `${slug}.md has ${sections.length} sections separated by "---" but ${pages.length} pages are defined in mysterySets`,
    );
  }

  // Each section must start with its heading, e.g. "## First Joyful Mystery: The Annunciation". This catches
  // reordered sections or titles that drifted from mysterySets.
  sections.forEach((section, index) => {
    const heading = `## ${getMysteryLabel(slug, index)}: ${pages[index].title}`;
    if (section.split('\n')[0].trim() !== heading) {
      throw new Error(`${slug}.md section ${index + 1} must start with the heading "${heading}"`);
    }
  });

  return sections;
}

// "Fourth Luminous Mystery"
export function getMysteryLabel(slug: MysterySetSlug, index: number): string {
  const setName = mysterySets[slug].title.replace(/^The /, '').replace(/ Mysteries$/, '');
  return `${ordinals[index]} ${setName} Mystery`;
}

// The section body without its heading line; the page shows the title separately.
export async function getMysterySectionHtml(slug: MysterySetSlug, index: number): Promise<string> {
  const section = getMysterySections(slug)[index] ?? '';
  return await marked.parse(section.split('\n').slice(1).join('\n').trim());
}

// Each set is prayed as a sequence: opening prayers, the five mysteries, then the concluding prayers.
export type MysteryStep =
  | { kind: 'opening' | 'conclusion'; slug: string; title: string }
  | { kind: 'mystery'; slug: string; title: string; index: number };

export function getMysterySteps(slug: MysterySetSlug): MysteryStep[] {
  return [
    { kind: 'opening', slug: 'opening', title: 'Opening Prayers' },
    ...mysterySets[slug].pages.map((page, index) => ({ kind: 'mystery' as const, ...page, index })),
    { kind: 'conclusion', slug: 'conclusion', title: 'Concluding Prayers' },
  ];
}

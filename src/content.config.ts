import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const schema = z.object({
  title: z.string(),
  order: z.number().optional(),
});

const prayers = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/prayers' }),
  schema: schema.extend({
    // "rosary": part of the Rosary itself; "after-rosary": said after it by the St. Henry Rosary group;
    // "other": additional prayers.
    category: z.enum(['rosary', 'after-rosary', 'other']),
  }),
});

const mysteries = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/mysteries' }),
  schema,
});

export const collections = {
  prayers,
  mysteries,
};

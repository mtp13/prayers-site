import { defineCollection, z } from 'astro:content';

const prayers = defineCollection({
  // Use 'content' type for markdown files
  type: 'content',
  schema: z.object({
    title: z.string(),
    order: z.number().optional(),
    layout: z.string().optional(), // We won't use this in Astro, but it's in the files
  }),
});

const mysteries = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    order: z.number().optional(),
    layout: z.string().optional(),
    mysteries: z.array(z.string()).optional(),
  }),
});

export const collections = {
  prayers,
  mysteries,
};

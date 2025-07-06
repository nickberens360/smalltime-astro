// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const productsCollection = defineCollection({
  type: 'content', // or 'data' if you prefer JSON
  schema: z.object({
    title: z.string(),
    description: z.string(),
    imageSrc: z.string(),
    price: z.number().optional(),
    featured: z.boolean().optional().default(false),
    category: z.string().optional(),
    // Add any other fields you need
  }),
});

export const collections = {
  'products': productsCollection,
};
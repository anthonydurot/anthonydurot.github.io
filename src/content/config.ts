// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
    type: 'content', // v2.5.0+ uses 'content' for markdown
    schema: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.date(),
        updatedDate: z.date().optional(),
        tags: z.array(z.string()).default([]),
        // specific feature flags
        mermaid: z.boolean().default(false), // Only load Mermaid script if needed
    }),
});

export const collections = {
    'blog': blogCollection,
};
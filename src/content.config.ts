import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/blog" }),
    schema: z.object({
        title: z.string(),
        resume: z.string(),
        image: z.string(),
        tags: z.array(z.string()),
    }),
});

export const collections = { blog };
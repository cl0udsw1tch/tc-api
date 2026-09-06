import { z } from 'zod';

export const createArticleSchema = z.object({
    title: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    texSource: z.string().min(1),
});

export const updateArticleSchema = createArticleSchema.partial();

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;

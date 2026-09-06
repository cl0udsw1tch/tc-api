import { z } from 'zod';

const envSchema = z.object({
    AWS_REGION: z.string(),
    RENDER_LAMBDA_NAME: z.string(),
    JWT_SECRET: z.string(),
    DATABASE_URL: z.string(),
    NODE_ENV: z.string(),
    DEV_RENDER_URL: z.string().optional(),
});

export const env = envSchema.parse(process.env);

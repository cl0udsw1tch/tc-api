import { z } from 'zod';

const envSchema = z.object({
    AWS_REGION: z.string(),
    RENDER_LAMBDA_NAME: z.string(),
    JWT_SECRET: z.string(),
    DATABASE_URL: z.string(),
});

export const env = envSchema.parse(process.env);

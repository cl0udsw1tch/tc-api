import { z } from 'zod';

const envSchema = z.object({
    AWS_REGION: z.string(),
    LAMBDA_RENDER_NAME: z.string(),
    JWT_SECRET: z.string(),
    DATABASE_URL: z.string(),
    NODE_ENV: z.string(),
    TC_API_PORT: z.coerce.number().int(),
});

export const env = envSchema.parse(process.env);

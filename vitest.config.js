import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globalSetup: './tests/global-setup.ts',
        environment: 'node',
        env: {
            DATABASE_URL: `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@postgres:${process.env.POSTGRES_PORT}/${POSTGRES_DB}`,
        },
    },
});

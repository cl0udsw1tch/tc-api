import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globalSetup: './tests/global-setup.ts',
        environment: 'node',
        env: {
            DATABASE_URL: process.env.DATABASE_URL,
        },
    },
});

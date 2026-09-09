import { defineConfig } from 'vitest/config';


const POSTGRES_DB = "tc_test"

export default defineConfig({
    test: {
        globalSetup: './tests/global-setup.ts',
        environment: 'node',
        env: {
            POSTGRES_DB: POSTGRES_DB,
            DATABASE_URL: `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@postgres:${process.env.POSTGRES_PORT}/${POSTGRES_DB}`,
        },
    },
});

import { defineConfig } from 'vitest/config';

console.log("DATABASE_URL: ", process.env.DATABASE_URL)

export default defineConfig({
    test: {
        globalSetup: './tests/global-setup.ts',
        setupFiles: ['./tests/setup.ts'],
        environment: 'node',
        fileParallelism: false,

    },
});

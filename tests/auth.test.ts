import { describe, it, expect, beforeAll } from 'vitest';
import { buildApp } from '../src/server';

describe('auth', () => {

    let app: ReturnType<typeof buildApp>;

    beforeAll(() => {
        app = buildApp();
    });

    it('signs up a new user and returns a token', async () => {
        const res = await app.inject({
            method: 'POST',
            url: '/auth/signup',
            payload: { email: 'test@example.com', password: 'password123' },
        });
        expect(res.statusCode).toBe(200);
        expect(JSON.parse(res.body).token).toBeTypeOf('string');
    });

    it('rejects duplicate signups with 409', async () => {
        await app.inject({
            method: 'POST',
            url: '/auth/signup',
            payload: { email: 'dup@example.com', password: 'password123' }
        });

        const res = await app.inject({
            method: 'POST',
            url: '/auth/signup',
            payload: { email: 'test@example.com', password: 'password123' }
        });
        expect(res.statusCode).toBe(409);
    });

    it('logs in with correct credentials', async () => {
        await app.inject({
            method: 'POST',
            url: '/auth/signup',
            payload: { email: 'login@example.com', password: 'password123' }
        });

        const res = await app.inject({
            method: 'POST',
            url: '/auth/login',
            payload: { email: 'test@example.com', password: 'password123' }
        });
        expect(res.statusCode).toBe(200);
    });

    it('rejects a wrong password with 401', async () => {
        await app.inject({
            method: 'POST',
            url: '/auth/signup',
            payload: { email: 'bad@example.com', password: 'password123' }
        });

        const res = await app.inject({
            method: 'POST',
            url: '/auth/login',
            payload: { email: 'test@example.com', password: 'wrongpass' }
        });
        expect(res.statusCode).toBe(401);
    });
});

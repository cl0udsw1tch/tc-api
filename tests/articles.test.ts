import { describe, it, expect, vi } from 'vitest';
import { buildApp } from '../src/server';

vi.mock('@aws-sdk/client-lambda', () => ({
    LambdaClient: vi.fn().mockImplementation(function() {
        return { send: vi.fn().mockResolvedValue({}) };
    }),
    InvokeCommand: vi.fn().mockImplementation(function() {
        return {};
    }),
}));

async function getToken(app: ReturnType<typeof buildApp>, email: string) {
    const res = await app.inject({
        method: 'POST',
        url: '/auth/signup',
        payload: { email: email, password: 'password123' }
    });
    return JSON.parse(res.body).token as string;
}

describe('articles', () => {
    it('creates an article, sets it pending, and triggers a render', async () => {
        const app = buildApp();
        const token = await getToken(app, 'articles@example.com');
        const res = await app.inject({
            method: 'POST',
            url: '/articles',
            headers: { authorization: `Bearer ${token}` },
            payload: { title: 'Test', slug: 'test-article', texSource: 'Hello $x^2$' },
        });
        expect(res.statusCode).toBe(200);
        expect(JSON.parse(res.body).status).toBe('pending');
    });

    it('rejects a duplicate slug with 409', async () => {
        const app = buildApp();
        const token = await getToken(app, 'slug@example.com');
        await app.inject({ method: 'POST', url: '/articles', headers: { authorization: `Bearer ${token}` }, payload: { title: 'A', slug: 'dup', texSource: 'x' } });
        const res = await app.inject({ method: 'POST', url: '/articles', headers: { authorization: `Bearer ${token}` }, payload: { title: 'B', slug: 'dup', texSource: 'y' } });
        expect(res.statusCode).toBe(409);
    });

    it('blocks unauthenticated requests with 401', async () => {
        const app = buildApp();
        const res = await app.inject({ method: 'GET', url: '/articles' });
        expect(res.statusCode).toBe(401);
    });

    it("returns 404 reading someone else's article", async () => {
        const app = buildApp();
        const tokenA = await getToken(app, 'a@example.com');
        const tokenB = await getToken(app, 'b@example.com');
        const created = await app.inject({ method: 'POST', url: '/articles', headers: { authorization: `Bearer ${tokenA}` }, payload: { title: 'Mine', slug: 'mine-only', texSource: 'x' } });
        const { id } = JSON.parse(created.body);
        const res = await app.inject({ method: 'GET', url: `/articles/${id}`, headers: { authorization: `Bearer ${tokenB}` } });
        expect(res.statusCode).toBe(404);
    });
});

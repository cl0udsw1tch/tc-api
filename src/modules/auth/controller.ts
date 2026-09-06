import type { FastifyInstance } from 'fastify';
import { signupSchema, loginSchema } from './schema.js';
import { z } from 'zod';
import { authService } from './service.js';

export async function authController(app: FastifyInstance) {
    app.post('/signup', { schema: { body: signupSchema } }, async (req, reply) => {
        const { email, password } = req.body as z.infer<typeof signupSchema>;
        try {
            const token = await authService.signup(email, password);
            return { token };
        } catch (err: any) {
            if (err.message === 'EMAIL_TAKEN') return reply.status(409).send({ error: 'Email already registered' });
            throw err;
        }
    });

    app.post('/login', { schema: { body: loginSchema } }, async (req, reply) => {
        const { email, password } = req.body as z.infer<typeof loginSchema>;
        try {
            const token = await authService.login(email, password);
            return { token };
        } catch {
            return reply.status(401).send({ error: 'Invalid email or password' });
        }
    });
}

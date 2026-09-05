import type { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function requireAuth(req: FastifyRequest, reply: FastifyReply) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        return reply.status(401).send({ error: 'Missing token' });
    }

    try {
        const payload = jwt.verify(header.slice(7), JWT_SECRET) as { sub: string };
        (req as any).userId = payload.sub;
    } catch {
        return reply.status(401).send({ error: 'Invalid or expired token' });
    }
}

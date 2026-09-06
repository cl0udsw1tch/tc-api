import { createArticleSchema, updateArticleSchema } from './schema.js';
import { articlesService } from './service.js';
import { requireAuth } from '../auth/guard.js';


import type { FastifyInstance } from 'fastify';


export async function articlesController(app: FastifyInstance) {
    app.addHook('preHandler', requireAuth);

    app.post('/', { schema: { body: createArticleSchema } }, async (req) => {
        const userId = (req as any).userId;
        return articlesService.createArticle(userId, req.body as any);
    });

    app.get('/', async (req) => {
        const userId = (req as any).userId;
        return articlesService.listForUser(userId);
    });

    app.get('/:id', async (req, reply) => {
        const article = await getOwnedArticle(req, reply);
        return article ?? reply;
    });

    app.put('/:id', { schema: { body: updateArticleSchema } }, async (req, reply) => {
        const article = await getOwnedArticle(req, reply);
        if (!article) return reply;
        return articlesService.updateArticle(article.id, req.body as any);
    });

    app.delete('/:id', async (req, reply) => {
        const article = await getOwnedArticle(req, reply);
        if (!article) return reply;
        await articlesService.deleteArticle(article.id);
        return reply.status(204).send();
    });
}

async function getOwnedArticle(req: any, reply: any) {
    const { id } = req.params as { id: string };
    const article = await articlesService.getById(id);
    if (!article || article.userId !== req.userId) {
        reply.status(404).send({ error: 'Not found' });
        return null;
    }
    return article;
}

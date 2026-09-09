import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { articlesRepository } from './repository.js';
import type { CreateArticleInput, UpdateArticleInput } from './schema.js';

import { env } from '../../env.js';


const lambda = new LambdaClient({ region: env.AWS_REGION });

export const articlesService = {
    async createArticle(userId: string, input: CreateArticleInput) {
        const article = await articlesRepository.create(userId, input);
        await triggerRender(article.id);
        return article;
    },
    async updateArticle(id: string, input: UpdateArticleInput) {
        const article = await articlesRepository.update(id, input);
        await triggerRender(article.id);
        return article;
    },
    async rerender(id: string) {
        await articlesRepository.setStatus(id, 'pending');
        await triggerRender(id);
    },
    listForUser: articlesRepository.findAllByUser,
    getById: articlesRepository.findById,
    deleteArticle: articlesRepository.delete,
};

async function triggerRender(articleId: string) {
    if (env.TC_RENDER == true) {
        await fetch(env.TC_RENDER_URL!, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ articleId }),
        });
        return;
    }
    await lambda.send(new InvokeCommand({
        FunctionName: process.env.LAMBDA_RENDER_NAME,
        InvocationType: 'Event',
        Payload: Buffer.from(JSON.stringify({ articleId })),
    }));
}

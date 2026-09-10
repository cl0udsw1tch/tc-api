import { prisma } from '../../db/client.js';
import type { CreateArticleInput, UpdateArticleInput } from './schema.js';

export const articlesRepository = {
    create(userId: string, data: CreateArticleInput) {
        return prisma.article.create({ data: { ...data, userId } });
    },
    findAllByUser(userId: string) {
        return prisma.article.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    },
    findById(id: string) {
        return prisma.article.findUnique({ where: { id } });
    },
    findBySlug(slug: string) {
        return prisma.article.findUnique({ where: { slug } });
    },
    update(id: string, data: UpdateArticleInput) {
        return prisma.article.update({ where: { id }, data });
    },
    delete(id: string) {
        return prisma.article.delete({ where: { id } });
    },
    // repository.ts
    setStatus(id: string, status: 'pending' | 'rendered' | 'failed') {
        return prisma.article.update({ where: { id }, data: { status } });
    },
};

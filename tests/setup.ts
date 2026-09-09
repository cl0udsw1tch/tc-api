import { beforeEach } from 'vitest';
import { prisma } from '../src/db/client';

beforeEach(async () => {
    await prisma.article.deleteMany();
    await prisma.user.deleteMany();
});

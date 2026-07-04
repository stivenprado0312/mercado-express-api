import { PrismaClient } from '@prisma/client';
import { logger } from '../shared/logger/index';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [
      { level: 'error', emit: 'event' },
      { level: 'info', emit: 'event' },
      { level: 'warn', emit: 'event' }
    ]
  });

if (process.env.NODE_ENV !== 'test') {
  prisma.$on('error', (err: unknown) => {
    logger.error({ err }, 'Prisma Client Error');
  });

  prisma.$on('warn', (err: unknown) => {
    logger.warn({ err }, 'Prisma Client Warning');
  });
}

globalForPrisma.prisma = prisma;

export default prisma;

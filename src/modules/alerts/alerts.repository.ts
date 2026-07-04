import prisma from '../../database/index';
import type { ListAlertsQuery } from './alerts.schemas';

export class AlertsRepository {
  async findById(id: string) {
    return prisma.alert.findUnique({
      where: { id },
      include: { product: true }
    });
  }

  async findAll(query: ListAlertsQuery) {
    const where: Record<string, unknown> = {};

    if (query.status) {
      where.status = query.status;
    }

    return prisma.alert.findMany({
      where,
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async resolve(id: string) {
    return prisma.alert.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date()
      }
    });
  }
}

export const alertsRepository = new AlertsRepository();

import prisma from '../../database/index';
import type { AdjustInventoryDto } from './inventory.schemas';

export class InventoryRepository {
  async findProductById(id: string) {
    return prisma.product.findUnique({ where: { id } });
  }

  async updateStock(id: string, quantity: number) {
    return prisma.product.update({
      where: { id },
      data: { currentStock: { increment: quantity } }
    });
  }

  async createMovement(data: AdjustInventoryDto) {
    return prisma.inventoryMovement.create({ data });
  }

  async getMovementsByProductId(productId: string) {
    return prisma.inventoryMovement.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findActiveAlertByProductId(productId: string) {
    return prisma.alert.findFirst({
      where: {
        productId,
        status: 'ACTIVE'
      }
    });
  }

  async resolveAlert(alertId: string) {
    return prisma.alert.update({
      where: { id: alertId },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date()
      }
    });
  }

  async createAlert(productId: string) {
    return prisma.alert.create({
      data: {
        productId,
        type: 'LOW_STOCK',
        status: 'ACTIVE'
      }
    });
  }

  async findProductsWithFilters(query: {
    category?: string;
    supplier?: string;
    minStock?: number;
    maxStock?: number;
    alertStatus?: 'ACTIVE' | 'RESOLVED';
  }) {
    const where: Record<string, unknown> = {};

    if (query.category) {
      where.category = query.category;
    }

    if (query.supplier) {
      where.supplier = query.supplier;
    }

    if (query.minStock !== undefined || query.maxStock !== undefined) {
      where.currentStock = {};
      if (query.minStock !== undefined) {
        (where.currentStock as Record<string, number>).gte = query.minStock;
      }
      if (query.maxStock !== undefined) {
        (where.currentStock as Record<string, number>).lte = query.maxStock;
      }
    }

    if (query.alertStatus) {
      where.alerts = {
        some: {
          status: query.alertStatus
        }
      };
    }

    return prisma.product.findMany({
      where,
      include: {
        alerts: {
          where: { status: 'ACTIVE' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}

export const inventoryRepository = new InventoryRepository();

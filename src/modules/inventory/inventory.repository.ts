import prisma from '../../database/index';
import type { AdjustInventoryDto, ListInventoryQuery } from './inventory.schemas';
import { buildProductFilters } from '../../shared/utils';
import { AlertStatus } from '../../shared/constants/domain.constants';

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
        status: AlertStatus.ACTIVE
      }
    });
  }

  async resolveAlert(alertId: string) {
    return prisma.alert.update({
      where: { id: alertId },
      data: {
        status: AlertStatus.RESOLVED,
        resolvedAt: new Date()
      }
    });
  }

  async createAlert(productId: string) {
    return prisma.alert.create({
      data: {
        productId,
        type: 'LOW_STOCK',
        status: AlertStatus.ACTIVE
      }
    });
  }

  async findProductsWithFilters(query: ListInventoryQuery) {
    const where = buildProductFilters(query);

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
          where: { status: AlertStatus.ACTIVE }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}

export const inventoryRepository = new InventoryRepository();

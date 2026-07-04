import prisma from '../../database/index';
import type { CreatePurchaseOrderDto, ListPurchaseOrdersQuery } from './purchase-orders.schemas';

export class PurchaseOrdersRepository {
  async findById(id: string) {
    return prisma.purchaseOrder.findUnique({
      where: { id },
      include: { product: true }
    });
  }

  async findAll(query: ListPurchaseOrdersQuery) {
    const where: Record<string, unknown> = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.productId) {
      where.productId = query.productId;
    }

    return prisma.purchaseOrder.findMany({
      where,
      include: { product: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async create(data: CreatePurchaseOrderDto & { supplier: string; status: 'PENDING' }) {
    return prisma.purchaseOrder.create({ data });
  }

  async updateStatus(id: string, status: 'APPROVED' | 'REJECTED' | 'RECEIVED', extraData?: Record<string, unknown>) {
    return prisma.purchaseOrder.update({
      where: { id },
      data: {
        status,
        ...extraData
      }
    });
  }

  async findProductById(productId: string) {
    return prisma.product.findUnique({ where: { id: productId } });
  }

  async updateProductStock(productId: string, quantity: number) {
    return prisma.product.update({
      where: { id: productId },
      data: { currentStock: { increment: quantity } }
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

  async transaction<T>(fn: () => Promise<T>) {
    return prisma.$transaction(fn);
  }
}

export const purchaseOrdersRepository = new PurchaseOrdersRepository();

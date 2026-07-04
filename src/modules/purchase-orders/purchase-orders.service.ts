import { BusinessRuleError, NotFoundError } from '../../shared/errors';
import { purchaseOrdersRepository } from './purchase-orders.repository';
import type {
  CreatePurchaseOrderDto,
  ListPurchaseOrdersQuery
} from './purchase-orders.schemas';

export class PurchaseOrdersService {
  async getById(id: string) {
    const order = await purchaseOrdersRepository.findById(id);
    if (!order) {
      throw new NotFoundError(`Orden de compra con id ${id} no encontrada`);
    }
    return order;
  }

  async list(query: ListPurchaseOrdersQuery) {
    return purchaseOrdersRepository.findAll(query);
  }

  async create(data: CreatePurchaseOrderDto) {
    const product = await purchaseOrdersRepository.findProductById(data.productId);
    if (!product) {
      throw new NotFoundError(`Producto con id ${data.productId} no encontrado`);
    }

    const minimumQuantity = product.minimumStock * 2;
    if (data.quantity < minimumQuantity) {
      throw new BusinessRuleError(
        `Cantidad mínima debe ser ${minimumQuantity} (2x el stock mínimo de ${product.minimumStock})`
      );
    }

    return purchaseOrdersRepository.create({
      productId: data.productId,
      supplier: product.supplier,
      quantity: data.quantity,
      status: 'PENDING'
    });
  }

  async approve(id: string) {
    const order = await purchaseOrdersRepository.findById(id);
    if (!order) {
      throw new NotFoundError(`Orden de compra con id ${id} no encontrada`);
    }

    if (order.status !== 'PENDING') {
      throw new BusinessRuleError(
        `Solo se pueden aprobar órdenes en estado PENDING. Estado actual: ${order.status}`
      );
    }

    return purchaseOrdersRepository.updateStatus(id, 'APPROVED', {
      approvedAt: new Date()
    });
  }

  async reject(id: string, rejectionReason: string) {
    const order = await purchaseOrdersRepository.findById(id);
    if (!order) {
      throw new NotFoundError(`Orden de compra con id ${id} no encontrada`);
    }

    if (order.status !== 'PENDING') {
      throw new BusinessRuleError(
        `Solo se pueden rechazar órdenes en estado PENDING. Estado actual: ${order.status}`
      );
    }

    return purchaseOrdersRepository.updateStatus(id, 'REJECTED', {
      rejectionReason
    });
  }

  async receive(id: string) {
    const order = await purchaseOrdersRepository.findById(id);
    if (!order) {
      throw new NotFoundError(`Orden de compra con id ${id} no encontrada`);
    }

    if (order.status !== 'APPROVED') {
      throw new BusinessRuleError(
        `Solo se pueden recibir órdenes en estado APPROVED. Estado actual: ${order.status}`
      );
    }

    return purchaseOrdersRepository.transaction(async () => {
      const updatedOrder = await purchaseOrdersRepository.updateStatus(id, 'RECEIVED', {
        receivedAt: new Date()
      });

      await purchaseOrdersRepository.updateProductStock(order.productId, order.quantity);

      const activeAlert = await purchaseOrdersRepository.findActiveAlertByProductId(order.productId);
      if (activeAlert) {
        await purchaseOrdersRepository.resolveAlert(activeAlert.id);
      }

      return updatedOrder;
    });
  }
}

export const purchaseOrdersService = new PurchaseOrdersService();

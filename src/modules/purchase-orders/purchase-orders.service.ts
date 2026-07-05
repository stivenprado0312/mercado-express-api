import { BusinessRuleError, NotFoundError } from '../../shared/errors';
import { purchaseOrdersRepository } from './purchase-orders.repository';
import type {
  CreatePurchaseOrderDto,
  ListPurchaseOrdersQuery
} from './purchase-orders.schemas';
import { OrderStatus, BUSINESS_RULES } from '../../shared/constants/domain.constants';
import { validateStatusTransition } from './state-machine';

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

    const minimumQuantity = product.minimumStock * BUSINESS_RULES.MINIMUM_ORDER_MULTIPLIER;
    if (data.quantity < minimumQuantity) {
      throw new BusinessRuleError(
        `Cantidad mínima debe ser ${minimumQuantity} (${BUSINESS_RULES.MINIMUM_ORDER_MULTIPLIER}x el stock mínimo de ${product.minimumStock})`
      );
    }

    return purchaseOrdersRepository.create({
      productId: data.productId,
      supplier: product.supplier,
      quantity: data.quantity,
      status: OrderStatus.PENDING
    });
  }

  async approve(id: string) {
    const order = await purchaseOrdersRepository.findById(id);
    if (!order) {
      throw new NotFoundError(`Orden de compra con id ${id} no encontrada`);
    }

    validateStatusTransition(order.status, OrderStatus.APPROVED, 'aprobar');

    return purchaseOrdersRepository.updateStatus(id, OrderStatus.APPROVED, {
      approvedAt: new Date()
    });
  }

  async reject(id: string, rejectionReason: string) {
    const order = await purchaseOrdersRepository.findById(id);
    if (!order) {
      throw new NotFoundError(`Orden de compra con id ${id} no encontrada`);
    }

    validateStatusTransition(order.status, OrderStatus.REJECTED, 'rechazar');

    return purchaseOrdersRepository.updateStatus(id, OrderStatus.REJECTED, {
      rejectionReason
    });
  }

  async receive(id: string) {
    const order = await purchaseOrdersRepository.findById(id);
    if (!order) {
      throw new NotFoundError(`Orden de compra con id ${id} no encontrada`);
    }

    validateStatusTransition(order.status, OrderStatus.RECEIVED, 'recibir');

    return purchaseOrdersRepository.transaction(async () => {
      const updatedOrder = await purchaseOrdersRepository.updateStatus(id, OrderStatus.RECEIVED, {
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

import { BusinessRuleError, NotFoundError } from '../../shared/errors';
import { inventoryRepository } from './inventory.repository';
import type { AdjustInventoryDto, ListInventoryQuery } from './inventory.schemas';

export class InventoryService {
  async adjustStock(data: AdjustInventoryDto) {
    const product = await inventoryRepository.findProductById(data.productId);
    if (!product) {
      throw new NotFoundError(`Producto con id ${data.productId} no encontrado`);
    }

    if (data.type === 'EXIT') {
      if (product.currentStock < data.quantity) {
        throw new BusinessRuleError(
          `Stock insuficiente. Stock actual: ${product.currentStock}, solicitado: ${data.quantity}`
        );
      }
    }

    const updatedProduct = await inventoryRepository.updateStock(
      data.productId,
      data.type === 'ENTRY' ? data.quantity : -data.quantity
    );

    await inventoryRepository.createMovement({
      productId: data.productId,
      type: data.type,
      quantity: data.quantity,
      reason: data.reason
    });

    if (data.type === 'EXIT' && updatedProduct.currentStock <= product.minimumStock) {
      const existingAlert = await inventoryRepository.findActiveAlertByProductId(data.productId);
      if (!existingAlert) {
        await inventoryRepository.createAlert(data.productId);
      }
    }

    if (data.type === 'ENTRY' && updatedProduct.currentStock > product.minimumStock) {
      const existingAlert = await inventoryRepository.findActiveAlertByProductId(data.productId);
      if (existingAlert) {
        await inventoryRepository.resolveAlert(existingAlert.id);
      }
    }

    return updatedProduct;
  }

  async getMovementsByProductId(productId: string) {
    const product = await inventoryRepository.findProductById(productId);
    if (!product) {
      throw new NotFoundError(`Producto con id ${productId} no encontrado`);
    }

    return inventoryRepository.getMovementsByProductId(productId);
  }

  async listInventory(query: ListInventoryQuery) {
    return inventoryRepository.findProductsWithFilters(query);
  }
}

export const inventoryService = new InventoryService();

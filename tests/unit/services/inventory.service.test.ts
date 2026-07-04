import { InventoryService } from '../../../src/modules/inventory/inventory.service';
import { inventoryRepository } from '../../../src/modules/inventory/inventory.repository';

jest.mock('../../../src/database/index', () => ({ default: {} }));

describe('InventoryService', () => {
  let service: InventoryService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new InventoryService();
  });

  describe('adjustStock', () => {
    it('debe lanzar NotFoundError cuando producto no existe', async () => {
      jest.spyOn(inventoryRepository, 'findProductById').mockResolvedValue(null);

      await expect(
        service.adjustStock({
          productId: 'nonexistent',
          type: 'ENTRY',
          quantity: 10,
          reason: 'Test'
        })
      ).rejects.toThrow('Producto con id nonexistent no encontrado');
    });

    it('debe lanzar BusinessRuleError cuando EXIT supera stock disponible', async () => {
      jest.spyOn(inventoryRepository, 'findProductById').mockResolvedValue({
        id: '123',
        currentStock: 10,
        minimumStock: 5
      } as any);

      await expect(
        service.adjustStock({
          productId: '123',
          type: 'EXIT',
          quantity: 20,
          reason: 'Venta'
        })
      ).rejects.toThrow('Stock insuficiente');
    });

    it('debe ajustar stock correctamente con ENTRY', async () => {
      const product = { id: '123', currentStock: 10, minimumStock: 5 };
      const updatedProduct = { ...product, currentStock: 20 };

      jest.spyOn(inventoryRepository, 'findProductById').mockResolvedValue(product as any);
      jest.spyOn(inventoryRepository, 'updateStock').mockResolvedValue(updatedProduct as any);
      jest.spyOn(inventoryRepository, 'createMovement').mockResolvedValue({} as any);
      jest.spyOn(inventoryRepository, 'findActiveAlertByProductId').mockResolvedValue(null);

      const result = await service.adjustStock({
        productId: '123',
        type: 'ENTRY',
        quantity: 10,
        reason: 'Entrada de mercadería'
      });

      expect(result.currentStock).toBe(20);
      expect(inventoryRepository.createMovement).toHaveBeenCalled();
    });

    it('debe crear alerta automaticamente cuando stock cae bajo minimumStock', async () => {
      const product = { id: '123', currentStock: 55, minimumStock: 50 };
      const updatedProduct = { ...product, currentStock: 45 };

      jest.spyOn(inventoryRepository, 'findProductById').mockResolvedValue(product as any);
      jest.spyOn(inventoryRepository, 'updateStock').mockResolvedValue(updatedProduct as any);
      jest.spyOn(inventoryRepository, 'createMovement').mockResolvedValue({} as any);
      jest.spyOn(inventoryRepository, 'findActiveAlertByProductId').mockResolvedValue(null);
      jest.spyOn(inventoryRepository, 'createAlert').mockResolvedValue({} as any);

      await service.adjustStock({
        productId: '123',
        type: 'EXIT',
        quantity: 10,
        reason: 'Venta'
      });

      expect(inventoryRepository.createAlert).toHaveBeenCalledWith('123');
    });

    it('debe cerrar alerta automaticamente cuando stock sube sobre minimumStock', async () => {
      const product = { id: '123', currentStock: 45, minimumStock: 50 };
      const updatedProduct = { ...product, currentStock: 55 };
      const existingAlert = { id: 'alert-1', productId: '123', status: 'ACTIVE' };

      jest.spyOn(inventoryRepository, 'findProductById').mockResolvedValue(product as any);
      jest.spyOn(inventoryRepository, 'updateStock').mockResolvedValue(updatedProduct as any);
      jest.spyOn(inventoryRepository, 'createMovement').mockResolvedValue({} as any);
      jest.spyOn(inventoryRepository, 'findActiveAlertByProductId').mockResolvedValue(existingAlert as any);
      jest.spyOn(inventoryRepository, 'resolveAlert').mockResolvedValue({} as any);

      await service.adjustStock({
        productId: '123',
        type: 'ENTRY',
        quantity: 10,
        reason: 'Entrada de mercadería'
      });

      expect(inventoryRepository.resolveAlert).toHaveBeenCalledWith('alert-1');
    });
  });

  describe('getMovementsByProductId', () => {
    it('debe lanzar NotFoundError cuando producto no existe', async () => {
      jest.spyOn(inventoryRepository, 'findProductById').mockResolvedValue(null);

      await expect(
        service.getMovementsByProductId('nonexistent')
      ).rejects.toThrow('Producto con id nonexistent no encontrado');
    });

    it('debe retornar movimientos cuando producto existe', async () => {
      const product = { id: '123', currentStock: 10, minimumStock: 5 };
      const movements = [
        { id: 'm1', productId: '123', type: 'ENTRY', quantity: 10 }
      ];

      jest.spyOn(inventoryRepository, 'findProductById').mockResolvedValue(product as any);
      jest.spyOn(inventoryRepository, 'getMovementsByProductId').mockResolvedValue(movements as any);

      const result = await service.getMovementsByProductId('123');

      expect(result).toEqual(movements);
    });
  });
});

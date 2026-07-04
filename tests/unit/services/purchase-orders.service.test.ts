import { PurchaseOrdersService } from '../../../src/modules/purchase-orders/purchase-orders.service';
import { purchaseOrdersRepository } from '../../../src/modules/purchase-orders/purchase-orders.repository';

jest.mock('../../../src/database/index', () => ({ default: {} }));

describe('PurchaseOrdersService', () => {
  let service: PurchaseOrdersService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new PurchaseOrdersService();
  });

  describe('getById', () => {
    it('debe lanzar NotFoundError cuando orden no existe', async () => {
      jest.spyOn(purchaseOrdersRepository, 'findById').mockResolvedValue(null);

      await expect(service.getById('nonexistent')).rejects.toThrow(
        'Orden de compra con id nonexistent no encontrada'
      );
    });

    it('debe retornar orden cuando existe', async () => {
      const mockOrder = {
        id: '123',
        supplier: 'Test Supplier',
        status: 'PENDING',
        quantity: 100
      };

      jest.spyOn(purchaseOrdersRepository, 'findById').mockResolvedValue(mockOrder as any);

      const result = await service.getById('123');

      expect(result).toEqual(mockOrder);
    });
  });

  describe('create', () => {
    it('debe lanzar NotFoundError cuando producto no existe', async () => {
      jest.spyOn(purchaseOrdersRepository, 'findProductById').mockResolvedValue(null);

      await expect(
        service.create({ productId: 'nonexistent', quantity: 100 })
      ).rejects.toThrow('Producto con id nonexistent no encontrado');
    });

    it('debe lanzar BusinessRuleError cuando cantidad es menor al minimo', async () => {
      jest.spyOn(purchaseOrdersRepository, 'findProductById').mockResolvedValue({
        id: 'prod-1',
        minimumStock: 50,
        supplier: 'Test Supplier'
      } as any);

      await expect(
        service.create({ productId: 'prod-1', quantity: 50 })
      ).rejects.toThrow('Cantidad mínima debe ser 100');
    });

    it('debe crear orden exitosamente', async () => {
      const product = { id: 'prod-1', minimumStock: 50, supplier: 'Test Supplier' };
      const createdOrder = {
        id: 'new-order',
        productId: 'prod-1',
        supplier: 'Test Supplier',
        quantity: 100,
        status: 'PENDING'
      };

      jest.spyOn(purchaseOrdersRepository, 'findProductById').mockResolvedValue(product as any);
      jest.spyOn(purchaseOrdersRepository, 'create').mockResolvedValue(createdOrder as any);

      const result = await service.create({ productId: 'prod-1', quantity: 100 });

      expect(result).toEqual(createdOrder);
    });
  });

  describe('approve', () => {
    it('debe lanzar NotFoundError cuando orden no existe', async () => {
      jest.spyOn(purchaseOrdersRepository, 'findById').mockResolvedValue(null);

      await expect(service.approve('nonexistent')).rejects.toThrow(
        'Orden de compra con id nonexistent no encontrada'
      );
    });

    it('debe lanzar BusinessRuleError cuando orden no esta PENDING', async () => {
      jest.spyOn(purchaseOrdersRepository, 'findById').mockResolvedValue({
        id: '123',
        status: 'APPROVED'
      } as any);

      await expect(service.approve('123')).rejects.toThrow(
        'Solo se pueden aprobar órdenes en estado PENDING'
      );
    });

    it('debe aprobar orden exitosamente', async () => {
      const order = { id: '123', status: 'PENDING' };
      const approvedOrder = { ...order, status: 'APPROVED' };

      jest.spyOn(purchaseOrdersRepository, 'findById').mockResolvedValue(order as any);
      jest.spyOn(purchaseOrdersRepository, 'updateStatus').mockResolvedValue(approvedOrder as any);

      const result = await service.approve('123');

      expect(result.status).toBe('APPROVED');
    });
  });

  describe('reject', () => {
    it('debe lanzar NotFoundError cuando orden no existe', async () => {
      jest.spyOn(purchaseOrdersRepository, 'findById').mockResolvedValue(null);

      await expect(service.reject('nonexistent', 'Reason')).rejects.toThrow(
        'Orden de compra con id nonexistent no encontrada'
      );
    });

    it('debe lanzar BusinessRuleError cuando orden no esta PENDING', async () => {
      jest.spyOn(purchaseOrdersRepository, 'findById').mockResolvedValue({
        id: '123',
        status: 'REJECTED'
      } as any);

      await expect(service.reject('123', 'Reason')).rejects.toThrow(
        'Solo se pueden rechazar órdenes en estado PENDING'
      );
    });

    it('debe rechazar orden exitosamente', async () => {
      const order = { id: '123', status: 'PENDING' };
      const rejectedOrder = { ...order, status: 'REJECTED' };

      jest.spyOn(purchaseOrdersRepository, 'findById').mockResolvedValue(order as any);
      jest.spyOn(purchaseOrdersRepository, 'updateStatus').mockResolvedValue(rejectedOrder as any);

      const result = await service.reject('123', 'Reason');

      expect(result.status).toBe('REJECTED');
    });
  });

  describe('receive', () => {
    it('debe lanzar NotFoundError cuando orden no existe', async () => {
      jest.spyOn(purchaseOrdersRepository, 'findById').mockResolvedValue(null);

      await expect(service.receive('nonexistent')).rejects.toThrow(
        'Orden de compra con id nonexistent no encontrada'
      );
    });

    it('debe lanzar BusinessRuleError cuando orden no esta APPROVED', async () => {
      jest.spyOn(purchaseOrdersRepository, 'findById').mockResolvedValue({
        id: '123',
        status: 'PENDING'
      } as any);

      await expect(service.receive('123')).rejects.toThrow(
        'Solo se pueden recibir órdenes en estado APPROVED'
      );
    });

    it('debe recibir orden exitosamente', async () => {
      const order = { id: '123', status: 'APPROVED', productId: 'prod-1', quantity: 100 };
      const receivedOrder = { ...order, status: 'RECEIVED' };

      jest.spyOn(purchaseOrdersRepository, 'findById').mockResolvedValue(order as any);
      jest.spyOn(purchaseOrdersRepository, 'transaction').mockImplementation(async (cb) => cb());
      jest.spyOn(purchaseOrdersRepository, 'updateStatus').mockResolvedValue(receivedOrder as any);
      jest.spyOn(purchaseOrdersRepository, 'updateProductStock').mockResolvedValue({} as any);
      jest.spyOn(purchaseOrdersRepository, 'findActiveAlertByProductId').mockResolvedValue(null);

      const result = await service.receive('123');

      expect(result.status).toBe('RECEIVED');
    });
  });
});

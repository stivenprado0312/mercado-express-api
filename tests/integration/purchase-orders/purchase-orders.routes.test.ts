import request from 'supertest';
import { createApp } from '../../../src/app';

jest.mock('../../../src/modules/purchase-orders/purchase-orders.repository');
jest.mock('../../../src/modules/products/products.repository');
jest.mock('../../../src/modules/inventory/inventory.repository');
jest.mock('../../../src/database/index', () => ({
  default: {}
}));

describe('GET /purchase-orders', () => {
  const app = createApp();

  it('debe retornar 200 con lista de órdenes', async () => {
    const mockOrders = [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        productId: 'prod-1',
        supplier: 'Distribuidora Andina',
        quantity: 100,
        status: 'PENDING',
        rejectionReason: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        approvedAt: null,
        receivedAt: null,
        product: {
          id: 'prod-1',
          name: 'Agua Mineral 500ml',
          sku: 'BEB-001'
        }
      }
    ];

    const { purchaseOrdersRepository } = require('../../../src/modules/purchase-orders/purchase-orders.repository');
    purchaseOrdersRepository.findAll.mockResolvedValue(mockOrders);

    const response = await request(app).get('/purchase-orders');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});

describe('POST /purchase-orders', () => {
  const app = createApp();

  it('debe retornar 201 al crear orden válida', async () => {
    const orderData = {
      productId: '123e4567-e89b-12d3-a456-426614174000',
      quantity: 100
    };

    const createdOrder = {
      id: 'order-1',
      productId: orderData.productId,
      supplier: 'Distribuidora Andina',
      quantity: orderData.quantity,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const { purchaseOrdersRepository } = require('../../../src/modules/purchase-orders/purchase-orders.repository');
    purchaseOrdersRepository.findProductById.mockResolvedValue({
      id: orderData.productId,
      supplier: 'Distribuidora Andina',
      minimumStock: 50
    });
    purchaseOrdersRepository.create.mockResolvedValue(createdOrder);

    const response = await request(app).post('/purchase-orders').send(orderData);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });

  it('debe retornar 400 cuando falta quantity', async () => {
    const invalidData = {
      productId: '123e4567-e89b-12d3-a456-426614174000'
    };

    const response = await request(app).post('/purchase-orders').send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('debe retornar 422 cuando cantidad es menor al mínimo', async () => {
    const orderData = {
      productId: '123e4567-e89b-12d3-a456-426614174000',
      quantity: 10
    };

    const { purchaseOrdersRepository } = require('../../../src/modules/purchase-orders/purchase-orders.repository');
    purchaseOrdersRepository.findProductById.mockResolvedValue({
      id: orderData.productId,
      supplier: 'Distribuidora Andina',
      minimumStock: 50
    });

    const response = await request(app).post('/purchase-orders').send(orderData);

    expect(response.status).toBe(422);
    expect(response.body.success).toBe(false);
  });
});

describe('PATCH /purchase-orders/:id/approve', () => {
  const app = createApp();

  it('debe retornar 200 al aprobar orden PENDING', async () => {
    const orderId = '123e4567-e89b-12d3-a456-426614174000';
    const order = {
      id: orderId,
      status: 'PENDING',
      productId: 'prod-1'
    };

    const { purchaseOrdersRepository } = require('../../../src/modules/purchase-orders/purchase-orders.repository');
    purchaseOrdersRepository.findById.mockResolvedValue(order);
    purchaseOrdersRepository.updateStatus.mockResolvedValue({ ...order, status: 'APPROVED' });

    const response = await request(app).patch(`/purchase-orders/${orderId}/approve`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('debe retornar 422 al aprobar orden no PENDING', async () => {
    const orderId = '123e4567-e89b-12d3-a456-426614174000';
    const order = {
      id: orderId,
      status: 'APPROVED',
      productId: 'prod-1'
    };

    const { purchaseOrdersRepository } = require('../../../src/modules/purchase-orders/purchase-orders.repository');
    purchaseOrdersRepository.findById.mockResolvedValue(order);

    const response = await request(app).patch(`/purchase-orders/${orderId}/approve`);

    expect(response.status).toBe(422);
    expect(response.body.success).toBe(false);
  });
});

describe('PATCH /purchase-orders/:id/reject', () => {
  const app = createApp();

  it('debe retornar 200 al rechazar orden PENDING', async () => {
    const orderId = '123e4567-e89b-12d3-a456-426614174000';
    const order = {
      id: orderId,
      status: 'PENDING',
      productId: 'prod-1'
    };

    const { purchaseOrdersRepository } = require('../../../src/modules/purchase-orders/purchase-orders.repository');
    purchaseOrdersRepository.findById.mockResolvedValue(order);
    purchaseOrdersRepository.updateStatus.mockResolvedValue({ ...order, status: 'REJECTED' });

    const response = await request(app)
      .patch(`/purchase-orders/${orderId}/reject`)
      .send({ id: orderId, rejectionReason: 'Proveedor no disponible por el momento' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('debe retornar 400 cuando motivo es muy corto', async () => {
    const orderId = '123e4567-e89b-12d3-a456-426614174000';

    const response = await request(app)
      .patch(`/purchase-orders/${orderId}/reject`)
      .send({ id: orderId, rejectionReason: 'corto' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});

describe('PATCH /purchase-orders/:id/receive', () => {
  const app = createApp();

  it('debe retornar 200 al recibir orden APPROVED', async () => {
    const orderId = '123e4567-e89b-12d3-a456-426614174000';
    const order = {
      id: orderId,
      status: 'APPROVED',
      productId: 'prod-1',
      quantity: 100
    };

    const { purchaseOrdersRepository } = require('../../../src/modules/purchase-orders/purchase-orders.repository');
    purchaseOrdersRepository.findById.mockResolvedValue(order);
    purchaseOrdersRepository.transaction.mockImplementation(async (fn: () => Promise<unknown>) => fn());
    purchaseOrdersRepository.updateStatus.mockResolvedValue({ ...order, status: 'RECEIVED' });
    purchaseOrdersRepository.updateProductStock.mockResolvedValue({});
    purchaseOrdersRepository.findActiveAlertByProductId.mockResolvedValue(null);

    const response = await request(app).patch(`/purchase-orders/${orderId}/receive`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('debe retornar 422 al recibir orden no APPROVED', async () => {
    const orderId = '123e4567-e89b-12d3-a456-426614174000';
    const order = {
      id: orderId,
      status: 'PENDING',
      productId: 'prod-1'
    };

    const { purchaseOrdersRepository } = require('../../../src/modules/purchase-orders/purchase-orders.repository');
    purchaseOrdersRepository.findById.mockResolvedValue(order);

    const response = await request(app).patch(`/purchase-orders/${orderId}/receive`);

    expect(response.status).toBe(422);
    expect(response.body.success).toBe(false);
  });
});

import request from 'supertest';
import { createApp } from '../../../src/app';

jest.mock('../../../src/modules/inventory/inventory.repository');
jest.mock('../../../src/modules/products/products.repository');
jest.mock('../../../src/database/index', () => ({
  default: {}
}));

describe('POST /inventory/adjust', () => {
  const app = createApp();

  it('debe retornar 200 al ajustar stock exitosamente', async () => {
    const adjustData = {
      productId: '123e4567-e89b-12d3-a456-426614174000',
      type: 'ENTRY',
      quantity: 50,
      reason: 'Entrada de mercadería'
    };

    const updatedProduct = {
      id: adjustData.productId,
      name: 'Agua Mineral 500ml',
      sku: 'BEB-001',
      category: 'Bebidas',
      price: 1500,
      currentStock: 200,
      minimumStock: 50,
      supplier: 'Distribuidora Andina',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const { inventoryRepository } = require('../../../src/modules/inventory/inventory.repository');
    inventoryRepository.findProductById.mockResolvedValue({
      id: adjustData.productId,
      currentStock: 150,
      minimumStock: 50
    });
    inventoryRepository.updateStock.mockResolvedValue(updatedProduct);
    inventoryRepository.createMovement.mockResolvedValue({});
    inventoryRepository.findActiveAlertByProductId.mockResolvedValue(null);

    const response = await request(app).post('/inventory/adjust').send(adjustData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('debe retornar 400 cuando falta quantity', async () => {
    const invalidData = {
      productId: '123e4567-e89b-12d3-a456-426614174000',
      type: 'ENTRY',
      reason: 'Entrada de mercadería'
    };

    const response = await request(app).post('/inventory/adjust').send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('debe retornar 400 cuando type es invalido', async () => {
    const invalidData = {
      productId: '123e4567-e89b-12d3-a456-426614174000',
      type: 'INVALID',
      quantity: 50,
      reason: 'Entrada de mercadería'
    };

    const response = await request(app).post('/inventory/adjust').send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });
});

describe('GET /inventory', () => {
  const app = createApp();

  it('debe retornar 200 con lista de inventario', async () => {
    const mockInventory = [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Agua Mineral 500ml',
        sku: 'BEB-001',
        category: 'Bebidas',
        price: 1500,
        currentStock: 150,
        minimumStock: 50,
        supplier: 'Distribuidora Andina',
        createdAt: new Date(),
        updatedAt: new Date(),
        alerts: []
      }
    ];

    const { inventoryRepository } = require('../../../src/modules/inventory/inventory.repository');
    inventoryRepository.findProductsWithFilters.mockResolvedValue(mockInventory);

    const response = await request(app).get('/inventory');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});

describe('GET /inventory/movements/:productId', () => {
  const app = createApp();

  it('debe retornar 200 con movimientos del producto', async () => {
    const productId = '123e4567-e89b-12d3-a456-426614174000';
    const mockMovements = [
      {
        id: 'move-1',
        productId,
        type: 'ENTRY',
        quantity: 50,
        reason: 'Entrada de mercadería',
        createdAt: new Date()
      }
    ];

    const { inventoryRepository } = require('../../../src/modules/inventory/inventory.repository');
    inventoryRepository.findProductById.mockResolvedValue({ id: productId });
    inventoryRepository.getMovementsByProductId.mockResolvedValue(mockMovements);

    const response = await request(app).get(`/inventory/movements/${productId}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});

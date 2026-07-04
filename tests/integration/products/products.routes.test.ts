import request from 'supertest';
import { createApp } from '../../../src/app';

jest.mock('../../../src/modules/products/products.repository');
jest.mock('../../../src/database/index', () => ({
  default: {}
}));

describe('GET /products', () => {
  const app = createApp();

  it('debe retornar 200 con lista de productos', async () => {
    const createdAt = new Date();
    const updatedAt = new Date();
    const mockProducts = [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Agua Mineral 500ml',
        sku: 'BEB-001',
        category: 'Bebidas',
        price: 1500,
        currentStock: 150,
        minimumStock: 50,
        supplier: 'Distribuidora Andina',
        createdAt,
        updatedAt
      }
    ];

    const { productsRepository } = require('../../../src/modules/products/products.repository');
    productsRepository.findAll.mockResolvedValue(mockProducts);

    const response = await request(app).get('/products');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].id).toBe(mockProducts[0].id);
    expect(response.body.data[0].name).toBe(mockProducts[0].name);
    expect(response.body.data[0].sku).toBe(mockProducts[0].sku);
  });
});

describe('POST /products', () => {
  const app = createApp();

  it('debe retornar 201 al crear producto valido', async () => {
    const newProduct = {
      name: 'Agua Mineral 500ml',
      sku: 'BEB-001',
      category: 'Bebidas',
      price: 1500,
      currentStock: 150,
      minimumStock: 50,
      supplier: 'Distribuidora Andina'
    };

    const createdProduct = {
      ...newProduct,
      id: '123e4567-e89b-12d3-a456-426614174000',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const { productsRepository } = require('../../../src/modules/products/products.repository');
    productsRepository.findBySku.mockResolvedValue(null);
    productsRepository.create.mockResolvedValue(createdProduct);

    const response = await request(app).post('/products').send(newProduct);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe(newProduct.name);
  });

  it('debe retornar 400 cuando falta nombre', async () => {
    const invalidProduct = {
      sku: 'BEB-001',
      category: 'Bebidas',
      price: 1500,
      currentStock: 150,
      minimumStock: 50,
      supplier: 'Distribuidora Andina'
    };

    const response = await request(app).post('/products').send(invalidProduct);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('debe retornar 400 cuando SKU es invalido', async () => {
    const invalidProduct = {
      name: 'Agua Mineral 500ml',
      sku: 'AB', // muy corto
      category: 'Bebidas',
      price: 1500,
      currentStock: 150,
      minimumStock: 50,
      supplier: 'Distribuidora Andina'
    };

    const response = await request(app).post('/products').send(invalidProduct);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('debe retornar 409 cuando SKU ya existe', async () => {
    const duplicateProduct = {
      name: 'Agua Mineral 500ml',
      sku: 'BEB-001',
      category: 'Bebidas',
      price: 1500,
      currentStock: 150,
      minimumStock: 50,
      supplier: 'Distribuidora Andina'
    };

    const { productsRepository } = require('../../../src/modules/products/products.repository');
    productsRepository.findBySku.mockResolvedValue({ sku: 'BEB-001' });

    const response = await request(app).post('/products').send(duplicateProduct);

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
  });
});

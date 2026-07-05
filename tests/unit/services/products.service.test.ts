import { ProductsService } from '../../../src/modules/products/products.service';
import { productsRepository } from '../../../src/modules/products/products.repository';

jest.mock('../../../src/database/index', () => ({ default: {} }));

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ProductsService();
  });

  describe('getById', () => {
    it('debe lanzar NotFoundError cuando producto no existe', async () => {
      jest.spyOn(productsRepository, 'findById').mockResolvedValue(null);

      await expect(service.getById('nonexistent')).rejects.toThrow(
        'Producto con id nonexistent no encontrado'
      );
    });

    it('debe retornar producto cuando existe', async () => {
      const mockProduct = {
        id: '123',
        name: 'Test Product',
        sku: 'TEST-001',
        category: 'Bebidas',
        price: 1000,
        currentStock: 50,
        minimumStock: 10,
        supplier: 'Test Supplier'
      };

      jest.spyOn(productsRepository, 'findById').mockResolvedValue(mockProduct as any);

      const result = await service.getById('123');

      expect(result).toEqual(mockProduct);
    });
  });

  describe('getBySku', () => {
    it('debe lanzar NotFoundError cuando SKU no existe', async () => {
      jest.spyOn(productsRepository, 'findBySku').mockResolvedValue(null);

      await expect(service.getBySku('NONEXISTENT')).rejects.toThrow(
        'Producto con SKU NONEXISTENT no encontrado'
      );
    });
  });

  describe('create', () => {
    const validProductData = {
      name: 'Agua Mineral 500ml',
      sku: 'BEB-001',
      category: 'Bebidas' as const,
      price: 1500,
      currentStock: 150,
      minimumStock: 50,
      supplier: 'Distribuidora Andina'
    };

    it('debe lanzar ConflictError cuando SKU ya existe', async () => {
      jest.spyOn(productsRepository, 'findBySku').mockResolvedValue({ sku: validProductData.sku } as any);

      await expect(service.create(validProductData)).rejects.toThrow(
        `Ya existe un producto con SKU ${validProductData.sku}`
      );
    });

    it('debe crear producto cuando SKU no existe', async () => {
      const createdProduct = {
        ...validProductData,
        id: 'new-id',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      jest.spyOn(productsRepository, 'findBySku').mockResolvedValue(null);
      jest.spyOn(productsRepository, 'create').mockResolvedValue(createdProduct as any);

      const result = await service.create(validProductData);

      expect(result).toEqual(createdProduct);
    });
  });

  describe('list', () => {
    it('debe retornar lista de productos', async () => {
      const mockProducts = [
        { id: '1', name: 'Product 1', sku: 'P1' },
        { id: '2', name: 'Product 2', sku: 'P2' }
      ];

      jest.spyOn(productsRepository, 'findAll').mockResolvedValue(mockProducts as any);

      const result = await service.list();

      expect(result).toEqual(mockProducts);
    });
  });
});

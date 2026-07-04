import { ConflictError, NotFoundError } from '../../shared/errors';
import { productsRepository } from './products.repository';
import type { CreateProductDto, ListProductsQuery } from './products.schemas';

export class ProductsService {
  async getById(id: string) {
    const product = await productsRepository.findById(id);
    if (!product) {
      throw new NotFoundError(`Producto con id ${id} no encontrado`);
    }
    return product;
  }

  async getBySku(sku: string) {
    const product = await productsRepository.findBySku(sku);
    if (!product) {
      throw new NotFoundError(`Producto con SKU ${sku} no encontrado`);
    }
    return product;
  }

  async list(query: ListProductsQuery) {
    return productsRepository.findAll(query);
  }

  async create(data: CreateProductDto) {
    const existingBySku = await productsRepository.findBySku(data.sku);
    if (existingBySku) {
      throw new ConflictError(`Ya existe un producto con SKU ${data.sku}`);
    }

    return productsRepository.create(data);
  }
}

export const productsService = new ProductsService();

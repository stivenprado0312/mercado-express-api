import prisma from '../../database/index';
import type { CreateProductDto } from './products.schemas';

export class ProductsRepository {
  async findById(id: string) {
    return prisma.product.findUnique({ where: { id } });
  }

  async findBySku(sku: string) {
    return prisma.product.findUnique({ where: { sku } });
  }

  async findAll() {
    return prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async create(data: CreateProductDto) {
    return prisma.product.create({ data });
  }
}

export const productsRepository = new ProductsRepository();

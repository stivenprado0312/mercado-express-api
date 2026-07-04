import { Prisma } from '@prisma/client';
import prisma from '../../database/index';
import type { CreateProductDto, ListProductsQuery } from './products.schemas';

export class ProductsRepository {
  async findById(id: string) {
    return prisma.product.findUnique({ where: { id } });
  }

  async findBySku(sku: string) {
    return prisma.product.findUnique({ where: { sku } });
  }

  async findAll(query: ListProductsQuery) {
    const where: Prisma.ProductWhereInput = {};

    if (query.category) {
      where.category = query.category;
    }

    if (query.supplier) {
      where.supplier = query.supplier;
    }

    if (query.minStock !== undefined || query.maxStock !== undefined) {
      where.currentStock = {};
      if (query.minStock !== undefined) {
        where.currentStock.gte = query.minStock;
      }
      if (query.maxStock !== undefined) {
        where.currentStock.lte = query.maxStock;
      }
    }

    return prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  async create(data: CreateProductDto) {
    return prisma.product.create({ data });
  }

  async updateStock(id: string, quantity: number) {
    return prisma.product.update({
      where: { id },
      data: { currentStock: { increment: quantity } }
    });
  }
}

export const productsRepository = new ProductsRepository();

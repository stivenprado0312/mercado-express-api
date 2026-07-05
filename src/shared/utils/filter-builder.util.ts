export interface ProductFilters {
  category?: string;
  supplier?: string;
  minStock?: number;
  maxStock?: number;
}

export function buildProductFilters(query: ProductFilters): Record<string, unknown> {
  const where: Record<string, unknown> = {};

  if (query.category) {
    where.category = query.category;
  }

  if (query.supplier) {
    where.supplier = query.supplier;
  }

  if (query.minStock !== undefined || query.maxStock !== undefined) {
    where.currentStock = {};
    if (query.minStock !== undefined) {
      (where.currentStock as Record<string, number>).gte = query.minStock;
    }
    if (query.maxStock !== undefined) {
      (where.currentStock as Record<string, number>).lte = query.maxStock;
    }
  }

  return where;
}

import { z } from 'zod';
import { CATEGORIES, uuidSchema } from '../../shared/constants/domain.constants';

export { CATEGORIES };

export const createProductSchema = z.object({
  name: z.string().min(3).max(100),
  sku: z.string().min(6).max(20).regex(/^[A-Z0-9-]+$/i, 'SKU debe ser alfanumérico'),
  category: z.enum(CATEGORIES, {
    errorMap: () => ({
      message: `Categoría debe ser una de: ${CATEGORIES.join(', ')}`
    })
  }),
  price: z.number().positive('El precio debe ser mayor a 0'),
  currentStock: z.number().int().min(0, 'Stock no puede ser negativo'),
  minimumStock: z.number().int().positive('Stock mínimo debe ser mayor a 0'),
  supplier: z.string().min(1, 'Proveedor es obligatorio')
});

export const getProductByIdSchema = z.object({
  id: uuidSchema
});

export const listProductsQuerySchema = z.object({});

export type CreateProductDto = z.infer<typeof createProductSchema>;
export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;
export type GetProductByIdDto = z.infer<typeof getProductByIdSchema>;

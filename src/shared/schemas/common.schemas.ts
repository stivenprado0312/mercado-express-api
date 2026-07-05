import { z } from 'zod';
import { AlertStatus, OrderStatus } from '../constants/domain.constants';

export const uuidSchema = z.string().uuid('ID debe ser un UUID válido');

export const productQueryFiltersSchema = z.object({
  category: z.string().optional(),
  supplier: z.string().optional(),
  minStock: z.coerce.number().int().optional(),
  maxStock: z.coerce.number().int().optional()
});

export const alertStatusFilterSchema = z.object({
  status: z.enum([AlertStatus.ACTIVE, AlertStatus.RESOLVED]).optional()
});

export const orderStatusFilterSchema = z.object({
  status: z.enum([OrderStatus.PENDING, OrderStatus.APPROVED, OrderStatus.REJECTED, OrderStatus.RECEIVED]).optional(),
  productId: uuidSchema.optional()
});

export type UuidSchema = z.infer<typeof uuidSchema>;
export type ProductQueryFiltersSchema = z.infer<typeof productQueryFiltersSchema>;

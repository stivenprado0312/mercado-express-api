import { z } from 'zod';

export const adjustInventorySchema = z.object({
  productId: z.string().uuid('ID debe ser un UUID válido'),
  type: z.enum(['ENTRY', 'EXIT']),
  quantity: z.number().int().positive('Cantidad debe ser mayor a 0'),
  reason: z.string().min(1, 'Motivo es obligatorio')
});

export const getMovementsByProductSchema = z.object({
  productId: z.string().uuid('ID debe ser un UUID válido')
});

export const listInventoryQuerySchema = z.object({
  category: z.string().optional(),
  supplier: z.string().optional(),
  minStock: z.coerce.number().int().optional(),
  maxStock: z.coerce.number().int().optional(),
  alertStatus: z.enum(['ACTIVE', 'RESOLVED']).optional()
});

export type AdjustInventoryDto = z.infer<typeof adjustInventorySchema>;
export type GetMovementsByProductDto = z.infer<typeof getMovementsByProductSchema>;
export type ListInventoryQuery = z.infer<typeof listInventoryQuerySchema>;

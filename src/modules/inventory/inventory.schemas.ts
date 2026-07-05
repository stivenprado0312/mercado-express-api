import { z } from 'zod';
import { MovementType, AlertStatus, uuidSchema } from '../../shared/constants/domain.constants';
import { productQueryFiltersSchema } from '../../shared/schemas/common.schemas';

export const adjustInventorySchema = z.object({
  productId: uuidSchema,
  type: z.enum([MovementType.ENTRY, MovementType.EXIT]),
  quantity: z.number().int().positive('Cantidad debe ser mayor a 0'),
  reason: z.string().min(1, 'Motivo es obligatorio')
});

export const getMovementsByProductSchema = z.object({
  productId: uuidSchema
});

export const listInventoryQuerySchema = productQueryFiltersSchema.extend({
  alertStatus: z.enum([AlertStatus.ACTIVE, AlertStatus.RESOLVED]).optional()
});

export type AdjustInventoryDto = z.infer<typeof adjustInventorySchema>;
export type GetMovementsByProductDto = z.infer<typeof getMovementsByProductSchema>;
export type ListInventoryQuery = z.infer<typeof listInventoryQuerySchema>;

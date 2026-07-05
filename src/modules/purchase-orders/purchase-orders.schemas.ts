import { z } from 'zod';
import { BUSINESS_RULES, uuidSchema } from '../../shared/constants/domain.constants';
import { orderStatusFilterSchema } from '../../shared/schemas/common.schemas';

export const createPurchaseOrderSchema = z.object({
  productId: uuidSchema,
  quantity: z.number().int().positive('Cantidad debe ser mayor a 0')
});

export const getPurchaseOrderByIdSchema = z.object({
  id: uuidSchema
});

export const rejectPurchaseOrderSchema = z.object({
  rejectionReason: z.string().min(
    BUSINESS_RULES.MINIMUM_REJECTION_LENGTH,
    `Motivo de rechazo debe tener al menos ${BUSINESS_RULES.MINIMUM_REJECTION_LENGTH} caracteres`
  )
});

export const listPurchaseOrdersQuerySchema = orderStatusFilterSchema;

export type CreatePurchaseOrderDto = z.infer<typeof createPurchaseOrderSchema>;
export type GetPurchaseOrderByIdDto = z.infer<typeof getPurchaseOrderByIdSchema>;
export type RejectPurchaseOrderDto = z.infer<typeof rejectPurchaseOrderSchema>;
export type ListPurchaseOrdersQuery = z.infer<typeof listPurchaseOrdersQuerySchema>;

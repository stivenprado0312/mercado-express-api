import { z } from 'zod';

export const createPurchaseOrderSchema = z.object({
  productId: z.string().uuid('ID debe ser un UUID válido'),
  quantity: z.number().int().positive('Cantidad debe ser mayor a 0')
});

export const getPurchaseOrderByIdSchema = z.object({
  id: z.string().uuid('ID debe ser un UUID válido')
});

export const rejectPurchaseOrderSchema = z.object({
  id: z.string().uuid('ID debe ser un UUID válido'),
  rejectionReason: z.string().min(10, 'Motivo de rechazo debe tener al menos 10 caracteres')
});

export const listPurchaseOrdersQuerySchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'RECEIVED']).optional(),
  productId: z.string().uuid().optional()
});

export type CreatePurchaseOrderDto = z.infer<typeof createPurchaseOrderSchema>;
export type GetPurchaseOrderByIdDto = z.infer<typeof getPurchaseOrderByIdSchema>;
export type RejectPurchaseOrderDto = z.infer<typeof rejectPurchaseOrderSchema>;
export type ListPurchaseOrdersQuery = z.infer<typeof listPurchaseOrdersQuerySchema>;

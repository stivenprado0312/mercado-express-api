import { z } from 'zod';

export const listAlertsQuerySchema = z.object({
  status: z.enum(['ACTIVE', 'RESOLVED']).optional()
});

export const getAlertByIdSchema = z.object({
  id: z.string().uuid('ID debe ser un UUID válido')
});

export type ListAlertsQuery = z.infer<typeof listAlertsQuerySchema>;
export type GetAlertByIdDto = z.infer<typeof getAlertByIdSchema>;

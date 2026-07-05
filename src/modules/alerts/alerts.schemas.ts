import { z } from 'zod';
import { uuidSchema } from '../../shared/constants/domain.constants';
import { alertStatusFilterSchema } from '../../shared/schemas/common.schemas';

export const listAlertsQuerySchema = alertStatusFilterSchema;

export const getAlertByIdSchema = z.object({
  id: uuidSchema
});

export type ListAlertsQuery = z.infer<typeof listAlertsQuerySchema>;
export type GetAlertByIdDto = z.infer<typeof getAlertByIdSchema>;

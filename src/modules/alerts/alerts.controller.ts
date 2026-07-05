import { Request, Response, NextFunction } from 'express';
import { alertsService } from './alerts.service';
import { listAlertsQuerySchema, getAlertByIdSchema } from './alerts.schemas';
import { successResponse } from '../../shared/responses';
import { validateQuery, validateParams } from '../../shared/middlewares/validate-request.middleware';

export class AlertsController {
  list = [
    validateQuery(listAlertsQuerySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const alerts = await alertsService.list(req.query as any);
        successResponse(res, 'Alertas encontradas', alerts);
      } catch (error) {
        next(error);
      }
    }
  ];

  getById = [
    validateParams(getAlertByIdSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const alert = await alertsService.getById(req.params.id as string);
        successResponse(res, 'Alerta encontrada', alert);
      } catch (error) {
        next(error);
      }
    }
  ];

  resolve = [
    validateParams(getAlertByIdSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const alert = await alertsService.resolve(req.params.id as string);
        successResponse(res, 'Alerta resuelta', alert);
      } catch (error) {
        next(error);
      }
    }
  ];
}

export const alertsController = new AlertsController();

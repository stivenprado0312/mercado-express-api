import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { alertsService } from './alerts.service';
import { listAlertsQuerySchema, getAlertByIdSchema } from './alerts.schemas';
import { successResponse } from '../../shared/responses';

export class AlertsController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = listAlertsQuerySchema.parse(req.query);
      const alerts = await alertsService.list(query);
      successResponse(res, 'Alertas encontradas', alerts);
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
        return;
      }
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = getAlertByIdSchema.parse(req.params);
      const alert = await alertsService.getById(id);
      successResponse(res, 'Alerta encontrada', alert);
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
        return;
      }
      next(error);
    }
  }

  async resolve(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = getAlertByIdSchema.parse(req.params);
      const alert = await alertsService.resolve(id);
      successResponse(res, 'Alerta resuelta', alert);
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
        return;
      }
      next(error);
    }
  }
}

export const alertsController = new AlertsController();

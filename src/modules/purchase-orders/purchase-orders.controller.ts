import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { purchaseOrdersService } from './purchase-orders.service';
import {
  createPurchaseOrderSchema,
  getPurchaseOrderByIdSchema,
  rejectPurchaseOrderSchema,
  listPurchaseOrdersQuerySchema
} from './purchase-orders.schemas';
import { successResponse } from '../../shared/responses';

export class PurchaseOrdersController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = listPurchaseOrdersQuerySchema.parse(req.query);
      const orders = await purchaseOrdersService.list(query);
      successResponse(res, 'Órdenes de compra encontradas', orders);
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
      const { id } = getPurchaseOrderByIdSchema.parse(req.params);
      const order = await purchaseOrdersService.getById(id);
      successResponse(res, 'Orden de compra encontrada', order);
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
        return;
      }
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = createPurchaseOrderSchema.parse(req.body);
      const order = await purchaseOrdersService.create(data);
      successResponse(res, 'Orden de compra creada exitosamente', order, 201);
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
        return;
      }
      next(error);
    }
  }

  async approve(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = getPurchaseOrderByIdSchema.parse(req.params);
      const order = await purchaseOrdersService.approve(id);
      successResponse(res, 'Orden de compra aprobada', order);
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
        return;
      }
      next(error);
    }
  }

  async reject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, rejectionReason } = rejectPurchaseOrderSchema.parse(req.body);
      const order = await purchaseOrdersService.reject(id, rejectionReason);
      successResponse(res, 'Orden de compra rechazada', order);
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
        return;
      }
      next(error);
    }
  }

  async receive(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = getPurchaseOrderByIdSchema.parse(req.params);
      const order = await purchaseOrdersService.receive(id);
      successResponse(res, 'Orden de compra recibida', order);
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
        return;
      }
      next(error);
    }
  }
}

export const purchaseOrdersController = new PurchaseOrdersController();

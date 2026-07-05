import { Request, Response, NextFunction } from 'express';
import { purchaseOrdersService } from './purchase-orders.service';
import {
  createPurchaseOrderSchema,
  getPurchaseOrderByIdSchema,
  rejectPurchaseOrderSchema,
  listPurchaseOrdersQuerySchema
} from './purchase-orders.schemas';
import { successResponse } from '../../shared/responses';
import { validateBody, validateQuery, validateParams } from '../../shared/middlewares/validate-request.middleware';

export class PurchaseOrdersController {
  list = [
    validateQuery(listPurchaseOrdersQuerySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const orders = await purchaseOrdersService.list(req.query as any);
        successResponse(res, 'Órdenes de compra encontradas', orders);
      } catch (error) {
        next(error);
      }
    }
  ];

  getById = [
    validateParams(getPurchaseOrderByIdSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const order = await purchaseOrdersService.getById(req.params.id as string);
        successResponse(res, 'Orden de compra encontrada', order);
      } catch (error) {
        next(error);
      }
    }
  ];

  create = [
    validateBody(createPurchaseOrderSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const order = await purchaseOrdersService.create(req.body);
        successResponse(res, 'Orden de compra creada exitosamente', order, 201);
      } catch (error) {
        next(error);
      }
    }
  ];

  approve = [
    validateParams(getPurchaseOrderByIdSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const order = await purchaseOrdersService.approve(req.params.id as string);
        successResponse(res, 'Orden de compra aprobada', order);
      } catch (error) {
        next(error);
      }
    }
  ];

  reject = [
    validateBody(rejectPurchaseOrderSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const { rejectionReason } = req.body;
        const order = await purchaseOrdersService.reject(req.params.id as string, rejectionReason);
        successResponse(res, 'Orden de compra rechazada', order);
      } catch (error) {
        next(error);
      }
    }
  ];

  receive = [
    validateParams(getPurchaseOrderByIdSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const order = await purchaseOrdersService.receive(req.params.id as string);
        successResponse(res, 'Orden de compra recibida', order);
      } catch (error) {
        next(error);
      }
    }
  ];
}

export const purchaseOrdersController = new PurchaseOrdersController();

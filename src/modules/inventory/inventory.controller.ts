import { Request, Response, NextFunction } from 'express';
import { inventoryService } from './inventory.service';
import {
  adjustInventorySchema,
  getMovementsByProductSchema,
  listInventoryQuerySchema
} from './inventory.schemas';
import { successResponse } from '../../shared/responses';
import { validateBody, validateQuery, validateParams } from '../../shared/middlewares/validate-request.middleware';

export class InventoryController {
  adjust = [
    validateBody(adjustInventorySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const product = await inventoryService.adjustStock(req.body);
        successResponse(res, 'Stock ajustado exitosamente', product);
      } catch (error) {
        next(error);
      }
    }
  ];

  getMovements = [
    validateParams(getMovementsByProductSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const movements = await inventoryService.getMovementsByProductId(req.params.productId as string);
        successResponse(res, 'Movimientos encontrados', movements);
      } catch (error) {
        next(error);
      }
    }
  ];

  list = [
    validateQuery(listInventoryQuerySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const inventory = await inventoryService.listInventory(req.query as any);
        successResponse(res, 'Inventario consultado', inventory);
      } catch (error) {
        next(error);
      }
    }
  ];
}

export const inventoryController = new InventoryController();

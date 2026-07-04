import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { inventoryService } from './inventory.service';
import {
  adjustInventorySchema,
  getMovementsByProductSchema,
  listInventoryQuerySchema
} from './inventory.schemas';
import { successResponse } from '../../shared/responses';

export class InventoryController {
  async adjust(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = adjustInventorySchema.parse(req.body);
      const product = await inventoryService.adjustStock(data);
      successResponse(res, 'Stock ajustado exitosamente', product);
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
        return;
      }
      next(error);
    }
  }

  async getMovements(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { productId } = getMovementsByProductSchema.parse(req.params);
      const movements = await inventoryService.getMovementsByProductId(productId);
      successResponse(res, 'Movimientos encontrados', movements);
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
        return;
      }
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = listInventoryQuerySchema.parse(req.query);
      const inventory = await inventoryService.listInventory(query);
      successResponse(res, 'Inventario consultado', inventory);
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
        return;
      }
      next(error);
    }
  }
}

export const inventoryController = new InventoryController();

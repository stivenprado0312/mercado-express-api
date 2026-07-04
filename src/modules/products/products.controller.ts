import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { productsService } from './products.service';
import {
  createProductSchema,
  getProductByIdSchema,
  listProductsQuerySchema
} from './products.schemas';
import { successResponse, createdResponse } from '../../shared/responses';

export class ProductsController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = listProductsQuerySchema.parse(req.query);
      const products = await productsService.list(query);
      successResponse(res, 'Productos encontrados', products);
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
      const { id } = getProductByIdSchema.parse(req.params);
      const product = await productsService.getById(id);
      successResponse(res, 'Producto encontrado', product);
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
      const data = createProductSchema.parse(req.body);
      const product = await productsService.create(data);
      createdResponse(res, 'Producto creado exitosamente', product);
    } catch (error) {
      if (error instanceof ZodError) {
        next(error);
        return;
      }
      next(error);
    }
  }
}

export const productsController = new ProductsController();

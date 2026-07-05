import { Request, Response, NextFunction } from 'express';
import { productsService } from './products.service';
import {
  createProductSchema,
  getProductByIdSchema
} from './products.schemas';
import { successResponse, createdResponse } from '../../shared/responses';
import { validateBody, validateParams } from '../../shared/middlewares/validate-request.middleware';

export class ProductsController {
  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (Object.keys(req.query).length > 0) {
        res.status(400).json({
          success: false,
          message: 'GET /products no soporta filtros. Usar GET /inventory para filtrar por categoría, proveedor, stock o estado de alerta.',
          data: null
        });
        return;
      }
      const products = await productsService.list();
      successResponse(res, 'Productos encontrados', products);
    } catch (error) {
      next(error);
    }
  };

  getById = [
    validateParams(getProductByIdSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const product = await productsService.getById(req.params.id as string);
        successResponse(res, 'Producto encontrado', product);
      } catch (error) {
        next(error);
      }
    }
  ];

  create = [
    validateBody(createProductSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        const product = await productsService.create(req.body);
        createdResponse(res, 'Producto creado exitosamente', product);
      } catch (error) {
        next(error);
      }
    }
  ];
}

export const productsController = new ProductsController();

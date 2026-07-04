import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';
import { logger } from './shared/logger/index';
import { notFoundMiddleware, errorHandler } from './middlewares/index';
import { swaggerSpec } from './shared/swagger/index';
import { successResponse } from './shared/responses/index';
import productsRoutes from './modules/products/products.routes';
import inventoryRoutes from './modules/inventory/inventory.routes';
import purchaseOrdersRoutes from './modules/purchase-orders/purchase-orders.routes';

export function createApp(): Application {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(compression());
  app.use(express.json());

  app.use(
    pinoHttp({
      logger,
      autoLogging: {
        ignore: (req) => req.url === '/health'
      }
    })
  );

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get('/health', (_req: Request, res: Response) => {
    successResponse(res, 'Mercado Express is running');
  });

  app.use('/products', productsRoutes);
  app.use('/inventory', inventoryRoutes);
  app.use('/purchase-orders', purchaseOrdersRoutes);

  app.use(notFoundMiddleware);
  app.use(errorHandler);

  return app;
}

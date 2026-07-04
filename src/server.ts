import { createApp } from './app';
import { config } from './config/index';
import { logger } from './shared/logger/index';

async function main(): Promise<void> {
  const app = createApp();

  app.listen(config.PORT, () => {
    logger.info(`Servidor corriendo en puerto ${config.PORT}`);
    logger.info(`Documentación Swagger disponible en http://localhost:${config.PORT}/docs`);
    logger.info(`Entorno: ${config.NODE_ENV}`);
  });
}

main().catch((err) => {
  logger.error({ err }, 'Error al iniciar el servidor');
  process.exit(1);
});

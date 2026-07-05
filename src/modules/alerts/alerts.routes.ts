import { Router } from 'express';
import { alertsController } from './alerts.controller';

const router = Router();

/**
 * @swagger
 * /alerts:
 *   get:
 *     summary: Listar alertas
 *     description: Obtiene una lista de alertas con filtro opcional por estado
 *     tags: [Alerts]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, RESOLVED]
 *         description: Filtrar por estado de alerta
 *     responses:
 *       200:
 *         description: Alertas encontradas
 */
router.get('/', alertsController.list);

/**
 * @swagger
 * /alerts/{id}:
 *   get:
 *     summary: Obtener alerta por ID
 *     tags: [Alerts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Alerta encontrada
 *       404:
 *         description: Alerta no encontrada
 */
router.get('/:id', alertsController.getById);

/**
 * @swagger
 * /alerts/{id}/resolve:
 *   post:
 *     summary: Resolver alerta manualmente
 *     description: Marca una alerta como RESOLVED
 *     tags: [Alerts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Alerta resuelta
 *       404:
 *         description: Alerta no encontrada
 */
router.post('/:id/resolve', alertsController.resolve);

export default router;

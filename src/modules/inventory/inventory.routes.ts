import { Router } from 'express';
import { inventoryController } from './inventory.controller';

const router = Router();

/**
 * @swagger
 * /inventory:
 *   get:
 *     summary: Consultar inventario
 *     description: Obtiene productos con filtros opcionales
 *     tags: [Inventory]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrar por categoría
 *       - in: query
 *         name: supplier
 *         schema:
 *           type: string
 *         description: Filtrar por proveedor
 *       - in: query
 *         name: minStock
 *         schema:
 *           type: integer
 *         description: Stock mínimo
 *       - in: query
 *         name: maxStock
 *         schema:
 *           type: integer
 *         description: Stock máximo
 *       - in: query
 *         name: alertStatus
 *         schema:
 *           type: string
 *           enum: [ACTIVE, RESOLVED]
 *         description: Filtrar por estado de alerta
 *     responses:
 *       200:
 *         description: Inventario consultado exitosamente
 */
router.get('/', inventoryController.list.bind(inventoryController));

/**
 * @swagger
 * /inventory/adjust:
 *   post:
 *     summary: Ajustar stock
 *     description: Aumenta o disminuye el stock de un producto
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - type
 *               - quantity
 *               - reason
 *             properties:
 *               productId:
 *                 type: string
 *                 format: uuid
 *               type:
 *                 type: string
 *                 enum: [ENTRY, EXIT]
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Stock ajustado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Producto no encontrado
 *       422:
 *         description: Stock insuficiente (regla de negocio)
 */
router.post('/adjust', inventoryController.adjust.bind(inventoryController));

/**
 * @swagger
 * /inventory/movements/{productId}:
 *   get:
 *     summary: Obtener movimientos de un producto
 *     description: Historial de movimientos de inventario
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Movimientos encontrados
 *       404:
 *         description: Producto no encontrado
 */
router.get(
  '/movements/:productId',
  inventoryController.getMovements.bind(inventoryController)
);

export default router;

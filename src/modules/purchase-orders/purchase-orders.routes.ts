import { Router } from 'express';
import { purchaseOrdersController } from './purchase-orders.controller';

const router = Router();

/**
 * @swagger
 * /purchase-orders:
 *   get:
 *     summary: Listar órdenes de compra
 *     description: Obtiene una lista de órdenes con filtros opcionales
 *     tags: [Purchase Orders]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, APPROVED, REJECTED, RECEIVED]
 *       - in: query
 *         name: productId
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Órdenes encontradas
 */
router.get('/', purchaseOrdersController.list);

/**
 * @swagger
 * /purchase-orders/{id}:
 *   get:
 *     summary: Obtener orden por ID
 *     tags: [Purchase Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Orden encontrada
 *       404:
 *         description: Orden no encontrada
 */
router.get('/:id', purchaseOrdersController.getById);

/**
 * @swagger
 * /purchase-orders:
 *   post:
 *     summary: Crear orden de compra
 *     description: Crea una nueva orden de compra (RF-04)
 *     tags: [Purchase Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 format: uuid
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       201:
 *         description: Orden creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Producto no encontrado
 *       422:
 *         description: Cantidad menor al mínimo (2x minimumStock)
 */
router.post('/', purchaseOrdersController.create);

/**
 * @swagger
 * /purchase-orders/{id}/approve:
 *   patch:
 *     summary: Aprobar orden de compra
 *     description: Aprueba una orden en estado PENDING (RF-05)
 *     tags: [Purchase Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Orden aprobada
 *       404:
 *         description: Orden no encontrada
 *       422:
 *         description: Solo se pueden aprobar órdenes PENDING
 */
router.patch('/:id/approve', purchaseOrdersController.approve);

/**
 * @swagger
 * /purchase-orders/{id}/reject:
 *   patch:
 *     summary: Rechazar orden de compra
 *     description: Rechaza una orden en estado PENDING (RF-05)
 *     tags: [Purchase Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - rejectionReason
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               rejectionReason:
 *                 type: string
 *                 minLength: 10
 *     responses:
 *       200:
 *         description: Orden rechazada
 *       404:
 *         description: Orden no encontrada
 *       422:
 *         description: Solo se pueden rechazar órdenes PENDING
 */
router.patch('/:id/reject', purchaseOrdersController.reject);

/**
 * @swagger
 * /purchase-orders/{id}/receive:
 *   patch:
 *     summary: Recibir orden de compra
 *     description: Recibe una orden en estado APPROVED, incrementa stock y cierra alerta (RF-05)
 *     tags: [Purchase Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Orden recibida
 *       404:
 *         description: Orden no encontrada
 *       422:
 *         description: Solo se pueden recibir órdenes APPROVED
 */
router.patch('/:id/receive', purchaseOrdersController.receive);

export default router;

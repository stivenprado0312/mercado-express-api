import { Router } from 'express';
import { productsController } from './products.controller';

const router = Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Listar productos
 *     description: Obtiene una lista de productos con filtros opcionales
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Bebidas, Lácteos, Snacks, Limpieza, Frutas, Granos]
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
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 */
router.get('/', productsController.list.bind(productsController));

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Obtener producto por ID
 *     description: Obtiene los detalles de un producto específico
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado
 */
router.get('/:id', productsController.getById.bind(productsController));

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crear producto
 *     description: Crea un nuevo producto en el inventario
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProduct'
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: SKU ya existe
 */
router.post('/', productsController.create.bind(productsController));

export default router;

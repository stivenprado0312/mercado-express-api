import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MercadoExpress API',
      version: '1.0.0',
      description: 'API REST para gestión de inventario de MercadoExpress',
      contact: {
        name: 'API Support'
      }
    },
    servers: [
      {
        url: '/',
        description: 'Servidor principal'
      }
    ],
    tags: [
      {
        name: 'Health',
        description: 'Endpoint inicial'
      },
      {
        name: 'Products',
        description: 'Gestión de productos del inventario'
      },
      {
        name: 'Inventory',
        description: 'Gestión de movimientos y ajustes de inventario'
      },
      {
        name: 'Purchase Orders',
        description: 'Gestión de órdenes de compra a proveedores'
      },
      {
        name: 'Alerts',
        description: 'Gestión de alertas de stock bajo'
      }
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Identificador único'
            },
            name: {
              type: 'string',
              description: 'Nombre del producto'
            },
            sku: {
              type: 'string',
              description: 'Código SKU único'
            },
            category: {
              type: 'string',
              enum: ['Bebidas', 'Lácteos', 'Snacks', 'Limpieza', 'Frutas', 'Granos'],
              description: 'Categoría del producto'
            },
            price: {
              type: 'number',
              description: 'Precio unitario'
            },
            currentStock: {
              type: 'integer',
              description: 'Stock actual'
            },
            minimumStock: {
              type: 'integer',
              description: 'Stock mínimo para alertas'
            },
            supplier: {
              type: 'string',
              description: 'Nombre del proveedor'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de actualización'
            }
          }
        },
        CreateProduct: {
          type: 'object',
          required: ['name', 'sku', 'category', 'price', 'currentStock', 'minimumStock', 'supplier'],
          properties: {
            name: {
              type: 'string',
              minLength: 3,
              maxLength: 100,
              description: 'Nombre del producto (3-100 caracteres)'
            },
            sku: {
              type: 'string',
              minLength: 6,
              maxLength: 20,
              pattern: '^[A-Z0-9-]+$',
              description: 'Código SKU único (6-20 caracteres alfanuméricos)'
            },
            category: {
              type: 'string',
              enum: ['Bebidas', 'Lácteos', 'Snacks', 'Limpieza', 'Frutas', 'Granos'],
              description: 'Categoría del producto'
            },
            price: {
              type: 'number',
              minimum: 0,
              exclusiveMinimum: true,
              description: 'Precio unitario (mayor a 0)'
            },
            currentStock: {
              type: 'integer',
              minimum: 0,
              description: 'Stock actual (mayor o igual a 0)'
            },
            minimumStock: {
              type: 'integer',
              minimum: 1,
              description: 'Stock mínimo para alertas (mayor a 0)'
            },
            supplier: {
              type: 'string',
              minLength: 1,
              description: 'Nombre del proveedor'
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean'
            },
            message: {
              type: 'string'
            },
            data: {
              type: 'object',
              description: 'Datos de respuesta (opcional)'
            }
          }
        }
      }
    }
  },
  apis: ['./src/**/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options);

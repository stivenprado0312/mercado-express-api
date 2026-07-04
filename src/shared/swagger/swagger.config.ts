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
        description: 'Endpoints de salud de la API'
      }
    ]
  },
  apis: ['./src/**/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options);

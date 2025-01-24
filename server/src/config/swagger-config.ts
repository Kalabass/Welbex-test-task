import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentation for the ExpressJS service',
    },
  },
  apis: [
    path.join(__dirname, '../**/*.router.ts'),
    path.join(__dirname, '../**/*.router.js'),
  ],
};

const specs = swaggerJsdoc(options);
export { specs };

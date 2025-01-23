import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentation for the ExpressJS service',
    },
  },
  apis: [path.resolve(__dirname, './src/**/*.router.ts')],
};

const specs = swaggerJsdoc(options);
export { specs };

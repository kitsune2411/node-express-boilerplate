const swaggerJSDoc = require('swagger-jsdoc');
const pkg = require('../../package.json');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: pkg.name || 'Express API',
      version: pkg.version || '1.0.0',
      description: pkg.description || 'API documentation',
    },
  },
  apis: ['./src/routes/*.js', './src/docs/components.yml'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;

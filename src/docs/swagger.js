/**
 * Swagger specification generator using swagger-jsdoc.
 *
 * Loads API documentation from JSDoc comments in route files and external YAML components.
 *
 * @module swaggerSpec
 */

const swaggerJSDoc = require('swagger-jsdoc');
const pkg = require('../../package.json');

/**
 * Swagger-jsdoc options.
 * @type {import('swagger-jsdoc').Options}
 */
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

/**
 * The generated Swagger specification.
 * @type {object}
 */
const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;

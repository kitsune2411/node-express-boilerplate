/**
 * Express application instance.
 *
 * Features:
 * - Helmet for security headers
 * - Compression for responses
 * - CORS enabled
 * - JSON and URL-encoded body parsing
 * - Swagger UI for API documentation
 * - Centralized error and 404 handling
 *
 * @module app
 */

const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const router = require('./routes/index.routes');
const swaggerSpec = require('./docs/swagger');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandlers');

/**
 * The Express application.
 * @type {import('express').Express}
 */
const app = express();

// Security headers
app.use(helmet());

// Enable gzip compression
app.use(compression());

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

/**
 * Serve Swagger UI with dynamic server URL.
 * @name /api-docs
 * @function
 */
app.use('/api-docs', swaggerUi.serve, (req, res, next) => {
  const spec = JSON.parse(JSON.stringify(swaggerSpec));
  spec.servers = [{ url: `${req.protocol}://${req.get('host')}` }];
  swaggerUi.setup(spec)(req, res, next);
});

// API routes
app.use('/api', router);

// 404 handler
app.use(notFoundHandler);

// Error handler
app.use(errorHandler);

module.exports = app;

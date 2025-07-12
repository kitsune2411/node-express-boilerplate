'use strict';

/**
 * Production-ready Express server bootstrap.
 * Features:
 * - Helmet for security headers
 * - Compression for responses
 * - CORS enabled
 * - JSON body parsing
 * - Graceful shutdown
 * - Error handling
 */

const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const http = require('http');
const { shutdown } = require('../lib/shutdown');
const router = require('./routes/index.routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const PORT = process.env.PORT || 3000;

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

// Serve Swagger UI with dynamic server URL
app.use('/api-docs', swaggerUi.serve, (req, res, next) => {
  const spec = JSON.parse(JSON.stringify(swaggerSpec));
  spec.servers = [{ url: `${req.protocol}://${req.get('host')}` }];
  swaggerUi.setup(spec)(req, res, next);
});

// Routes
app.use('/api', router);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  // Log full error, but don't expose stack to client
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Create HTTP server
const server = http.createServer(app);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown on SIGINT/SIGTERM
process.on('SIGINT', () => {
  console.log('Received SIGINT. Initiating shutdown...');
  shutdown(server);
});
process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Initiating shutdown...');
  shutdown(server);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  shutdown(server, err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  shutdown(server, reason instanceof Error ? reason : new Error(String(reason)));
});

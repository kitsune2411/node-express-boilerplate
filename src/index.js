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
const swaggerUi = require('swagger-ui-express');
const { shutdown } = require('../lib/shutdown');
const router = require('./routes/index.routes');
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
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Create HTTP server
const server = http.createServer(app);

// Start server
server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown on SIGINT/SIGTERM
process.on('SIGINT', () => {
  // eslint-disable-next-line no-console
  console.log('Received SIGINT. Initiating shutdown...');
  shutdown(server);
});
process.on('SIGTERM', () => {
  // eslint-disable-next-line no-console
  console.log('Received SIGTERM. Initiating shutdown...');
  shutdown(server);
});
process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.error('Uncaught Exception:', err);
  shutdown(server, err);
});
process.on('unhandledRejection', (reason) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled Rejection:', reason);
  shutdown(server, reason instanceof Error ? reason : new Error(String(reason)));
});

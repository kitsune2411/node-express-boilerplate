/**
 * HTTP server bootstrap for the Express app.
 *
 * - Starts the HTTP server on the configured port.
 * - Handles graceful shutdown on process signals.
 * - Handles uncaught exceptions and unhandled promise rejections.
 *
 * @module server
 */

require('dotenv').config();

const http = require('http');
const app = require('./index');
const { shutdown } = require('../lib/shutdown');

const PORT = process.env.PORT || 3000;

/**
 * The HTTP server instance.
 * @type {import('http').Server}
 */
const server = http.createServer(app);

// Start server
server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
});

/**
 * Handle graceful shutdown on SIGINT.
 * @event SIGINT
 */
process.on('SIGINT', () => {
  // eslint-disable-next-line no-console
  console.log('Received SIGINT. Initiating shutdown...');
  shutdown(server);
});

/**
 * Handle graceful shutdown on SIGTERM.
 * @event SIGTERM
 */
process.on('SIGTERM', () => {
  // eslint-disable-next-line no-console
  console.log('Received SIGTERM. Initiating shutdown...');
  shutdown(server);
});

/**
 * Handle uncaught exceptions.
 * @event uncaughtException
 */
process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.error('Uncaught Exception:', err);
  shutdown(server, err);
});

/**
 * Handle unhandled promise rejections.
 * @event unhandledRejection
 */
process.on('unhandledRejection', (reason) => {
  // eslint-disable-next-line no-console
  console.error('Unhandled Rejection:', reason);
  shutdown(server, reason instanceof Error ? reason : new Error(String(reason)));
});

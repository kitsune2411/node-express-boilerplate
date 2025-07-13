/**
 * Closes the server gracefully.
 * If an error occurs, it logs the error and exits the process.
 * @param {import("http").Server} server - HTTP server instance to be closed.
 * @param {Error} [err] Optional error object that triggered shutdown.
 */
function shutdown(server, err) {
  if (!server) return;
  if (err) {
    // eslint-disable-next-line no-console
    console.error('Error:', err);
  }
  // eslint-disable-next-line no-console
  console.log('Shutting down gracefully...');
  server.close(() => {
    // eslint-disable-next-line no-console
    console.log('Closed out remaining connections.');
    // eslint-disable-next-line no-console
    console.log('Exiting process...');
    process.exit(err ? 1 : 0);
  });
  // Force exit if not closed in 10s
  setTimeout(() => {
    // eslint-disable-next-line no-console
    console.error('Forcing shutdown...');
    process.exit(1);
    // .unref() allows the process to exit naturally if this is the only active timer
  }, 10000).unref();
}

module.exports = {
  shutdown,
};

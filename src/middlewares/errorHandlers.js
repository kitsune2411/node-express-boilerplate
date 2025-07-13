const { error: apiError } = require('../utils/apiResponse');

function notFoundHandler(req, res) {
  return apiError(res, 'Not found', 404);
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-console
  console.error('Unhandled error:', err);
  const status = err.status || err.code || 500;
  return apiError(res, 'Internal server error', status);
}

module.exports = { notFoundHandler, errorHandler };

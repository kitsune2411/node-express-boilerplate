/**
 * Standardized API response helpers for Express.
 * Usage:
 *   const { success, error } = require('../utils/apiResponse');
 *   return success(res, data, 'Message');
 *   return error(res, 'Error message', 400, errorData);
 */

/**
 * Send a standardized success response.
 * @param {import('express').Response} res
 * @param {any} data - The response data.
 * @param {string} [message='OK'] - Optional message.
 * @param {number} [code=200] - HTTP status code.
 * @returns {import('express').Response}
 */
function success(res, data = null, message = 'OK', code = 200) {
  return res.status(code).json({
    success: true,
    data,
    message,
  });
}

/**
 * Send a standardized error response.
 * @param {import('express').Response} res
 * @param {string} error - Error message.
 * @param {number} [code=500] - HTTP status code.
 * @param {any} [data=null] - Optional error data.
 * @returns {import('express').Response}
 */
function error(res, error, code = 500, data = null) {
  return res.status(code).json({
    success: false,
    error,
    code,
    data,
  });
}

module.exports = {
  success,
  error,
};

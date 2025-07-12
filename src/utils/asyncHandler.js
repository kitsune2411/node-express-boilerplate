/**
 * Wraps an async Express route handler and forwards errors to next().
 *
 * This utility is important for Express applications using async/await in route handlers.
 * By default, unhandled errors in async route handlers are not caught by Express and will cause the process to crash.
 * Wrapping your async handlers with asyncHandler ensures that any rejected promises or thrown errors
 * are passed to Express's error handling middleware via next(), enabling centralized error handling and
 * preventing unhandled promise rejections.
 *
 * Usage:
 *   - Use this function to wrap all async route/controller functions.
 *   - This keeps your code clean and avoids repetitive try/catch blocks in every handler.
 *
 * @param {Function} fn - The async route handler (req, res, next) => Promise<any>
 * @returns {Function} Express middleware that handles errors from async functions.
 * @example
 * const asyncHandler = require('../utils/asyncHandler');
 * app.get('/route', asyncHandler(async (req, res) => {
 *   // Your async code here
 * }));
 */
function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;

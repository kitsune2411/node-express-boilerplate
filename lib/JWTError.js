/**
 * Custom error for JWT operations.
 * @property {any} err - The original error object.
 * @property {any} data - The decoded token data (always null on error).
 * @property {string} code - Error code.
 */
class JWTError extends Error {
  /**
   * @param {string} message - Error message.
   * @param {object} [options]
   * @param {any} [options.err] - Original error object.
   * @param {any} [options.data] - Decoded token data (should be null on error).
   * @param {string} [options.code] - Error code.
   */
  constructor(message, { err = null, data = null, code = 'JWT_ERROR' } = {}) {
    super(message);
    this.name = 'JWTError';
    this.err = err;
    this.data = data;
    this.code = code;
  }
}

module.exports = JWTError;

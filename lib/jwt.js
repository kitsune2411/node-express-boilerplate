'use strict';

/**
 * @module lib/jwt
 * @description JWTClient class for generating and verifying JSON Web Tokens (JWTs) with configurable options.
 * @requires jsonwebtoken
 * @requires moment
 * @requires ms
 * @requires uuid
 *
 * @example <caption>Usage</caption>
 * const JWTClient = require('./lib/jwt');
 * const jwtClient = new JWTClient({
 *   issuer: 'my-app',
 *   audience: 'my-users',
 *   subject: 'user-auth',
 *   accessSecret: 'access_secret',
 *   refreshSecret: 'refresh_secret',
 *   accessExpiresIn: '15m',
 *   refreshExpiresIn: '7d'
 * });
 *
 * // Generate tokens
 * const accessToken = await jwtClient.generateAccessToken({ data: 123 });
 * const refreshToken = await jwtClient.generateRefreshToken({ data: 123 });
 *
 * // Verify tokens
 * const accessPayload = await jwtClient.verifyAccessToken(accessToken);
 * const refreshPayload = await jwtClient.verifyRefreshToken(refreshToken);
 */

const jwt = require('jsonwebtoken');
const moment = require('moment');
const ms = require('ms');
const uuid = require('uuid').v7;

/**
 * JWTClient class for managing JWT creation and verification.
 */
class JWTClient {
  /**
   * Create a JWTClient instance.
   * @param {object} options
   * @param {string} options.issuer - JWT issuer.
   * @param {string} options.audience - JWT audience.
   * @param {string} options.subject - JWT subject.
   * @param {string} options.accessSecret - Secret for signing access tokens.
   * @param {string} options.refreshSecret - Secret for signing refresh tokens.
   * @param {string|number} options.accessExpiresIn - Access token expiration (e.g., "15m").
   * @param {string|number} options.refreshExpiresIn - Refresh token expiration (e.g., "7d").
   * @example
   * const jwtClient = new JWTClient({
   *   issuer: 'my-app',
   *   audience: 'my-users',
   *   subject: 'user-auth',
   *   accessSecret: 'access_secret',
   *   refreshSecret: 'refresh_secret',
   *   accessExpiresIn: '15m',
   *   refreshExpiresIn: '7d'
   * });
   */
  constructor({
    issuer,
    audience,
    subject,
    accessSecret,
    refreshSecret,
    accessExpiresIn,
    refreshExpiresIn,
  }) {
    this.issuer = issuer;
    this.audience = audience;
    this.subject = subject;
    this.accessSecret = accessSecret;
    this.refreshSecret = refreshSecret;
    this.accessExpiresIn = accessExpiresIn;
    this.refreshExpiresIn = refreshExpiresIn;
  }

  /**
   * Generates a base JWT payload with common fields.
   * @returns {object} The base JWT payload.
   * @private
   */
  _createBasePayload() {
    const now = moment().utc().unix();
    return {
      iss: this.issuer,
      aud: this.audience,
      iat: now,
      nbf: now,
      sub: this.subject,
      jti: uuid(),
    };
  }

  /**
   * Generates a signed JWT access token.
   * @param {object} payload
   * @param {any} payload.data - The data to include in the token payload.
   * @returns {Promise<string>} The signed JWT access token.
   * @example
   * const token = await jwtClient.generateAccessToken({ data: 123 });
   */
  async generateAccessToken({ data }) {
    const base = this._createBasePayload();
    const exp = moment().add(ms(this.accessExpiresIn), 'milliseconds').utc().unix();
    const payload = { ...base, exp, type: 'access', data };
    return jwt.sign(payload, this.accessSecret);
  }

  /**
   * Generates a signed JWT refresh token.
   * @param {object} payload
   * @param {any} payload.data - The data to include in the token payload.
   * @returns {Promise<string>} The signed JWT refresh token.
   * @example
   * const token = await jwtClient.generateRefreshToken({ data: 123 });
   */
  async generateRefreshToken({ data }) {
    const base = this._createBasePayload();
    const exp = moment().add(ms(this.refreshExpiresIn), 'milliseconds').utc().unix();
    const payload = { ...base, exp, type: 'refresh', data };
    return jwt.sign(payload, this.refreshSecret);
  }

  /**
   * Verifies a JWT access token.
   * @param {string} token - The JWT access token to verify.
   * @returns {Promise<Object>} The decoded token payload if valid.
   * @throws {Object} If the token is invalid or expired.
   * @example
   * const payload = await jwtClient.verifyAccessToken(token);
   */
  async verifyAccessToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.accessSecret, (err, data) => {
        if (err) {
          return reject({
            message: 'Invalid or expired access token',
            error: err,
            code: 'ER_INVALID_ACCESS_TOKEN',
          });
        }
        resolve(data);
      });
    });
  }

  /**
   * Verifies a JWT refresh token.
   * @param {string} token - The JWT refresh token to verify.
   * @returns {Promise<Object>} The decoded token payload if valid.
   * @throws {Object} If the token is invalid or expired.
   * @example
   * const payload = await jwtClient.verifyRefreshToken(token);
   */
  async verifyRefreshToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.refreshSecret, (err, data) => {
        if (err) {
          return reject({
            message: 'Invalid or expired refresh token',
            error: err,
            code: 'ER_INVALID_REFRESH_TOKEN',
          });
        }
        resolve(data);
      });
    });
  }
}

module.exports = JWTClient;

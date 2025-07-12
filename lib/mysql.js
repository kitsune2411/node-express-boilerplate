'use strict';

/**
 * @module lib/mysql
 * @description MySQLClient class for managing MySQL connections, pools, and safe queries with named parameters.
 * @requires mysql2
 * @requires sqlstring
 *
 * @example <caption>Single Connection</caption>
 * const MySQLClient = require('./lib/mysql');
 * const client = new MySQLClient({ host: 'localhost', user: 'root', password: '', database: 'test' });
 * const rows = await client.query('SELECT * FROM users WHERE id = :id', { id: 1 });
 * await client.close();
 *
 * @example <caption>Connection Pool</caption>
 * const MySQLClient = require('./lib/mysql');
 * const poolClient = new MySQLClient({ host: 'localhost', user: 'root', password: '', database: 'test', connectionLimit: 10 }, true);
 * const rows = await poolClient.query('SELECT * FROM users');
 * await poolClient.close();
 */

const mysql = require('mysql2');
const SqlString = require('sqlstring');

/**
 * MySQLClient class for managing a MySQL connection or pool.
 * @class
 */
class MySQLClient {
  /**
   * Create a MySQLClient instance.
   * @param {object} options - mysql2 connection or pool options.
   * @param {boolean} [usePool=false] - Whether to use a connection pool.
   * @example
   * // Single connection
   * const client = new MySQLClient({ host: 'localhost', user: 'root', password: '', database: 'test' });
   *
   * // Connection pool
   * const poolClient = new MySQLClient({ host: 'localhost', user: 'root', password: '', database: 'test', connectionLimit: 10 }, true);
   */
  constructor(options, usePool = false) {
    this.usePool = usePool;
    this.options = options;
    this.conn = usePool ? mysql.createPool(options) : mysql.createConnection(options);

    // Set custom query format for named parameters
    if (this.usePool) {
      this.conn.config.connectionConfig.queryFormat = this.customQueryFormat.bind(this.conn);
    } else {
      this.conn.config.queryFormat = this.customQueryFormat.bind(this.conn);
    }
  }

  /**
   * Custom query formatter for :key replacements in SQL queries.
   * @param {string} query - The SQL query string.
   * @param {object} values - The values to replace in the query.
   * @returns {string} The formatted SQL query.
   * @this {import("mysql2").Connection|import("mysql2").Pool}
   * @private
   */
  customQueryFormat(query, values) {
    if (!values) return query;
    return query.replace(/\:(\w+)/g, (txt, key) => {
      if (Object.prototype.hasOwnProperty.call(values, key)) {
        return this.escape(values[key]);
      }
      return txt;
    });
  }

  /**
   * Validates a SQL statement for safety and warns about potential SQL injection risks.
   * @param {string} statement - The SQL statement to validate.
   * @throws {Error} If the statement is not a string or is malformed.
   * @private
   */
  validateStatements(statement) {
    if (typeof statement !== 'string') {
      throw new Error('All statements must be strings.');
    }
    try {
      SqlString.format(statement);
    } catch (e) {
      throw new Error('Invalid SQL statement: ' + e.message);
    }
    if (statement.includes('${')) {
      console.warn(
        'Warning: Potential SQL injection risk detected (template literal) in statement:',
        statement
      );
    }
    if (statement.match(/['"`][^'"`]*\+[^\n]*\w/)) {
      console.warn(
        'Warning: Potential SQL injection risk detected (string concatenation) in statement:',
        statement
      );
    }
  }

  /**
   * Executes a SQL query using this connection or pool.
   * @param {string} sql - The SQL query string. Supports :key named parameters.
   * @param {object|array} [params] - The query parameters.
   * @returns {Promise<any>} The result rows.
   * @example
   * const rows = await client.query("SELECT * FROM users WHERE id = :id", { id: 1 });
   */
  async query(sql, params) {
    this.validateStatements(sql);
    const [rows] = await this.conn.promise().query(sql, params);
    return rows;
  }

  /**
   * Closes the connection or pool.
   * @returns {Promise<void>}
   * @example
   * await client.close();
   */
  async close() {
    await this.conn.promise().end();
  }
}

module.exports = MySQLClient;

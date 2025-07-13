/**
 * @module lib/pgsql
 * @description PgSQLClient class for managing PostgreSQL connections, pools, and safe queries with named parameters.
 * @requires pg
 * @requires sqlstring
 *
 * @example <caption>Single Client</caption>
 * const PgSQLClient = require('./lib/pgsql');
 * const client = new PgSQLClient({ host: 'localhost', user: 'postgres', password: '', database: 'test' });
 * const rows = await client.query('SELECT * FROM users WHERE id = :id', { id: 1 });
 * await client.close();
 *
 * @example <caption>Connection Pool</caption>
 * const PgSQLClient = require('./lib/pgsql');
 * const poolClient = new PgSQLClient({ host: 'localhost', user: 'postgres', password: '', database: 'test', max: 10 }, true);
 * const rows = await poolClient.query('SELECT * FROM users');
 * await poolClient.close();
 */

const { Client, Pool } = require('pg');
const SqlString = require('sqlstring');

/**
 * PgSQLClient class for managing a PostgreSQL client or pool.
 * @class
 */
class PgSQLClient {
  /**
   * Create a PgSQLClient instance.
   * @param {object} options - pg Client or Pool options.
   * @param {boolean} [usePool=false] - Whether to use a connection pool.
   * @example
   * // Single client
   * const client = new PgSQLClient({ host: 'localhost', user: 'postgres', password: '', database: 'test' });
   *
   * // Connection pool
   * const poolClient = new PgSQLClient({ host: 'localhost', user: 'postgres', password: '', database: 'test', max: 10 }, true);
   */
  constructor(options, usePool = false) {
    this.usePool = usePool;
    this.options = options;
    this.conn = usePool ? new Pool(options) : new Client(options);
    this.connected = false;
  }

  /**
   * Replaces :key in SQL with $1, $2, ... and returns { text, values } for pg.
   * @param {string} query - The SQL query string.
   * @param {object} values - The values to replace in the query.
   * @returns {{ text: string, values: any[] }} The formatted query and values.
   * @private
   */
  static formatQuery(query, values) {
    if (!values) return { text: query, values: [] };
    const keys = [];
    const text = query.replace(/:(\w+)/g, (txt, key) => {
      if (!(key in values)) return txt;
      let idx = keys.indexOf(key);
      if (idx === -1) {
        keys.push(key);
        idx = keys.length - 1;
      }
      return `$${idx + 1}`;
    });
    const vals = keys.map((k) => values[k]);
    return { text, values: vals };
  }

  /**
   * Validates a SQL statement for safety and warns about potential SQL injection risks.
   * @param {string} statement - The SQL statement to validate.
   * @throws {Error} If the statement is not a string or is malformed.
   * @private
   */
  static validateStatements(statement) {
    if (typeof statement !== 'string') {
      throw new Error('All statements must be strings.');
    }
    try {
      SqlString.format(statement);
    } catch (e) {
      throw new Error(`Invalid SQL statement: ${e.message}`);
    }
    if (statement.includes('${')) {
      // eslint-disable-next-line no-console
      console.warn(
        'Warning: Potential SQL injection risk detected (template literal) in statement:',
        statement
      );
    }
    if (statement.match(/['"`][^'"`]*\+[^\n]*\w/)) {
      // eslint-disable-next-line no-console
      console.warn(
        'Warning: Potential SQL injection risk detected (string concatenation) in statement:',
        statement
      );
    }
  }

  /**
   * Executes a SQL query using this client or pool.
   * @param {string} sql - The SQL query string. Supports :key named parameters.
   * @param {object} [params] - The query parameters.
   * @returns {Promise<any[]>} The result rows.
   * @example
   * const rows = await client.query("SELECT * FROM users WHERE id = :id", { id: 1 });
   */
  async query(sql, params) {
    PgSQLClient.validateStatements(sql);
    const { text, values } = PgSQLClient.formatQuery(sql, params);

    // Connect if not using pool and not yet connected
    if (!this.usePool && !this.connected) {
      await this.conn.connect();
      this.connected = true;
    }

    const res = await this.conn.query(text, values);
    return res.rows;
  }

  /**
   * Closes the client or pool.
   * @returns {Promise<void>}
   * @example
   * await client.close();
   */
  async close() {
    await this.conn.end();
    this.connected = false;
  }
}

module.exports = PgSQLClient;

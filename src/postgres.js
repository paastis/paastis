/* See https://node-postgres.com */

import pg from 'pg';
import config from './config.js';

const Pool = pg.Pool;

const connectionString = config.postgres.url;

const pool = new Pool({
  connectionString,
});

console.log('Postgres Client is ready');

export default pool;

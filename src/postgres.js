/* See https://node-postgres.com */

import pg from 'pg';
import config from './config.js';
import { logger } from './logger.js';

const Pool = pg.Pool;

const connectionString = config.postgres.url;

const pool = new Pool({
  connectionString,
});

pool.on('error', (err) => {
  logger.error(err);
});

;(async function () {
  const client = await pool.connect();
  await client.query('SELECT NOW()');
  client.release();
  logger.info('Postgres Client is ready');
})();


export default pool;

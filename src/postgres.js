/* See https://node-postgres.com */

import pg from 'pg';
import config from './config.js';
import { logger } from './logger.js';

const Pool = pg.Pool;

const connectionString = config.postgres.url;

const pool = new Pool({
  connectionString,
});

logger.info('Postgres Client is ready');

export default pool;

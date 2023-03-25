/* See https://node-postgres.com */

import pg from 'pg';

const Pool = pg.Pool;

const connectionString = 'postgresql://paastis-user:mysecretpassword@localhost:5432/paastis'

const pool = new Pool({
    connectionString,
});

const result = await pool.query('SELECT NOW()');

console.log(result);

export default pool;

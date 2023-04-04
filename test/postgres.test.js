import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import pool from '../src/postgres.js';
import { logger } from '../src/logger.js';

describe('postgres', () => {
  let client;

  beforeEach(async () => {
    client = await pool.connect();
  });

  afterEach(() => {
    client.release();
  });

  describe('connection', () => {
    it('should be ok', async () => {
      // given

      // when
      const result = await client.query('SELECT NOW()');

      // then
      expect(result).toBeDefined;
      logger.info(result);
    });
  });
});

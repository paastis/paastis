import { describe, expect, it } from '@jest/globals';
import pool from '../src/postgres.js';

describe('postgres', () => {

  describe('connection', () => {

    it('should be ok', async () => {
      // given

      // when
      const result = await pool.query('SELECT NOW()');

      // then
      expect(result).toBeDefined;
      console.log(result);
    });
  });
});

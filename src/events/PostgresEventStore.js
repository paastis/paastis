import EventStore from './EventStore.js';
import pool from '../postgres.js';
import {
  AppRegistered,
  AppStarted,
  AppStopped,
  AppUnregistered,
} from './Event.js';

export default class PostgresEventStore extends EventStore {
  async save(event) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');
      const queryText =
        'INSERT INTO "Events"("oid", "name", "date") VALUES($1, $2, $3)';
      const queryValues = [event.oid, event.name, event.date];
      await client.query(queryText, queryValues);
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async find() {
    const queryText = 'SELECT * FROM "Events"';
    const res = await pool.query(queryText);
    const events = res.rows.map(this.convertDataIntoEvent);
    return events;
  }

  async get(oid) {
    const queryText = 'SELECT * FROM "Events" WHERE "oid" = $1 LIMIT 1';
    const queryValues = [oid];
    const res = await pool.query(queryText, queryValues);
    if (res.rows.length > 0) {
      return this.convertDataIntoEvent(res.rows[0]);
    }
    return null;
  }

  convertDataIntoEvent(data) {
    let event;
    if (data.name === 'APP_REGISTERED') {
      event = new AppRegistered(data.oid);
    } else if (data.name === 'APP_UNREGISTERED') {
      event = new AppUnregistered(data.oid);
    } else if (data.name === 'APP_STARTED') {
      event = new AppStarted(data.oid);
    } else if (data.name === 'APP_STOPPED') {
      event = new AppStopped(data.oid);
    }
    event.date = data.date;
    return event;
  }
}

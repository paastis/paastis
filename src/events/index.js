import config from '../config.js';
import InMemoryEventStore from './InMemoryEventStore.js';
import PostgresEventStore from './PostgresEventStore.js';

let eventStore;
if (!eventStore) {
  if (config.events.store === 'in-memory') {
    eventStore = new InMemoryEventStore();
  } else if (config.events.store === 'postgres') {
    eventStore = new PostgresEventStore();
  } else {
    throw new Error(
      'Event store not defined. Check that `EVENTS_STORE` environment variable is set.'
    );
  }
}

export { eventStore };

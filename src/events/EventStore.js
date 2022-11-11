export default class EventStore {

  constructor() {
    this.store = [];
  }

  saveEvent(paasAppEvent) {
    this.store.push(paasAppEvent)
  }

  listEvents() {
    this.store.forEach(console.log);
  }

}

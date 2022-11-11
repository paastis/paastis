export default class EventStore {

  constructor() {
    this.store = [];
  }

  async saveEvent(paasAppEvent) {
    this.store.push(paasAppEvent)
  }

  async listEvents() {
    return this.store;
  }

}

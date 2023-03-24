import EventStore from "./EventStore.js";

export default class InMemoryEventStore extends EventStore {

    events;

    constructor() {
        super();
        this._events = [];
    }

    async save(event) {
        this._events.push(event);
    }

    async find() {
        return this._events;
    }

    async get(objectId) {
        const matchedEvent = this._events.find((event) => event.objectId === objectId);
        return matchedEvent || null;
    }
}
import RunningApp from '../RunningApp.js';
import { RunningAppStore } from './RunningAppStore.js';

export default class InMemoryRunningAppStore extends RunningAppStore {
  constructor() {
    super();
    this._map = new Map();
  }

  async delete(appName) {
    return this._map.delete(appName);
  }

  async get(appName) {
    return this._map.get(appName);
  }

  async has(appName) {
    return this._map.has(appName);
  }

  async set(appName, managedApp) {
    return this._map.set(appName, managedApp);
  }

  async all() {
    return Array.from(this._map.values());
  }

  async keys() {
    return this._map.keys();
  }

  async clear() {
    this._map.clear();
  }

  async findByGroup(groupName) {
    return Array.from(this._map.values())
      .filter((object) => object.group && object.group === groupName)
      .map(
        (object) =>
          new RunningApp(
            object.provider,
            object.region,
            object.name,
            object.maxIdleTime,
            object.linkedApps,
            object.startedAt,
            object.lastAccessedAt
          )
      );
  }
}

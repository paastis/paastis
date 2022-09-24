import Promise   from "bluebird";
import RunningApp from "./RunningApp.js";

export class RunningAppRegistryStore {

  async delete(appName) {
    throw new Error('Implement #delete()');
  }

  async get(appName) {
    throw new Error('Implement #get()');
  }

  async has(appName) {
    throw new Error('Implement #has()');
  }

  async set(appName, managedApp) {
    throw new Error('Implement #set()');
  }

  async all() {
    throw new Error('Implement #all()');
  }

  async keys() {
    throw new Error('Implement #keys()');
  }

  async clear() {
    throw new Error('Implement #clear()');
  }
}

export class InMemoryRunningAppRegistryStore extends RunningAppRegistryStore {

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
}

export class RedisRunningAppRegistryStore extends RunningAppRegistryStore {

  #_redisClient;

  constructor(redisClient) {
    super();
    this.#_redisClient = redisClient;
  }

  async delete(appName) {
    return await this.#_redisClient.del(appName);
  }

  async get(appName) {
    const data = await this.#_redisClient.get(appName);
    if (data) {
      return JSON.parse(data);
    }
  }

  async has(appName) {
    return await this.#_redisClient.exists(appName);
  }

  async set(appName, managedApp) {
    console.log(`set app ${appName}`, managedApp);
    return await this.#_redisClient.set(appName, JSON.stringify(managedApp));
  }

  async all() {
    try {
      const keys = await this.#_redisClient.keys('*');
      if (keys) {
        const managedApps = Promise.reduce(keys, async (apps, k) => {
          const result = await this.#_redisClient.get(k);
          const object = JSON.parse(result);
          if (object) {
            const app = new RunningApp(object.provider, object.name, object.region, object.startedAt, object.lastAccessedAt);
            apps.push(app);
          }
          return apps;

        }, []);
        return managedApps;
      }
      return [];
    } catch (err) {
      console.error(err);
    }
   }

  async keys() {
    return await this.#_redisClient.keys('*');
  }

  async clear() {
    return await this.#_redisClient.flushAll();
  }
}

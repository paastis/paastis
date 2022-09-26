import Promise from "bluebird";
import RunningApp from "../RunningApp.js";
import { RunningAppStore } from "./RunningAppStore.js";

export default class RedisRunningAppStore extends RunningAppStore {

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
            const app = new RunningApp(object.provider, object.region, object.name, object.maxIdleTime, object.linkedApps, object.startedAt, object.lastAccessedAt);
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

  async findByGroup(groupName) {
    try {
      const keys = await this.#_redisClient.keys('*');
      if (keys) {
        const managedApps = Promise.reduce(keys, async (apps, k) => {
          const result = await this.#_redisClient.get(k);
          const object = JSON.parse(result);
          if (object && object.group && object.group === groupName) {
            const app = new RunningApp(object.provider, object.region, object.name, object.maxIdleTime, object.linkedApps, object.startedAt, object.lastAccessedAt);
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
}

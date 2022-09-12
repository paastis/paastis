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

  async keys() {
    throw new Error('Implement #set()');
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

  async keys() {
    return this._map.keys();
  }
}

export class RedisRunningAppRegistryStore extends RunningAppRegistryStore {

  constructor(redisClient) {
    super();
    this._redisClient = redisClient;
  }

  async delete(appName) {
    return await this._redisClient.del(appName);
  }

  async get(appName) {
    return JSON.parse(await this._redisClient.get(appName));
  }

  async has(appName) {
    return await this._redisClient.exists(appName);
  }

  async set(appName, managedApp) {
    return await this._redisClient.set(appName, JSON.stringify(managedApp));
  }

  async keys() {
    return await this._redisClient.keys('*');
  }
}

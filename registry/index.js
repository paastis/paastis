import config from '../config.js';
import redis from '../redis.js';
import RunningAppsRegistry from "./RunningAppRegistry.js";
import { InMemoryRunningAppRegistryStore, RedisRunningAppRegistryStore } from "./RunningAppRegistryStore.js";

let runningAppsStore;
if (!runningAppsStore) {
  if (config.registry.type === 'redis') {
    runningAppsStore = new RedisRunningAppRegistryStore(redis);
  } else {
    runningAppsStore = new InMemoryRunningAppRegistryStore();
  }
}

let registry;
if (!registry) {
  registry = new RunningAppsRegistry(runningAppsStore);
}

export default registry;

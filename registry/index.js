import config from '../config.js';
import redis from '../redis.js';
import RunningAppsRegistry from "./RunningAppRegistry.js";
import { InMemoryRunningAppRegistryStore, RedisRunningAppRegistryStore } from "./RunningAppRegistryStore.js";

let runningAppsStore = (config.registry.type === 'redis') ? new RedisRunningAppRegistryStore(redis) : new InMemoryRunningAppRegistryStore();

const registry = new RunningAppsRegistry(runningAppsStore);

export default registry;

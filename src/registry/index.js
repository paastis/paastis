import fs from 'fs';
import config from '../config.js';
import redis from '../redis.js';
import RunningAppsRegistry from "./RunningAppRegistry.js";
import { InMemoryRunningAppRegistryStore, RedisRunningAppRegistryStore } from "./RunningAppRegistryStore.js";
import RunningAppFactory from "./RunningAppFactory.js";
import yaml from "js-yaml";

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

let factory;
if (!factory) {
  const paastisYmlPath = process.cwd() + '/paastis.yml';
  if (fs.existsSync(paastisYmlPath)) {
    const userConfig = yaml.load(fs.readFileSync(paastisYmlPath, 'utf8'));
    factory = new RunningAppFactory(userConfig);
  } else {
    factory = new RunningAppFactory();
  }
}

export {
  registry,
  factory
};


import fs from 'fs';
import yaml from 'js-yaml';
import config from '../config.js';
import redis from '../redis.js';
import RunningAppsRegistry from './RunningAppRegistry.js';
import RunningAppFactory from './RunningAppFactory.js';
import RedisRunningAppStore from './stores/RedisRunningAppStore.js';
import InMemoryRunningAppStore from './stores/InMemoryRunningAppStore.js';

let store;
if (!store) {
  if (config.registry.type === 'redis') {
    store = new RedisRunningAppStore(redis);
  } else {
    store = new InMemoryRunningAppStore();
  }
}

let factory;
if (!factory) {
  const paastisYmlPath = process.cwd() + '/paastis.yml';
  if (fs.existsSync(paastisYmlPath)) {
    console.log('Found `paastis.yml` discovery rules config file');

    const userConfig = yaml.load(fs.readFileSync(paastisYmlPath, 'utf8'));
    console.log('Loaded `paastis.yml` discovery rules config file');

    factory = new RunningAppFactory(userConfig);
  } else {
    factory = new RunningAppFactory();
  }
}

let registry;
if (!registry) {
  registry = new RunningAppsRegistry(store, factory);
}

export { factory, store, registry };

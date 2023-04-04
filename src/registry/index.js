import fs from 'fs';
import yaml from 'js-yaml';
import { logger } from '../logger.js';
import config from '../config.js';
import redis from '../redis.js';
import { eventStore } from '../events/index.js';
import RunningAppsRegistry from './RunningAppRegistry.js';
import RunningAppFactory from './RunningAppFactory.js';
import RedisRunningAppStore from './stores/RedisRunningAppStore.js';
import InMemoryRunningAppStore from './stores/InMemoryRunningAppStore.js';

let appStore;
if (!appStore) {
  if (config.registry.type === 'redis') {
    appStore = new RedisRunningAppStore(redis);
  } else {
    appStore = new InMemoryRunningAppStore();
  }
}

let factory;
if (!factory) {
  const paastisYmlPath = process.cwd() + '/paastis.yml';
  if (fs.existsSync(paastisYmlPath)) {
    logger.info('Found `paastis.yml` discovery rules config file');

    const userConfig = yaml.load(fs.readFileSync(paastisYmlPath, 'utf8'));
    logger.info('Loaded `paastis.yml` discovery rules config file');

    factory = new RunningAppFactory(userConfig);
  } else {
    factory = new RunningAppFactory();
  }
}

let registry;
if (!registry) {
  registry = new RunningAppsRegistry(appStore, factory, eventStore);
}

export { factory, appStore as store, registry };

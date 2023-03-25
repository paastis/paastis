import { createClient } from 'redis';
import config from './config.js';

let client;

if (config.registry.type === 'redis') {
  if (!client) {
    client = createClient({
      url: config.redis.url,
      disableOfflineQueue: true,
      legacyMode: false,
    });

    client.on('error', (err) => {
      console.log('Redis Client Error', err);
    });

    client.on('ready', () => {
      console.log('Redis Client is ready');
    });

    await client.connect();
  }
}

export default client;

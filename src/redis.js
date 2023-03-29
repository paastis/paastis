import config from './config.js';
import { createClient } from 'redis';

let client;

if (config.registry.type === 'redis') {
  if (!client) {
    client = createClient({
      url: config.redis.url,
      disableOfflineQueue: true,
      legacyMode: false,
    });

    client.on('error', (err) => {
      console.log(JSON.stringify({ msg: 'Redis Client Error', err: err.stack }));
    });

    client.on('ready', () => {
      console.log('Redis Client is ready');
    });

    await client.connect();
  }
}

export default client;

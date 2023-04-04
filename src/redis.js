import { createClient } from 'redis';
import config from './config.js';
import { logger } from './logger.js';

let client;

if (config.registry.type === 'redis') {
  if (!client) {
    client = createClient({
      url: config.redis.url,
      disableOfflineQueue: true,
      legacyMode: false,
    });

    client.on('error', (err) => {
      logger.info(
        JSON.stringify({ msg: 'Redis Client Error', err: err.stack })
      );
    });

    client.on('ready', () => {
      logger.info('Redis Client is ready');
    });

    await client.connect();
  }
}

export default client;

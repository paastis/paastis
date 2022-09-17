import { createClient } from 'redis';
import config from "./config.js";

let client;

if (!client) {
  client = createClient({
    url: config.registry.redisUrl,
    legacyMode: true
  });

  client.on('error', (err) => {
    console.log('Redis Client Error', err);
  });

  client.on('ready', () => {
    console.log('Redis Client is ready');
  });

  await client.connect();
}

export default client;

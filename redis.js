import { createClient } from 'redis';
import config from "./config.js";

const client = createClient({
  url: config.registry.redisUrl
});

client.on('error', (err) => console.log('Redis Client Error', err));

await client.connect();

export default client;

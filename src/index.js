import Server from './server.js';
import config from './config.js';
import Scheduler from './scheduler.js';

let server = new Server(config);
let scheduler = new Scheduler(config);

async function main() {
  await server.start();
  await scheduler.start();
}

await main();

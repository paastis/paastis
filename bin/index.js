#! /usr/bin/env node

// Cf. https://dev.to/rushankhan1/build-a-cli-with-node-js-4jbi

console.log('🍻 Hello Paastis!');

import config from '../src/config.js';
import Server from '../src/Server.js';
import Scheduler from '../src/Scheduler.js';

let proxy = new Server(config);
let scheduler = new Scheduler(config);

async function main() {
  await proxy.start();
  await scheduler.start();
}

await main();

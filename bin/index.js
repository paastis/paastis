#!/usr/bin/env node
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

import config from '../src/config.js';
import Server from '../src/Server.js';
import Scheduler from '../src/Scheduler.js';

const argv = yargs(hideBin(process.argv)).argv;

if (argv['max-idle-time']) {
  const maxIdleTime = +argv['max-idle-time'];
  config.updateActivityMaxIdleTime(maxIdleTime);
}

if (argv['port']) {
  const port = +argv['port'];
  config.updatePort(port);
}

let proxy = new Server(config);
let scheduler = new Scheduler(config);

async function main() {
  await proxy.start();
  await scheduler.start();
}

await main();

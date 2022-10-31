#!/usr/bin/env node
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

import config from '../src/config.js';
import Server from '../src/Server.js';
import Scheduler from '../src/Scheduler.js';

const argv = yargs(hideBin(process.argv)).options({
  'max-idle-time': {
    demandOption: false,
    default: 15,
    describe: 'delay before stopping an app',
    type: 'number',
  },
  host: {
    alias: 'H',
    demandOption: false,
    default: '0.0.0.0',
    describe: 'Server host',
    type: 'string',
  },
  port: {
    alias: 'P',
    demandOption: false,
    default: 3000,
    describe: 'Server port',
    type: 'number',
  },
}).argv;

if (argv['max-idle-time']) {
  const maxIdleTime = +argv['max-idle-time'];
  config.updateActivityMaxIdleTime(maxIdleTime);
}

if (argv['host']) {
  const host = argv['host'];
  config.updateServerHost(host);
}

if (argv['port']) {
  const port = +argv['port'];
  config.updateServerPort(port);
}

let proxy = new Server(config);
let scheduler = new Scheduler(config);

async function main() {
  await proxy.start();
  await scheduler.start();
}

await main();

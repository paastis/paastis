#!/usr/bin/env node
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

import config from '../src/config.js';

import bootstrap from '../src/bootstrap.js';

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

bootstrap(config);

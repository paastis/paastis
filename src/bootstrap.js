import Server from '../src/Server.js';
import Scheduler from '../src/Scheduler.js';

async function bootstrap(config) {
  let proxy = new Server(config);
  let scheduler = new Scheduler(config);

  await proxy.start();

  await scheduler.start();
}

export default bootstrap;

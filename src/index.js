import Server from "./Server.js";
import config from "./config.js";
import Scheduler from "./Scheduler.js";

let server = new Server(config);
let scheduler = new Scheduler(config);

async function main() {
  await server.start();
  await scheduler.start();
}

await main();

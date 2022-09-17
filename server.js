import http from 'http';
import cron from 'node-cron';
import config from './config.js';
import provider from "./provider/index.js";
import registry from './registry/index.js';
import RunningApp from "./registry/RunningApp.js";
import { system, upstream } from "./router/index.js";
import client from "./redis.js";

async function startRedisClient() {
  await client.connect();
  await client.ping();
}

async function startServer() {
  try {

    const { host, port } = config.server;

    const server = http.createServer({
      insecureHTTPParser: true
    }, async (req, res) => {
      try {
        let proxyTarget = req.headers['PaastisProxyTarget'.toLowerCase()] || 'upstream';
        if (config.routing.systemApiEnabled && proxyTarget === 'system') {
          return system(req, res);
        }
        return upstream(req, res);
      } catch (err) {
        console.error(err);
        res.statusCode = 502;
        res.end(err.toString());
      }
    });

    server.listen(port, host, () => {
      console.log(`Server is running on https://${host}:${port}`);
    });
  } catch (err) {
    process.exit(1);
  }
}

const startCron = async () => {

  async function stopIdleApps() {
    try {
      console.log('⏰ Checking apps to idle');
      const now = new Date();

      const ignoredApps = config.registry.ignoredApps;

      const apps = (await provider.listAllApps()).filter((a) => !ignoredApps.includes(a.name));

      // TODO: unregister apps that are not fetched from `listAllApps`

      for (const app of apps) {
        if (app.status !== 'running') {
          await registry.removeApp(app.key);
        } else {
          let runningApp = await registry.getApp(app.key);
          if (runningApp) {
            // already managed
            const managedApp = await registry.getApp(app.key);
            const diffMs = Math.abs(now - managedApp.lastAccessedAt);
            const diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000);

            if (diffMins > config.startAndStop.maxIdleTime - 1) {
              // ☠️ app should be stopped
              await provider.stopApp(app.key, app.region)
              await registry.removeApp(app.key);
            }
          } else {
            // not yet managed
            const runningApp = new RunningApp(provider.name, app.key, 'osc-fr1');
            await registry.setApp(runningApp);
          }
        }
      }
      const runningApps = await registry.listApps();
      if (runningApps) {
        console.log('Active apps: ', runningApps.map(app => app.name));
      }
    } catch (err) {
      console.error(err);
    }
  }

  await stopIdleApps();
  cron.schedule(config.startAndStop.checkingIntervalCron, stopIdleApps);
};

async function main() {
  await startRedisClient();
  await startCron();
  await startServer();
}

await main();

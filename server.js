import http from 'http';
import cron from 'node-cron';
import config from './config.js';
import provider from "./provider/index.js";
import registry from './registry/index.js';
import RunningApp from "./registry/RunningApp.js";
import { system, upstream } from "./router/index.js";

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

const startScheduler = async () => {

  async function stopIdleApps() {
    try {
      console.log('⏰ Checking apps to idle');
      const now = new Date();

      const ignoredApps = config.registry.ignoredApps;

      const apps = (await provider.listAllApps()).filter((a) => !ignoredApps.includes(a.name));

      // TODO: unregister apps that are not fetched from `listAllApps`

      for (const app of apps) {
        if (!app.isRunning) {
          await registry.removeApp(app.key);
        } else {
          let runningApp = await registry.getApp(app.key);
          if (runningApp) {
            // already managed
            const diffMs = Math.abs(now - runningApp.lastAccessedAt);
            const diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000);

            if (diffMins > runningApp.maxIdleTime - 1) {
              // ☠️ app should be stopped
              await provider.stopApp(app.key, app.region)
              await registry.removeApp(app.key);
            }
          } else {
            // not yet managed
            const runningApp = new RunningApp(provider.name, app.key, 'osc-fr1', config.startAndStop.maxIdleTime);
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
  await startScheduler();
  await startServer();
}

await main();

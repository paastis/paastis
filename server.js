import http from 'http';
import httpProxy from 'http-proxy';
import cron from 'node-cron';
import config from './config.js';
import provider from "./provider/index.js";
import registry from './registry/index.js';
import RunningApp from "./registry/RunningApp.js";
import redis from "./redis.js";

const startServer = async () => {
  try {
    const { host, port } = config.server;

    const proxy = httpProxy.createProxyServer({ changeOrigin: true, secure: false, preserveHeaderKeyCase: true });

    proxy.on('error', console.error);

    const server = http.createServer({
      insecureHTTPParser: true
    }, async (req, res) => {

      try {
        let proxyTarget = req.headers['PaastisProxyTarget'.toLowerCase()] || 'upstream';
        if (config.routing.systemApiEnabled && proxyTarget === 'system') {
          const givenApiToken = req.headers['PaastisProxySystemApiToken'];

          if (givenApiToken === config.routing.systemApiToken) {
            const data = await redis.keys('*');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'ok', running_apps: data }));
          } else {
           res.end(JSON.stringify(new Error('Wrong Paastis proxy system API token')));
          }
        } else {
          const url = new URL(req.url, `https://${req.headers.host}`);
          const appKey = url.hostname.replace(/\..*/, '');

          await provider.ensureAppIsRunning(appKey);
          let runningApp = await registry.getApp(appKey);
          if (runningApp) {
            runningApp.updateLastAccessedAt();
          } else {
            runningApp = new RunningApp(provider.name, appKey, 'osc-fr1');
          }

          await registry.setApp(runningApp);

          let target;
          if (config.provider.name === 'clever-cloud') {
            target = `https://${appKey.replace('app_', 'app-')}.cleverapps.io`;
          } else {
            target = `https://${appKey}.osc-fr1.scalingo.io`;
          }
          console.log(`target URL = ${target}`);
          proxy.web(req, res, { target });
        }

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
    console.log('Active apps: ', (await registry.listApps()));
  }

  await stopIdleApps();
  cron.schedule(config.startAndStop.checkingIntervalCron, stopIdleApps);
};

startServer();
startCron();

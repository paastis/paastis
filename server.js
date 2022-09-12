import http from 'http';
import httpProxy from 'http-proxy';
import cron from 'node-cron';
import config from './config.js';
import provider from "./provider/index.js";
import registry from './registry/index.js';
import RunningApp from "./registry/RunningApp.js";

const startServer = async () => {
  try {
    const { host, port } = config.server;

    const proxy = httpProxy.createProxyServer({ changeOrigin: true, secure: false, preserveHeaderKeyCase: true });

    proxy.on('error', (err) => {
      console.error(err);
    });

    const server = http.createServer({
      insecureHTTPParser: true
    }, (req, res) => {
      const url = new URL(req.url, `https://${req.headers.host}`);
      const appKey = url.hostname.replace(/\..*/, '');
      provider.ensureAppIsRunning(appKey)
        .then(() => registry.getApp(appKey))
        .then((runningApp) => {
          if (runningApp) {
            runningApp.updateLastAccessedAt();
            return runningApp;
          }
          return new RunningApp(provider.name, appKey, 'osc-fr1');
        })
        .then((runningApp) => registry.setApp(runningApp))
        .then(() => {
          let target;
          if (config.provider.name === 'clever-cloud') {
            target = `https://${appKey.replace('app_', 'app-')}.cleverapps.io`;
          } else {
            target = `https://${appKey}.osc-fr1.scalingo.io`;
          }
          console.log(`target URL = ${target}`);
          proxy.web(req, res, { target });
        }, (err) => {
          console.error(err);
          res.statusCode = 502;
          res.end(err.toString());
        });
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

console.log('Active apps: ', (await provider.listAllApps()));

/*

console.log('Active apps: ', (await provider.isAppRunning('app_0210ab5c-6baf-477b-8c0f-32c18a0e7fb6')));

*/


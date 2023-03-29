import cron from 'node-cron';
import { provider } from './provider/index.js';
import { factory, registry } from './registry/index.js';

export default class Scheduler {
  constructor(config) {
    this._config = config;

    this.stopIdleApps = this._stopIdleApps.bind(this);

    this._task = cron.schedule(
      this._config.startAndStop.checkingIntervalCron,
      this.stopIdleApps,
      {
        scheduled: false,
      }
    );
  }

  async start() {
    await this.stopIdleApps();
    this._task.start();
  }

  async stop() {
    this._task.stop();
  }

  async _stopIdleApps() {
    try {
      console.log('⏰ Checking apps to idle');
      const now = new Date(Date.now());

      const ignoredApps = this._config.registry.ignoredApps;

      const allApps = await provider.listAllApps();
      const apps = allApps.filter((a) => !ignoredApps.includes(a.name));

      // TODO: unregister apps that are not fetched from `listAllApps`

      for (const app of apps) {
        if (!app.isRunning) {
          await registry.unregisterApp(app.key);
        } else {
          let runningApp = await registry.getApp(app.key);
          if (runningApp) {
            // already managed
            const diffMs = Math.abs(now - runningApp.lastAccessedAt);
            const diffMins = Math.floor(
              ((diffMs % 86400000) % 3600000) / 60000
            );

            if (diffMins > runningApp.maxIdleTime - 1) {
              // ☠️ app should be stopped
              await provider.stopApp(app.key, app.region);
              await registry.unregisterApp(app.key);
            }
          } else {
            // not yet managed
            const runningApp = factory.createRunningAppForRegistration(app.key);
            await registry.setApp(runningApp);
          }
        }
      }
      const runningApps = await registry.listApps();
      if (runningApps) {
        console.log(
          JSON.stringify({ active_apps: runningApps.map((app) => app.name) })
        );
      }
    } catch (err) {
      console.error(err);
    }
  }
}

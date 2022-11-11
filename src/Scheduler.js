import cron from 'node-cron';
import provider from './provider/index.js';
import eventStore from './events/index.js';
import { factory, registry } from './registry/index.js';
import AppRemoved from "./events/AppRemoved.js";
import AppDetected from "./events/AppDetected.js";
import AppPaused from "./events/AppPaused.js";

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
      const paasApps = allApps.filter((a) => !ignoredApps.includes(a.name));

      // TODO: unregister apps that are not fetched from `listAllApps`

      for (const paasApp of paasApps) {
        if (!paasApp.isRunning) {
          const runningApp = await registry.getApp(paasApp.key)
          if (runningApp) {
            await registry.removeApp(paasApp.key);
            await eventStore.saveEvent(new AppRemoved(paasApp.key, new Date(Date.now())));
          }
        } else {
          let runningApp = await registry.getApp(paasApp.key);
          if (runningApp) {
            // already managed
            const diffMs = Math.abs(now - runningApp.lastAccessedAt);
            const diffMins = Math.floor(
              ((diffMs % 86400000) % 3600000) / 60000
            );

            if (diffMins > runningApp.maxIdleTime - 1) {
              // ☠️ app should be stopped
              await provider.stopApp(paasApp.key, paasApp.region);
              await registry.removeApp(paasApp.key);
              await eventStore.saveEvent(new AppPaused(paasApp.key, new Date(Date.now())));
            }
          } else {
            // not yet managed
            const runningApp = factory.createRunningAppForRegistration(paasApp.key);
            await registry.setApp(runningApp);
            await eventStore.saveEvent(new AppDetected(paasApp.key, new Date(Date.now())));
          }
        }
      }
      const runningApps = await registry.listApps();
      if (runningApps) {
        console.log(
          'Active apps: ',
          runningApps.map((app) => app.name)
        );
      }
    } catch (err) {
      console.error(err);
    }
  }
}

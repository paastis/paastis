import cron from 'node-cron';
import { logger } from './logger.js';
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
      logger.info('Checking apps to idle');
      const now = new Date(Date.now());

      const allApps = await provider.listAllApps();

      const ignoredApps = this._config.registry.ignoredApps;
      const providerApps = allApps.filter((a) => !ignoredApps.includes(a.name));

      // TODO: unregister apps that are not fetched from `listAllApps`

      for (const providerApp of providerApps) {
        if (!providerApp.isRunning) {
          await registry.unregisterApp(providerApp.key);
        } else {
          let runningApp = await registry.getApp(providerApp.key);
          if (runningApp) {
            // already managed
            const diffMs = Math.abs(now - runningApp.lastAccessedAt);
            const diffMins = Math.floor(
              ((diffMs % 86400000) % 3600000) / 60000
            );

            if (diffMins > runningApp.maxIdleTime - 1) {
              // ☠️ app should be stopped
              await provider.stopApp(providerApp.key, providerApp.region);
              await registry.unregisterApp(providerApp.key);
            }
          } else {
            // not yet managed
            const runningApp = factory.createRunningAppForRegistration(
              providerApp.key
            );
            await registry.setApp(runningApp);
          }
        }
      }
      const runningApps = await registry.listApps();
      if (runningApps) {
        const runningAppNames = runningApps.map((app) => app.name);
        logger.debug({ active_apps: runningAppNames });
      }
    } catch (err) {
      logger.error(err);
    }
  }
}

import { AppRegistered, AppUnregistered } from '../events/Event.js';
import RunningApp from './RunningApp.js';

export default class RunningAppRegistry {
  /**
   * @param runningAppsStore  // [app_name<String>, app<MonitoredApplication>]
   */
  constructor(store, factory, eventStore) {
    this._appStore = store;
    this._factory = factory;
    this._eventStore = eventStore;
  }

  /**
   * @param appKey
   * @returns {Promise<*[]>} An array with the app's name and its linked apps names
   */
  async registerApp(appKey) {
    const that = this;

    const registeredApps = [];

    async function doRegistration(appName) {
      if (registeredApps.includes(appName)) {
        return;
      }
      let runningApp = await that.getApp(appName);
      if (runningApp) {
        runningApp.updateLastAccessedAt();
      } else {
        runningApp = that._factory.createRunningAppForRegistration(appName);
      }
      await that.setApp(runningApp);
      registeredApps.push(appName);

      for (const linkedApp of runningApp.linkedApps) {
        await doRegistration(linkedApp);
      }
    }

    await doRegistration(appKey);
    return registeredApps;
  }

  async setApp(runningApp) {
    const shouldStoreEvent = !(await this._appStore.get(runningApp.name));

    await this._appStore.set(runningApp.name, runningApp);

    if (!shouldStoreEvent) {
      const event = new AppRegistered(runningApp.name);
      await this._eventStore.save(event);
    }
  }

  async getApp(appName) {
    const data = await this._appStore.get(appName);
    if (data) {
      return new RunningApp(
        data.provider,
        data.region,
        data.name,
        data.maxIdleTime,
        data.linkedApps,
        data.startedAt,
        data.lastAccessedAt
      );
    }
  }

  async unregisterApp(appName) {
    const runningApp = await this._appStore.get(appName);
    if (runningApp) {
      await this._appStore.delete(appName);

      const event = new AppUnregistered(appName);
      await this._eventStore.save(event);
    }
  }

  async listApps() {
    return await this._appStore.all();
  }

  async clear() {
    return await this._appStore.clear();
  }
}

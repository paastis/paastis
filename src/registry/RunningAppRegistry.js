import config from '../config.js';
import RunningApp from './RunningApp.js';

export default class RunningAppRegistry {

  /**
   * @param runningAppsStore  // [app_name<String>, app<MonitoredApplication>]
   */
  constructor(store, factory) {
    this._store = store;
    this._factory = factory;
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
    return await this._store.set(runningApp.name, runningApp);
  }

  async getApp(appName) {
    const data = await this._store.get(appName);
    if (data) {
      return new RunningApp(data.provider, data.region, data.name, data.maxIdleTime, data.linkedApps, data.startedAt, data.lastAccessedAt);
    }
  }

  async removeApp(appName) {
    await this._store.delete(appName);
  }

  async listApps() {
    return await this._store.all();
  }

  async clear() {
    return await this._store.clear();
  }
}

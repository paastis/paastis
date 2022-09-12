import RunningApp from "./RunningApp.js";

export default class RunningAppRegistry {

  /**
   * @param runningAppsStore  // [app_name<String>, app<MonitoredApplication>]
   */
  constructor(runningAppsStore) {
    this._runningApps = runningAppsStore;
  }

  async setApp(runningApp) {
    return await this._runningApps.set(runningApp.name, runningApp);
  }

  async getApp(appName) {
    const data = await this._runningApps.get(appName);
    if (data) {
      return new RunningApp(data._provider, data._name, data._region, data._startedAt, data._lastAccessedAt);
    }
  }

  async removeApp(appName) {
    await this._runningApps.delete(appName);
  }

  async listApps() {
    return Array.from(await this._runningApps.keys());
  }
}

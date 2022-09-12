export class PaasProvider {

  _name = 'undefined';

  constructor(name) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  async listAllApps() {
  }

  async isAppRunning(appId) {
  }

  async isAppStopped(appId) {
  }

  async ensureAppIsRunning(appId) {
    if (!(await this.isAppRunning(appId))) {
      await this.startApp(appId);
    }
  }

  async startApp(appId) {
  }

  async stopApp(appId) {
  }
}

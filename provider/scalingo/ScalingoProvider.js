import _ from 'lodash';
import { clientFromToken } from 'scalingo'
import config from "../../config.js";
import PaasProvider from "../PaasProvider.js";
import ScalingoApp from "../PaasApp.js";

export default class ScalingoProvider extends PaasProvider {

  _clientOscFr1;

  constructor() {
    super('scalingo');
  }

  async _getClient() {
    if (!this._clientOscFr1) {
      this._clientOscFr1 = await clientFromToken(config.provider.scalingo.apiToken, { apiUrl: 'https://api.osc-fr1.scalingo.com' })
    }
    return this._clientOscFr1;
  }

  async listAllApps() {
    let clientOscFr1 = await this._getClient();
    return (await clientOscFr1.Apps.all()).map(app => new ScalingoApp(app));
  }

  async isAppRunning(appId) {
    let client = await this._getClient();
    const processes = await client.Containers.processes(appId);
    const webProcesses = _.filter(processes, { type: 'web' });
    return webProcesses.length > 0 && _.every(webProcesses, { state: 'running' });
  }

  async isAppStopped(appId) {
    let client = await this._getClient();
    const processes = await client.Containers.processes(appId);
    const webProcesses = _.filter(processes, { type: 'web' });
    return webProcesses.length > 0 && _.every(webProcesses, { state: 'stopped' });
  }

  async awakeApp(appId) {
    let client = await this._getClient();
    let formation = await client.Containers.for(appId);
    formation.forEach((f) => (f.amount = 1));
    await client.Containers.scale(appId, formation);
  }

  async asleepApp(appId) {
    let client = await this._getClient();
    let formation = await client.Containers.for(appId);
    formation.forEach((f) => (f.amount = 0));
    await client.Containers.scale(appId, formation);
  }
}

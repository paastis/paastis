import _ from 'lodash';
import getClient from './scalingo.js';
import PaasProvider from '../PaasProvider.js';
import ScalingoApp from './ScalingoApp.js';

export default class ScalingoProvider extends PaasProvider {

  constructor() {
    super('scalingo');
  }

  async listAllApps() {
    let clientOscFr1 = await getClient();
    let scalingoApps = await clientOscFr1.Apps.all();
    return scalingoApps.map(app => new ScalingoApp(app));
  }

  async isAppRunning(appId) {
    let client = await getClient();
    const processes = await client.Containers.processes(appId);
    const webProcesses = _.filter(processes, { type: 'web' });
    return webProcesses.length > 0 && _.every(webProcesses, { state: 'running' });
  }

  async isAppStopped(appId) {
    let client = await getClient();
    const processes = await client.Containers.processes(appId);
    const webProcesses = _.filter(processes, { type: 'web' });
    return webProcesses.length > 0 && _.every(webProcesses, { state: 'stopped' });
  }

  async awakeApp(appId) {
    let client = await getClient();
    let formation = await client.Containers.for(appId);
    formation.forEach((f) => (f.amount = 1));
    await client.Containers.scale(appId, formation);
  }

  async asleepApp(appId) {
    let client = await getClient();
    let formation = await client.Containers.for(appId);
    formation.forEach((f) => (f.amount = 0));
    await client.Containers.scale(appId, formation);
  }
}

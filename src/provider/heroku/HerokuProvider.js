import _ from 'lodash';
import Promise from 'bluebird';
import PaasProvider from '../PaasProvider.js';
import HerokuApp from './HerokuApp.js';
import heroku from './heroku.js';

export default class HerokuProvider extends PaasProvider {
  constructor() {
    super('heroku');
  }

  async listAllApps() {
    const apps = await heroku.get('/apps');
    return Promise.map(apps, async (app) => {
      const formation = await heroku.get(`/apps/${app.name}/formation`);
      return new HerokuApp(app, formation);
    });
  }

  async isAppRunning(appId) {
    const formations = await heroku.get(`/apps/${appId}/formation`);
    const formation = _.find(formations, { type: 'web' });
    return formation.quantity > 0;
  }

  async isAppStopped(appId) {
    const formations = await heroku.get(`/apps/${appId}/formation`);
    const formation = _.find(formations, { type: 'web' });
    return formation.quantity === 0;
  }

  async awakeApp(appId) {
    const formations = await heroku.get(`/apps/${appId}/formation`);
    return await Promise.all(
      formations.map((formation) => {
        return heroku.patch(`/apps/${appId}/formation/${formation.type}`, {
          body: { quantity: 1 },
        });
      })
    );
  }

  async asleepApp(appId) {
    const formations = await heroku.get(`/apps/${appId}/formation`);
    return await Promise.all(
      formations.map((formation) => {
        return heroku.patch(`/apps/${appId}/formation/${formation.type}`, {
          body: { quantity: 0 },
        });
      })
    );
  }
}

import PaasApp from '../PaasApp.js';
import _ from 'lodash';

export default class HerokuApp extends PaasApp {

  constructor(app, formation) {
    super(app);
    this._formation = formation;
  }

  get key() {
    return this._app.name;
  }

  get status() {
    if (this._formation) {
      const web = _.find(this._formation, { type: 'web'});
      if (web) return "running";
      return "stopped";
    }
  }

  get isRunning() {
    return this.status === 'running'
  }

  get id() {
    return this._app.id
  }

  get provider() {
    return 'heroku';
  }

  get region() {
    return this._app.region.name;
  }

  get url() {
    return this._app.web_url;
  }

  get createdAt() {
    return this._app.created_at;
  }

  get updatedAt() {
    return this._app.updated_at;
  }

  get lastDeployedAt() {
    return this._app.released_at;
  }

  get forceHttps() {
    return this._app.force_https;
  }

  get stickySessions() {
    return this._app.sticky_session;
  }

  get gitUrl() {
    return this._app.git_url;
  }

}

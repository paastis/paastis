import { PaasApp } from "../PaasApp.js";

export default class ScalingoApp extends PaasApp {

  constructor(app) {
    super(app);
  }

  get key() {
    return this._app.name;
  }

  get status() {
    return this._app.status;
  }

  get id() {
    return this._app.id
  }

  get provider() {
    return 'scalingo';
  }

  get region() {
    return 'osc-fr1';
  }

  get url() {
    return this._app.url;
  }

  get createdAt() {
    return this._app.created_at;
  }

  get updatedAt() {
    return this._app.updated_at;
  }

  get lastDeployedAt() {
    return this._app.last_deployed_at;
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

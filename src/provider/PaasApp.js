export default class PaasApp {

  _app;

  constructor(app) {
    this._app = app;
  }

  get status() {
    throw new Error('Not yet implemented');
  }

  get isRunning() {
    return this.status === 'running'
  }

  get key() {
    throw new Error('Not yet implemented');
  }

  get id() {
    return this._app.id;
  }

  get name() {
    return this._app.name;
  }

  get region() {
    throw new Error('Not yet implemented');
  }

  get url() {
    throw new Error('Not yet implemented');
  }

  get createdAt() {
    throw new Error('Not yet implemented');
  }

  get updatedAt() {
    throw new Error('Not yet implemented');
  }

  get lastDeployedAt() {
    throw new Error('Not yet implemented');
  }

  get forceHttps() {
    throw new Error('Not yet implemented');
  }

  get stickySession() {
    throw new Error('Not yet implemented');
  }

  get gitUrl() {
    throw new Error('Not yet implemented');
  }

  get stack() {
    throw new Error('Not yet implemented');
  }

  get slug() {
    throw new Error('Not yet implemented');
  }

  get framework() {
    throw new Error('Not yet implemented');
  }

}


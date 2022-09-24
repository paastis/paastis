export default class PaasApp {

  _app;

  constructor(app) {
    this._app = app;
  }

  get status() {
  }

  get isRunning() {
    return this.status === 'running'
  }

  get key() {
  }

  get id() {
    return this._app.id;
  }

  get name() {
    return this._app.name;
  }

  get region() {

  }

  get url() {
  }

  get createdAt() {
  }

  get updatedAt() {
  }

  get lastDeployedAt() {
  }

  get forceHttps() {

  }

  get stickySession() {

  }

  get gitUrl() {

  }

  get stack() {

  }

  get slug() {

  }

  get framework() {

  }

}


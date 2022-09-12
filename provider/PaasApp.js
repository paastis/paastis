import { getStatus } from "@clevercloud/client/cjs/utils/app-status.js";

export class PaasApp {

  _app;

  constructor(app) {
    this._app = app;
  }

  get status() {

  }

  get key() {

  }
}

export class ScalingoApp extends PaasApp {

  constructor(app) {
    super(app);
  }

  get key() {
    return this._app.name;
  }

  get status() {
    return this._app.status;
  }
}

export class CleverCloudApp extends PaasApp {

  _deployments;
  _instances;

  constructor(app, deployments, instances) {
    super(app);
    this._deployments = deployments;
    this._instances = instances;
  }

  get key() {
    return this._app.id;
  }

  get status() {
    const res = getStatus(this._app, this._deployments, this._instances);
    console.log(`status of app ${this.key} = ${res}`);
    return res;
  }
}

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
    return getStatus(this._app, this._deployments, this._instances);
  }

  get provider() {
    return 'clever-cloud';
  }

  get region() {
    return this._app.zone;
  }

  get url() {
    return this._app.deployment.url;
  }

  get createdAt() {
    return new Date(this._app.creationDate);
  }

  get updatedAt() {
    return this._app.updated_at;
  }

  get lastDeployedAt() {
    return new Date(this._app.last_deploy);
  }

  get forceHttps() {
    return this._app.forceHttps === 'ENABLED';
  }

  get stickySessions() {
    return this._app.stickySessions;
  }

  get gitUrl() {
    return this._app.deployUrl;
  }
}

import { getStatus } from '@clevercloud/client/cjs/utils/app-status.js';
import PaasApp from '../PaasApp.js';

export default class CleverCloudApp extends PaasApp {
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
    return this.lastDeployedAt;
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

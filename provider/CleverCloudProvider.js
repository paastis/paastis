import { addOauthHeader } from '@clevercloud/client/cjs/oauth.node.js';
import { prefixUrl } from '@clevercloud/client/cjs/prefix-url.js';
import { request } from '@clevercloud/client/cjs/request.superagent.js';
import application from '@clevercloud/client/cjs/api/v2/application.js';

import { PaasProvider } from "./PaasProvider.js";
import config from "../config.js";
import { getStatus } from "@clevercloud/client/cjs/utils/app-status.js";
import { CleverCloudApp } from "./PaasApp.js";

export class CleverCloudProvider extends PaasProvider {

  constructor() {
    super('clever-cloud');
  }

  async _sendToApi(requestParams) {

    // load and cache config and tokens
    const API_HOST = config.provider.clever.apiHost;
    const tokens = {
      OAUTH_CONSUMER_KEY: config.provider.clever.oauthConsumerKey,
      OAUTH_CONSUMER_SECRET: config.provider.clever.oauthConsumerSecret,
      API_OAUTH_TOKEN: config.provider.clever.apiOauthToken,
      API_OAUTH_TOKEN_SECRET: config.provider.clever.apiOauthTokenSecret,
    }

    return Promise.resolve(requestParams)
      .then(prefixUrl(API_HOST))
      .then(addOauthHeader(tokens))
      .then(request);
    // chain a .catch() call here if you need to handle some errors or maybe redirect to login
  }

  async listAllApps() {
    const apps = await application.getAll({}).then(this._sendToApi);
    return Promise.all(apps.map(async (app) => {
      const instances = await (application.getAllInstances({ appId: app.id }).then(this._sendToApi));
      return new CleverCloudApp(app, null, instances);
    }));
  }

  async isAppRunning(appId) {
    // Inspired / copied from https://github.com/CleverCloud/clever-tools/blob/c276982ddd73982c92a70721ae9a9c939b1b8a6e/src/commands/status.js#L24-L43
    const app = await application.get({ appId }).then(this._sendToApi);
    const instances = await application.getAllInstances({ appId }).then(this._sendToApi);
    const status = getStatus(app, null, instances);
    return status === 'running';
  }

  async isAppStopped(appId) {
    const app = await application.get({ appId }).then(this._sendToApi);
    return getStatus(app) === 'stopped';
  }

  async startApp(appId) {
    console.log(`Starting app ${appId}…`);
    const res = await application.redeploy({ appId }).then(this._sendToApi);

    let count = 0;
    while (count++ < 30) {
      console.log(`Waiting app ${appId} to be running…`);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const isAppRunning = await this.isAppRunning(appId);
      if (isAppRunning) {
        return
      }
    }
    new Error(`Timed out waiting for app ${appId} to be running`);
  }

  async stopApp(appId) {
    console.log(`Stopping app ${appId}…`);
    await application.undeploy({ appId }).then(this._sendToApi);
    let count = 0;
    while (count++ < 30) {
      console.log(`Waiting app ${appId} to be stopped…`);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const isAppStopped = await this.isAppStopped(appId);
      if (isAppStopped) {
        return
      }
    }
    new Error(`Timed out waiting for app ${appId} to be stopped`);
  }
}

import { spawn } from 'child_process';
import Promise from 'bluebird';
import config from '../config.js';
import eventStore from '../events/index.js';
import AppResumed from "../events/AppResumed.js";

export default class PaasProvider {
  constructor(name) {
    this._name = name;
    this.ensureAppIsRunning = this.ensureAppIsRunning.bind(this);
  }

  _name = 'undefined';

  get name() {
    return this._name;
  }

  getSimulatorPricing() {
    throw new Error('Not yet implemented');
  }

  getPricing() {
    throw new Error('Not yet implemented');
  }

  async listAllApps() {
    throw new Error('Not yet implemented');
  }

  async isAppRunning(appId) {
    throw new Error('Not yet implemented');
  }

  async isAppStopped(appId) {
    throw new Error('Not yet implemented');
  }

  async ensureAppIsRunning(appId) {
    if (!(await this.isAppRunning(appId))) {
      await this.startApp(appId);
      await eventStore.saveEvent(new AppResumed(appId, new Date(Date.now())));
    }
  }

  async ensureGroupIsRunning(appKeys) {
    return Promise.all(
      appKeys.map((appKey) => this.ensureAppIsRunning(appKey))
    );
  }

  async awakeApp(appId) {
    throw new Error('Not yet implemented');
  }

  async startApp(appId) {
    const that = this;

    async function executeStartApp(resolve, reject) {
      console.log(`Going to start app ${appId}`);

      await that.awakeApp(appId);

      let count = 0;

      while (count++ < config.provider.scalingo.operationTimeout) {
        console.log(`Waiting app ${appId} to be running…`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const isAppRunning = await that.isAppRunning(appId);
        if (isAppRunning) {
          console.log(`✅ App ${appId} started and running`);

          if (config.hooks.afterAppStart) {
            const afterAppStart = spawn(config.hooks.afterAppStart, {
              shell: true,
            });
            afterAppStart.stdout.on('data', (data) => {
              console.log(`stdout: ${data}`);
            });
            afterAppStart.stderr.on('data', (data) => {
              console.error(`stderr: ${data}`);
            });
            afterAppStart.on('close', async (code) => {
              return resolve();
            });
          }
          return resolve();
        }
      }
      return reject(
        new Error(`Timed out waiting for app ${appId} to be running`)
      );
    }

    return new Promise((resolve, reject) => {
      if (config.hooks.beforeAppStart) {
        const beforeAppStart = spawn(config.hooks.beforeAppStart, {
          shell: true,
        });
        beforeAppStart.stdout.on('data', (data) => {
          console.log(`stdout: ${data}`);
        });
        beforeAppStart.stderr.on('data', (data) => {
          console.error(`stderr: ${data}`);
        });
        beforeAppStart.on('close', (code) => {
          executeStartApp(resolve, reject);
        });
      } else {
        executeStartApp(resolve, reject);
      }
    });
  }

  async asleepApp(appId) {
    throw new Error('Not yet implemented');
  }

  async stopApp(appId) {
    const that = this;

    async function executeStopApp(resolve, reject) {
      console.log(`Stopping app ${appId}`);

      await that.asleepApp(appId);

      if (config.hooks.afterAppStop) {
        const afterAppStop = spawn(config.hooks.afterAppStop, { shell: true });
        afterAppStop.stdout.on('data', (data) => {
          console.log(`stdout: ${data}`);
        });
        afterAppStop.stderr.on('data', (data) => {
          console.error(`stderr: ${data}`);
        });
        afterAppStop.on('close', async (code) => {
          return resolve();
        });
      }
      return resolve();
    }

    return new Promise((resolve, reject) => {
      if (config.hooks.beforeAppStop) {
        const beforeAppStop = spawn(config.hooks.beforeAppStop, {
          shell: true,
        });
        beforeAppStop.stdout.on('data', (data) => {
          console.log(`stdout: ${data}`);
        });
        beforeAppStop.stderr.on('data', (data) => {
          console.error(`stderr: ${data}`);
        });
        beforeAppStop.on('close', (code) => {
          executeStopApp(resolve, reject);
        });
      } else {
        executeStopApp(resolve, reject);
      }
    });
  }
}

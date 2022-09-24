import fs from 'fs';
import yaml from 'js-yaml';
import RunningApp from './RunningApp.js';
import provider from '../provider/index.js';
import config from '../config.js';

export default class RunningAppFactory {

  constructor(userConfig) {
    this._userConfig = userConfig;
  }

  createRunningAppForRegistration(providerName, providerZone, appKey, appGroup) {
    const runningApp = new RunningApp(provider.name, providerZone, appKey, appGroup, config.startAndStop.maxIdleTime);

    this._userConfig?.rules?.forEach((rule) => {
      const regex = new RegExp(rule.pattern);
      const found = regex.test(appKey);
      if (found) {
        const matches = appKey.match(regex);

        function interpolate(str) {
          let result = str;
          for (let j = 1; j < matches.length; j++) {
            result = result.replace(`$${j}`, matches[j]);
          }
          return result;
        }

        if (rule.provider_name) runningApp.provider = interpolate(rule.provider_name);
        if (rule.provider_zone) runningApp.region = interpolate(rule.provider_zone);
        if (rule.app_name) runningApp.name = interpolate(rule.app_name);
        if (rule.app_group) runningApp.group = interpolate(rule.app_group);
        if (rule.app_max_idle_time) runningApp.maxIdleTime = rule.app_max_idle_time;
      }
    });
    return runningApp;
  }
}

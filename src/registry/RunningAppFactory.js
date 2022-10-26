import RunningApp from "./RunningApp.js";
import config from "../config.js";

export default class RunningAppFactory {
  constructor(userConfig) {
    this._userConfig = userConfig;
  }

  createRunningAppForRegistration(appKey) {
    const runningApp = new RunningApp(
      config.provider.name,
      config.provider.region,
      appKey,
      config.startAndStop.maxIdleTime
    );

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

        if (rule.app_name) runningApp.name = interpolate(rule.app_name);
        if (typeof rule.app_max_idle_time !== "undefined")
          runningApp.maxIdleTime = rule.app_max_idle_time;
        if (rule.linked_apps)
          runningApp.linkedApps = rule.linked_apps.map((linkedApp) =>
            interpolate(linkedApp)
          );
      }
    });

    return runningApp;
  }
}

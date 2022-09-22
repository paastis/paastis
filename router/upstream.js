import provider from "../provider/index.js";
import registry from "../registry/index.js";
import RunningApp from "../registry/RunningApp.js";
import config from "../config.js";
import httpProxy from "http-proxy";

const proxy = httpProxy.createProxyServer({ changeOrigin: true, secure: false, preserveHeaderKeyCase: true });

proxy.on('error', console.error);

export default async (req, res) => {
  const url = new URL(req.url, `https://${req.headers.host}`);
  const appKey = url.hostname.replace(/\..*/, '');

  await provider.ensureAppIsRunning(appKey);
  let runningApp = await registry.getApp(appKey);
  if (runningApp) {
    runningApp.updateLastAccessedAt();
  } else {
    runningApp = new RunningApp(provider.name, appKey, 'osc-fr1', config.startAndStop.maxIdleTime);
  }

  await registry.setApp(runningApp);

  let target;
  if (config.provider.name === 'clever-cloud') {
    target = `https://${appKey.replace('app_', 'app-')}.cleverapps.io`;
  } else if (config.provider.name === 'heroku') {
    target = `https://${appKey}.herokuapp.com`;
  } else {
    target = `https://${appKey}.osc-fr1.scalingo.io`;
  }
  console.log(`target URL = ${target}`);
  return proxy.web(req, res, { target });
}

import provider from '../provider/index.js';
import { registry } from '../registry/index.js';
import config from '../config.js';
import httpProxy from 'http-proxy';

const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  secure: false,
  preserveHeaderKeyCase: true,
});

proxy.on('error', console.error);

export default async (req, res) => {
  const url = new URL(req.url, `https://${req.headers.host}`);
  const appKey = url.hostname.replace(/\..*/, '');

  // 1) Register app
  const appKeys = await registry.registerApp(appKey);

  // 2) Run apps
  for (const appKey of appKeys) {
    await provider.ensureAppIsRunning(appKey);
  }

  // 3) Redirect to upstream
  let target;
  if (config.provider.name === 'clever-cloud') {
    target = `https://${appKey.replace('app_', 'app-')}.cleverapps.io`;
  } else if (config.provider.name === 'heroku') {
    target = `https://${appKey}.herokuapp.com`;
  } else {
    target = `https://${appKey}.osc-fr1.scalingo.io`;
  }
  return proxy.web(req, res, { target });
};

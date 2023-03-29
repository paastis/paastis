import httpProxy from 'http-proxy';
import config from '../config.js';
import { provider } from '../provider/index.js';
import { registry } from '../registry/index.js';

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
  try {
    for (const appKey of appKeys) {
      await provider.ensureAppIsRunning(appKey);
    }
  } catch (err) {
    console.log({ msg:'error starting app', appKey, err: err.stack });
    res.writeHead(500).end();
  }

  // 3) Redirect to upstream
  let upstream;
  if (config.provider.name === 'clever-cloud') {
    upstream = `https://${appKey.replace('app_', 'app-')}.cleverapps.io`;
  } else if (config.provider.name === 'heroku') {
    upstream = `https://${appKey}.herokuapp.com`;
  } else {
    upstream = `https://${appKey}.osc-fr1.scalingo.io`;
  }
  return proxy.web(req, res, { target: upstream });
};

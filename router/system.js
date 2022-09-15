import config from "../config.js";
import redis from "../redis.js";
import registry from "../registry/index.js";

export default async (req, res) => {
  const givenApiToken = req.headers['PaastisProxySystemApiToken'.toLowerCase()];

  if (givenApiToken === config.routing.systemApiToken) {
    const data = await registry.listApps();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', running_apps: data }));
  } else {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(new Error('Wrong Paastis proxy system API token')));
  }
}

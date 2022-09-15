import config from "../config.js";
import redis from "../redis.js";

export default async (req, res) => {
  const givenApiToken = req.headers['PaastisProxySystemApiToken'];

  if (givenApiToken === config.routing.systemApiToken) {
    const data = await redis.keys('*');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', running_apps: data }));
  } else {
    res.end(JSON.stringify(new Error('Wrong Paastis proxy system API token')));
  }
}

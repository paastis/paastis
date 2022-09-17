import config from "../config.js";
import registry from "../registry/index.js";

export default async (req, res) => {
  const givenApiToken = req.headers['PaastisProxySystemApiToken'.toLowerCase()];

  if (givenApiToken === config.routing.systemApiToken) {

    const { url, method } = req;

    if (url === '/apps') {
      if (method === 'GET') {

        // GET /apps
        try {
          const data = await registry.listApps();
          if (data) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
          } else {
            res.statusCode = 204;
            res.end();
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        if (method === 'DELETE') {

          // DELETE /apps
          await registry.clear();
          res.statusCode = 204;
          res.end();
        } else {
          res.end();
        }
      }
    } else {
      res.end();
    }
  } else {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(new Error('Wrong Paastis proxy system API token')));
  }
}

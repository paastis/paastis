import _ from 'lodash';
import config from "../config.js";
import { registry } from "../registry/index.js";
import provider from "../provider/index.js";

export default async (req, res) => {
  try {

    const givenApiToken = req.headers['PaastisProxySystemApiToken'.toLowerCase()];

    if (givenApiToken && givenApiToken === config.routing.systemApiToken) {

      const { url, method } = req;

      if (url === '/apps' && method === 'GET') {
        // GET /apps
        const providerApps = await provider.listAllApps();
        const registeredApps = await registry.listApps();

        const apps = providerApps.reduce((arr, paasApp) => {
          const registeredApp = _.find(registeredApps, { name: paasApp.key });
          const app = {
            created_at: paasApp.createdAt,
            force_https: paasApp.forceHttps,
            git_url: paasApp.gitUrl,
            id: paasApp.id,
            last_deployed_at: paasApp.lastDeployedAt,
            name: paasApp.name,
            region: paasApp.region,
            status: paasApp.status,
            sticky_session: paasApp.stickySessions,
            updated_at: paasApp.updatedAt,
            url: paasApp.url,
          };
          app.is_monitored = !!registeredApp;
          if (registeredApp) {
            app.provider = registeredApp.provider;
            app.region = registeredApp.region;
            app.max_idle_time = registeredApp.maxIdleTime;
            app.last_accessed_at = registeredApp.lastAccessedAt;
          }
          arr.push(app);
          return arr;
        }, []);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(apps));
      }

      // DELETE /apps
      if (url === '/apps' && method === 'DELETE') {
        await registry.clear();
        res.statusCode = 204;
        res.end();
      }
      res.end();
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(new Error('Wrong or missing Paastis proxy system API token')));
    }
  } catch
    (err) {
    console.error(err);
  }
}

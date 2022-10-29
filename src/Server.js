import http from 'http';
import { system, upstream } from './router/index.js';

export default class Server {
  constructor(config) {
    this._config = config;
    this._host = this._config.server.host;
    this._port = this._config.server.port;
    this._systemApiEnabled = this._config.routing.systemApiEnabled;
    this._server = http.createServer(
      {
        insecureHTTPParser: true,
      },
      async (req, res) => {
        try {
          let proxyTarget =
            req.headers['PaastisProxyTarget'.toLowerCase()] || 'upstream';
          if (this._systemApiEnabled && proxyTarget === 'system') {
            return system(req, res);
          }
          return upstream(req, res);
        } catch (err) {
          console.error(err);
          res.statusCode = 502;
          res.end(err.toString());
        }
      }
    );
  }

  async start() {
    try {
      this._server.listen(this._port, this._host, () => {
        console.log(`Server is running on https://${this._host}:${this._port}`);
      });
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }

  async stop() {
    try {
      this._server.stop();
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
}
